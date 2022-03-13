'use strict';

var commands = require('redis-commands');
var Multi = require('./multi');
var RedisClient = require('../').RedisClient;
var Command = require('./command');

var addCommand = function (command) {
    // Some rare Redis commands use special characters in their command name
    // Convert those to a underscore to prevent using invalid function names
    var commandName = command.replace(/(?:^([0-9])|[^a-zA-Z0-9_$])/g, '_$1');

    // Do not override existing functions
    if (!RedisClient.prototype[command]) {
        RedisClient.prototype[command.toUpperCase()] = RedisClient.prototype[command] = function () {
            var arr;
            var len = arguments.length;
            var callback;
            var i = 0;
            if (Array.isArray(arguments[0])) {
                arr = arguments[0];
                if (len === 2) {
                    callback = arguments[1];
                }
            } else if (len > 1 && Array.isArray(arguments[1])) {
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
            return this.internal_send_command(new Command(command, arr, callback));
        };
        // Alias special function names (e.g. NR.RUN becomes NR_RUN and nr_run)
        if (commandName !== command) {
            RedisClient.prototype[commandName.toUpperCase()] = RedisClient.prototype[commandName] = RedisClient.prototype[command];
        }
        Object.defineProperty(RedisClient.prototype[command], 'name', {
            value: commandName
        });
    }

    // Do not override existing functions
    if (!Multi.prototype[command]) {
        Multi.prototype[command.toUpperCase()] = Multi.prototype[command] = function () {
            var arr;
            var len = arguments.length;
            var callback;
            var i = 0;
            if (Array.isArray(arguments[0])) {
                arr = arguments[0];
                if (len === 2) {
                    callback = arguments[1];
                }
            } else if (len > 1 && Array.isArray(arguments[1])) {
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
            this.queue.push(new Command(command, arr, callback));
            return this;
        };
        // Alias special function names (e.g. NR.RUN becomes NR_RUN and nr_run)
        if (commandName !== command) {
            Multi.prototype[commandName.toUpperCase()] = Multi.prototype[commandName] = Multi.prototype[command];
        }
        Object.defineProperty(Multi.prototype[command], 'name', {
            value: commandName
        });
    }
};

commands.list.forEach(addCommand);

module.exports = addCommand;
