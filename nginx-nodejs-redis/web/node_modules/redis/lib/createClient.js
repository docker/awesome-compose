'use strict';

var utils = require('./utils');
var URL = require('url');

module.exports = function createClient (port_arg, host_arg, options) {

    if (typeof port_arg === 'number' || typeof port_arg === 'string' && /^\d+$/.test(port_arg)) {

        var host;
        if (typeof host_arg === 'string') {
            host = host_arg;
        } else {
            if (options && host_arg) {
                throw new TypeError('Unknown type of connection in createClient()');
            }
            options = options || host_arg;
        }
        options = utils.clone(options);
        options.host = host || options.host;
        options.port = port_arg;

    } else if (typeof port_arg === 'string' || port_arg && port_arg.url) {

        options = utils.clone(port_arg.url ? port_arg : host_arg || options);
        var url = port_arg.url || port_arg;
        var parsed = URL.parse(url, true, true);

        // [redis:]//[[user][:password]@][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
        if (parsed.slashes) { // We require slashes
            if (parsed.auth) {
                var columnIndex = parsed.auth.indexOf(':');
                options.password = parsed.auth.slice(columnIndex + 1);
                if (columnIndex > 0) {
                    options.user = parsed.auth.slice(0, columnIndex);
                }
            }
            if (parsed.protocol) {
                if (parsed.protocol === 'rediss:') {
                    options.tls = options.tls || {};
                } else if (parsed.protocol !== 'redis:') {
                    console.warn('node_redis: WARNING: You passed "' + parsed.protocol.substring(0, parsed.protocol.length - 1) + '" as protocol instead of the "redis" protocol!');
                }
            }
            if (parsed.pathname && parsed.pathname !== '/') {
                options.db = parsed.pathname.substr(1);
            }
            if (parsed.hostname) {
                options.host = parsed.hostname;
            }
            if (parsed.port) {
                options.port = parsed.port;
            }
            if (parsed.search !== '') {
                var elem;
                for (elem in parsed.query) {
                    // If options are passed twice, only the parsed options will be used
                    if (elem in options) {
                        if (options[elem] === parsed.query[elem]) {
                            console.warn('node_redis: WARNING: You passed the ' + elem + ' option twice!');
                        } else {
                            throw new RangeError('The ' + elem + ' option is added twice and does not match');
                        }
                    }
                    options[elem] = parsed.query[elem];
                }
            }
        } else if (parsed.hostname) {
            throw new RangeError('The redis url must begin with slashes "//" or contain slashes after the redis protocol');
        } else {
            options.path = url;
        }

    } else if (typeof port_arg === 'object' || port_arg === undefined) {
        options = utils.clone(port_arg || options);
        options.host = options.host || host_arg;

        if (port_arg && arguments.length !== 1) {
            throw new TypeError('Too many arguments passed to createClient. Please only pass the options object');
        }
    }

    if (!options) {
        throw new TypeError('Unknown type of connection in createClient()');
    }

    return options;
};
