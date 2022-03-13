'use strict'

var commands = require('./commands.json')

/**
 * Redis command list
 *
 * All commands are lowercased.
 *
 * @var {string[]}
 * @public
 */
exports.list = Object.keys(commands)

var flags = {}
exports.list.forEach(function (commandName) {
  flags[commandName] = commands[commandName].flags.reduce(function (flags, flag) {
    flags[flag] = true
    return flags
  }, {})
})
/**
 * Check if the command exists
 *
 * @param {string} commandName - the command name
 * @return {boolean} result
 * @public
 */
exports.exists = function (commandName) {
  return Boolean(commands[commandName])
}

/**
 * Check if the command has the flag
 *
 * Some of possible flags: readonly, noscript, loading
 * @param {string} commandName - the command name
 * @param {string} flag - the flag to check
 * @return {boolean} result
 * @public
 */
exports.hasFlag = function (commandName, flag) {
  if (!flags[commandName]) {
    throw new Error('Unknown command ' + commandName)
  }

  return Boolean(flags[commandName][flag])
}

/**
 * Get indexes of keys in the command arguments
 *
 * @param {string} commandName - the command name
 * @param {string[]} args - the arguments of the command
 * @param {object} [options] - options
 * @param {boolean} [options.parseExternalKey] - parse external keys
 * @return {number[]} - the list of the index
 * @public
 *
 * @example
 * ```javascript
 * getKeyIndexes('set', ['key', 'value']) // [0]
 * getKeyIndexes('mget', ['key1', 'key2']) // [0, 1]
 * ```
 */
exports.getKeyIndexes = function (commandName, args, options) {
  var command = commands[commandName]
  if (!command) {
    throw new Error('Unknown command ' + commandName)
  }

  if (!Array.isArray(args)) {
    throw new Error('Expect args to be an array')
  }

  var keys = []
  var i, keyStart, keyStop, parseExternalKey
  switch (commandName) {
    case 'zunionstore':
    case 'zinterstore':
      keys.push(0)
    // fall through
    case 'eval':
    case 'evalsha':
      keyStop = Number(args[1]) + 2
      for (i = 2; i < keyStop; i++) {
        keys.push(i)
      }
      break
    case 'sort':
      parseExternalKey = options && options.parseExternalKey
      keys.push(0)
      for (i = 1; i < args.length - 1; i++) {
        if (typeof args[i] !== 'string') {
          continue
        }
        var directive = args[i].toUpperCase()
        if (directive === 'GET') {
          i += 1
          if (args[i] !== '#') {
            if (parseExternalKey) {
              keys.push([i, getExternalKeyNameLength(args[i])])
            } else {
              keys.push(i)
            }
          }
        } else if (directive === 'BY') {
          i += 1
          if (parseExternalKey) {
            keys.push([i, getExternalKeyNameLength(args[i])])
          } else {
            keys.push(i)
          }
        } else if (directive === 'STORE') {
          i += 1
          keys.push(i)
        }
      }
      break
    case 'migrate':
      if (args[2] === '') {
        for (i = 5; i < args.length - 1; i++) {
          if (args[i].toUpperCase() === 'KEYS') {
            for (var j = i + 1; j < args.length; j++) {
              keys.push(j)
            }
            break
          }
        }
      } else {
        keys.push(2)
      }
      break
    case 'xreadgroup':
    case 'xread':
      // Keys are 1st half of the args after STREAMS argument.
      for (i = commandName === 'xread' ? 0 : 3; i < args.length - 1; i++) {
        if (String(args[i]).toUpperCase() === 'STREAMS') {
          for (j = i + 1; j <= i + ((args.length - 1 - i) / 2); j++) {
            keys.push(j)
          }
          break
        }
      }
      break
    default:
      // Step has to be at least one in this case, otherwise the command does
      // not contain a key.
      if (command.step > 0) {
        keyStart = command.keyStart - 1
        keyStop = command.keyStop > 0 ? command.keyStop : args.length + command.keyStop + 1
        for (i = keyStart; i < keyStop; i += command.step) {
          keys.push(i)
        }
      }
      break
  }

  return keys
}

function getExternalKeyNameLength (key) {
  if (typeof key !== 'string') {
    key = String(key)
  }
  var hashPos = key.indexOf('->')
  return hashPos === -1 ? key.length : hashPos
}
