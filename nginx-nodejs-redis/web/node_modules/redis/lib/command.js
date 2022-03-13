'use strict';

var betterStackTraces = /development/i.test(process.env.NODE_ENV) || /\bredis\b/i.test(process.env.NODE_DEBUG);

function Command (command, args, callback, call_on_write) {
    this.command = command;
    this.args = args;
    this.buffer_args = false;
    this.callback = callback;
    this.call_on_write = call_on_write;
    if (betterStackTraces) {
        this.error = new Error();
    }
}

module.exports = Command;
