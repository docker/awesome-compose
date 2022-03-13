# Redis Commands

[![Build Status](https://travis-ci.org/NodeRedis/redis-commands.png?branch=master)](https://travis-ci.org/NodeRedis/redis-commands)
[![Code Climate](https://codeclimate.com/github/NodeRedis/redis-commands/badges/gpa.svg)](https://codeclimate.com/github/NodeRedis/redis-commands)
[![Test Coverage](https://codeclimate.com/github/NodeRedis/redis-commands/badges/coverage.svg)](https://codeclimate.com/github/NodeRedis/redis-commands/coverage)

This module exports all the commands that Redis supports.

## Install

```shell
$ npm install redis-commands
```

## Usage

```javascript
var commands = require('redis-commands');
```

`.list` is an array contains all the lowercased commands:

```javascript
commands.list.forEach(function (command) {
  console.log(command);
});
```

`.exists()` is used to check if the command exists:

```javascript
commands.exists('set') // true
commands.exists('other-command') // false
```

`.hasFlag()` is used to check if the command has the flag:

```javascript
commands.hasFlag('set', 'readonly') // false
```

`.getKeyIndexes()` is used to get the indexes of keys in the command arguments:

```javascript
commands.getKeyIndexes('set', ['key', 'value']) // [0]
commands.getKeyIndexes('mget', ['key1', 'key2']) // [0, 1]
```

## Acknowledgment

Thank [@Yuan Chuan](https://github.com/yuanchuan) for the package name. The original redis-commands is renamed to [@yuanchuan/redis-commands](https://www.npmjs.com/package/@yuanchuan/redis-commands).
