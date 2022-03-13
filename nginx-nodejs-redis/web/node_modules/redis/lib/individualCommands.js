'use strict';

var utils = require('./utils');
var debug = require('./debug');
var Multi = require('./multi');
var Command = require('./command');
var no_password_is_set = /no password is set|called without any password configured/;
var loading = /LOADING/;
var RedisClient = require('../').RedisClient;

/********************************************************************************************
 Replace built-in redis functions

 The callback may be hooked as needed. The same does not apply to the rest of the function.
 State should not be set outside of the callback if not absolutly necessary.
 This is important to make sure it works the same as single command or in a multi context.
 To make sure everything works with the offline queue use the "call_on_write" function.
 This is going to be executed while writing to the stream.

 TODO: Implement individal command generation as soon as possible to prevent divergent code
 on single and multi calls!
********************************************************************************************/

RedisClient.prototype.multi = RedisClient.prototype.MULTI = function multi (args) {
    var multi = new Multi(this, args);
    multi.exec = multi.EXEC = multi.exec_transaction;
    return multi;
};

// ATTENTION: This is not a native function but is still handled as a individual command as it behaves just the same as multi
RedisClient.prototype.batch = RedisClient.prototype.BATCH = function batch (args) {
    return new Multi(this, args);
};

function select_callback (self, db, callback) {
    return function (err, res) {
        if (err === null) {
            // Store db in this.select_db to restore it on reconnect
            self.selected_db = db;
        }
        utils.callback_or_emit(self, callback, err, res);
    };
}

RedisClient.prototype.select = RedisClient.prototype.SELECT = function select (db, callback) {
    return this.internal_send_command(new Command('select', [db], select_callback(this, db, callback)));
};

Multi.prototype.select = Multi.prototype.SELECT = function select (db, callback) {
    this.queue.push(new Command('select', [db], select_callback(this._client, db, callback)));
    return this;
};

RedisClient.prototype.monitor = RedisClient.prototype.MONITOR = function monitor (callback) {
    // Use a individual command, as this is a special case that does not has to be checked for any other command
    var self = this;
    var call_on_write = function () {
        // Activating monitor mode has to happen before Redis returned the callback. The monitor result is returned first.
        // Therefore we expect the command to be properly processed. If this is not the case, it's not an issue either.
        self.monitoring = true;
    };
    return this.internal_send_command(new Command('monitor', [], callback, call_on_write));
};

// Only works with batch, not in a transaction
Multi.prototype.monitor = Multi.prototype.MONITOR = function monitor (callback) {
    // Use a individual command, as this is a special case that does not has to be checked for any other command
    if (this.exec !== this.exec_transaction) {
        var self = this;
        var call_on_write = function () {
            self._client.monitoring = true;
        };
        this.queue.push(new Command('monitor', [], callback, call_on_write));
        return this;
    }
    // Set multi monitoring to indicate the exec that it should abort
    // Remove this "hack" as soon as Redis might fix this
    this.monitoring = true;
    return this;
};

function quit_callback (self, callback) {
    return function (err, res) {
        if (err && err.code === 'NR_CLOSED') {
            // Pretent the quit command worked properly in this case.
            // Either the quit landed in the offline queue and was flushed at the reconnect
            // or the offline queue is deactivated and the command was rejected right away
            // or the stream is not writable
            // or while sending the quit, the connection ended / closed
            err = null;
            res = 'OK';
        }
        utils.callback_or_emit(self, callback, err, res);
        if (self.stream.writable) {
            // If the socket is still alive, kill it. This could happen if quit got a NR_CLOSED error code
            self.stream.destroy();
        }
    };
}

RedisClient.prototype.QUIT = RedisClient.prototype.quit = function quit (callback) {
    // TODO: Consider this for v.3
    // Allow the quit command to be fired as soon as possible to prevent it landing in the offline queue.
    // this.ready = this.offline_queue.length === 0;
    var backpressure_indicator = this.internal_send_command(new Command('quit', [], quit_callback(this, callback)));
    // Calling quit should always end the connection, no matter if there's a connection or not
    this.closing = true;
    this.ready = false;
    return backpressure_indicator;
};

// Only works with batch, not in a transaction
Multi.prototype.QUIT = Multi.prototype.quit = function quit (callback) {
    var self = this._client;
    var call_on_write = function () {
        // If called in a multi context, we expect redis is available
        self.closing = true;
        self.ready = false;
    };
    this.queue.push(new Command('quit', [], quit_callback(self, callback), call_on_write));
    return this;
};

function info_callback (self, callback) {
    return function (err, res) {
        if (res) {
            var obj = {};
            var lines = res.toString().split('\r\n');
            var line, parts, sub_parts;

            for (var i = 0; i < lines.length; i++) {
                parts = lines[i].split(':');
                if (parts[1]) {
                    if (parts[0].indexOf('db') === 0) {
                        sub_parts = parts[1].split(',');
                        obj[parts[0]] = {};
                        while (line = sub_parts.pop()) {
                            line = line.split('=');
                            obj[parts[0]][line[0]] = +line[1];
                        }
                    } else {
                        obj[parts[0]] = parts[1];
                    }
                }
            }
            obj.versions = [];
            if (obj.redis_version) {
                obj.redis_version.split('.').forEach(function (num) {
                    obj.versions.push(+num);
                });
            }
            // Expose info key/vals to users
            self.server_info = obj;
        } else {
            self.server_info = {};
        }
        utils.callback_or_emit(self, callback, err, res);
    };
}

// Store info in this.server_info after each call
RedisClient.prototype.info = RedisClient.prototype.INFO = function info (section, callback) {
    var args = [];
    if (typeof section === 'function') {
        callback = section;
    } else if (section !== undefined) {
        args = Array.isArray(section) ? section : [section];
    }
    return this.internal_send_command(new Command('info', args, info_callback(this, callback)));
};

Multi.prototype.info = Multi.prototype.INFO = function info (section, callback) {
    var args = [];
    if (typeof section === 'function') {
        callback = section;
    } else if (section !== undefined) {
        args = Array.isArray(section) ? section : [section];
    }
    this.queue.push(new Command('info', args, info_callback(this._client, callback)));
    return this;
};

function auth_callback (self, pass, user, callback) {
    return function (err, res) {
        if (err) {
            if (no_password_is_set.test(err.message)) {
                self.warn('Warning: Redis server does not require a password, but a password was supplied.');
                err = null;
                res = 'OK';
            } else if (loading.test(err.message)) {
                // If redis is still loading the db, it will not authenticate and everything else will fail
                debug('Redis still loading, trying to authenticate later');
                setTimeout(function () {
                    self.auth(pass, user, callback);
                }, 100);
                return;
            }
        }
        utils.callback_or_emit(self, callback, err, res);
    };
}

RedisClient.prototype.auth = RedisClient.prototype.AUTH = function auth (pass, user, callback) {
    debug('Sending auth to ' + this.address + ' id ' + this.connection_id);

    // Backward compatibility support for auth with password only
    if (user instanceof Function) {
        callback = user;
        user = null;
    }
    // Stash auth for connect and reconnect.
    this.auth_pass = pass;
    this.auth_user = user;
    var ready = this.ready;
    this.ready = ready || this.offline_queue.length === 0;
    var tmp = this.internal_send_command(new Command('auth', user ? [user, pass] : [pass], auth_callback(this, pass, user, callback)));
    this.ready = ready;
    return tmp;
};

// Only works with batch, not in a transaction
Multi.prototype.auth = Multi.prototype.AUTH = function auth (pass, user, callback) {
    debug('Sending auth to ' + this.address + ' id ' + this.connection_id);

    // Backward compatibility support for auth with password only
    if (user instanceof Function) {
        callback = user;
        user = null;
    }
    // Stash auth for connect and reconnect.
    this.auth_pass = pass;
    this.auth_user = user;
    this.queue.push(new Command('auth', user ? [user, pass] : [pass], auth_callback(this._client, pass, user, callback)));
    return this;
};

RedisClient.prototype.client = RedisClient.prototype.CLIENT = function client () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
            callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
            arr[i + 1] = arguments[1][i];
        }
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this;
    var call_on_write = undefined;
    // CLIENT REPLY ON|OFF|SKIP
    /* istanbul ignore next: TODO: Remove this as soon as Travis runs Redis 3.2 */
    if (arr.length === 2 && arr[0].toString().toUpperCase() === 'REPLY') {
        var reply_on_off = arr[1].toString().toUpperCase();
        if (reply_on_off === 'ON' || reply_on_off === 'OFF' || reply_on_off === 'SKIP') {
            call_on_write = function () {
                self.reply = reply_on_off;
            };
        }
    }
    return this.internal_send_command(new Command('client', arr, callback, call_on_write));
};

Multi.prototype.client = Multi.prototype.CLIENT = function client () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
            callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
            arr[i + 1] = arguments[1][i];
        }
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this._client;
    var call_on_write = undefined;
    // CLIENT REPLY ON|OFF|SKIP
    /* istanbul ignore next: TODO: Remove this as soon as Travis runs Redis 3.2 */
    if (arr.length === 2 && arr[0].toString().toUpperCase() === 'REPLY') {
        var reply_on_off = arr[1].toString().toUpperCase();
        if (reply_on_off === 'ON' || reply_on_off === 'OFF' || reply_on_off === 'SKIP') {
            call_on_write = function () {
                self.reply = reply_on_off;
            };
        }
    }
    this.queue.push(new Command('client', arr, callback, call_on_write));
    return this;
};

RedisClient.prototype.hmset = RedisClient.prototype.HMSET = function hmset () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
            callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
            arr[i + 1] = arguments[1][i];
        }
    } else if (typeof arguments[1] === 'object' && (arguments.length === 2 || arguments.length === 3 && (typeof arguments[2] === 'function' || typeof arguments[2] === 'undefined'))) {
        arr = [arguments[0]];
        for (var field in arguments[1]) {
            arr.push(field, arguments[1][field]);
        }
        callback = arguments[2];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    return this.internal_send_command(new Command('hmset', arr, callback));
};

Multi.prototype.hmset = Multi.prototype.HMSET = function hmset () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
    } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
            callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
            arr[i + 1] = arguments[1][i];
        }
    } else if (typeof arguments[1] === 'object' && (arguments.length === 2 || arguments.length === 3 && (typeof arguments[2] === 'function' || typeof arguments[2] === 'undefined'))) {
        arr = [arguments[0]];
        for (var field in arguments[1]) {
            arr.push(field, arguments[1][field]);
        }
        callback = arguments[2];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    this.queue.push(new Command('hmset', arr, callback));
    return this;
};

RedisClient.prototype.subscribe = RedisClient.prototype.SUBSCRIBE = function subscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this;
    var call_on_write = function () {
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command('subscribe', arr, callback, call_on_write));
};

Multi.prototype.subscribe = Multi.prototype.SUBSCRIBE = function subscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this._client;
    var call_on_write = function () {
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command('subscribe', arr, callback, call_on_write));
    return this;
};

RedisClient.prototype.unsubscribe = RedisClient.prototype.UNSUBSCRIBE = function unsubscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this;
    var call_on_write = function () {
        // Pub sub has to be activated even if not in pub sub mode, as the return value is manipulated in the callback
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command('unsubscribe', arr, callback, call_on_write));
};

Multi.prototype.unsubscribe = Multi.prototype.UNSUBSCRIBE = function unsubscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this._client;
    var call_on_write = function () {
        // Pub sub has to be activated even if not in pub sub mode, as the return value is manipulated in the callback
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command('unsubscribe', arr, callback, call_on_write));
    return this;
};

RedisClient.prototype.psubscribe = RedisClient.prototype.PSUBSCRIBE = function psubscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this;
    var call_on_write = function () {
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command('psubscribe', arr, callback, call_on_write));
};

Multi.prototype.psubscribe = Multi.prototype.PSUBSCRIBE = function psubscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this._client;
    var call_on_write = function () {
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command('psubscribe', arr, callback, call_on_write));
    return this;
};

RedisClient.prototype.punsubscribe = RedisClient.prototype.PUNSUBSCRIBE = function punsubscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this;
    var call_on_write = function () {
        // Pub sub has to be activated even if not in pub sub mode, as the return value is manipulated in the callback
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    return this.internal_send_command(new Command('punsubscribe', arr, callback, call_on_write));
};

Multi.prototype.punsubscribe = Multi.prototype.PUNSUBSCRIBE = function punsubscribe () {
    var arr,
        len = arguments.length,
        callback,
        i = 0;
    if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
    } else {
        len = arguments.length;
        // The later should not be the average use case
        if (len !== 0 && (typeof arguments[len - 1] === 'function' || typeof arguments[len - 1] === 'undefined')) {
            len--;
            callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
            arr[i] = arguments[i];
        }
    }
    var self = this._client;
    var call_on_write = function () {
        // Pub sub has to be activated even if not in pub sub mode, as the return value is manipulated in the callback
        self.pub_sub_mode = self.pub_sub_mode || self.command_queue.length + 1;
    };
    this.queue.push(new Command('punsubscribe', arr, callback, call_on_write));
    return this;
};
