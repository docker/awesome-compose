<p align="center">
    <a href="https://github.com/noderedis/node-redis/">
        <img width="190px" src="https://static.invertase.io/assets/node_redis_logo.png" />
    </a>
    <h2 align="center">Node Redis</h2>
    <h4 align="center">A high performance Node.js Redis client.</h4>
</p>

---

<p align="center">
    <a href="https://www.npmjs.com/package/redis"><img src="https://img.shields.io/npm/dm/redis.svg" alt="NPM downloads"></a>
    <a href="https://www.npmjs.com/package/redis"><img src="https://img.shields.io/npm/v/redis.svg" alt="NPM version"></a>
    <a href="https://github.com/NodeRedis/node-redis/actions?query=workflow%3ATests"><img src="https://github.com/NodeRedis/node-redis/workflows/Tests/badge.svg" alt="Build Status" /></a>
    <a href="https://github.com/NodeRedis/node-redis/actions?query=workflow%3A%22Tests+Windows%22"><img src="https://github.com/NodeRedis/node-redis/workflows/Tests%20Windows/badge.svg" alt="Windows Build Status" /></a>
    <a href="https://coveralls.io/r/NodeRedis/node-redis?branch="><img src="https://coveralls.io/repos/NodeRedis/node-redis/badge.svg?branch=master" alt="Coverage Status" /></a>
    <a href="https://codeclimate.com/github/NodeRedis/node-redis/maintainability"><img src="https://api.codeclimate.com/v1/badges/f6d7063243c234237e73/maintainability" /></a>
    <a href="https://lgtm.com/projects/g/NodeRedis/node-redis/context:javascript"><img src="https://img.shields.io/lgtm/grade/javascript/g/NodeRedis/node-redis.svg?logo=lgtm&logoWidth=18" alt="Coverage Status" /></a>
    <a href="https://discord.gg/XMMVgxUm"><img src="https://img.shields.io/discord/697882427875393627?style=flat-square" /></a>
</p>

---

## Installation

```bash
npm install redis
```

## Usage

#### Example

```js
const redis = require("redis");
const client = redis.createClient();

client.on("error", function(error) {
  console.error(error);
});

client.set("key", "value", redis.print);
client.get("key", redis.print);
```

Note that the API is entirely asynchronous. To get data back from the server,
you'll need to use a callback.

### Promises

Node Redis currently doesn't natively support promises (this is coming in v4), however you can wrap the methods you
want to use with promises using the built-in Node.js `util.promisify` method on Node.js >= v8;

```js
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

getAsync.then(console.log).catch(console.error);
```

### Commands

This library is a 1 to 1 mapping of the [Redis commands](https://redis.io/commands).

Each Redis command is exposed as a function on the `client` object.
All functions take either an `args` Array plus optional `callback` Function or
a variable number of individual arguments followed by an optional callback.
Examples:

```js
client.hmset(["key", "foo", "bar"], function(err, res) {
  // ...
});

// Works the same as
client.hmset("key", ["foo", "bar"], function(err, res) {
  // ...
});

// Or
client.hmset("key", "foo", "bar", function(err, res) {
  // ...
});
```

Care should be taken with user input if arrays are possible (via body-parser, query string or other method), as single arguments could be unintentionally interpreted as multiple args.

Note that in either form the `callback` is optional:

```js
client.set("foo", "bar");
client.set(["hello", "world"]);
```

If the key is missing, reply will be null. Only if the [Redis Command
Reference](http://redis.io/commands) states something else it will not be null.

```js
client.get("missing_key", function(err, reply) {
  // reply is null when the key is missing
  console.log(reply);
});
```

Minimal parsing is done on the replies. Commands that return a integer return
JavaScript Numbers, arrays return JavaScript Array. `HGETALL` returns an Object
keyed by the hash keys. All strings will either be returned as string or as
buffer depending on your setting. Please be aware that sending null, undefined
and Boolean values will result in the value coerced to a string!

## API

### Connection and other Events

`client` will emit some events about the state of the connection to the Redis server.

#### `"ready"`

`client` will emit `ready` once a connection is established. Commands issued
before the `ready` event are queued, then replayed just before this event is
emitted.

#### `"connect"`

`client` will emit `connect` as soon as the stream is connected to the server.

#### `"reconnecting"`

`client` will emit `reconnecting` when trying to reconnect to the Redis server
after losing the connection. Listeners are passed an object containing `delay`
(in ms from the previous try) and `attempt` (the attempt #) attributes.

#### `"error"`

`client` will emit `error` when encountering an error connecting to the Redis
server or when any other in Node Redis occurs. If you use a command without
callback and encounter a ReplyError it is going to be emitted to the error
listener.

So please attach the error listener to Node Redis.

#### `"end"`

`client` will emit `end` when an established Redis server connection has closed.

#### `"warning"`

`client` will emit `warning` when password was set but none is needed and if a
deprecated option / function / similar is used.

### redis.createClient()

If you have `redis-server` running on the same machine as node, then the
defaults for port and host are probably fine and you don't need to supply any
arguments. `createClient()` returns a `RedisClient` object. Otherwise,
`createClient()` accepts these arguments:

- `redis.createClient([options])`
- `redis.createClient(unix_socket[, options])`
- `redis.createClient(redis_url[, options])`
- `redis.createClient(port[, host][, options])`

**Tip:** If the Redis server runs on the same machine as the client consider
using unix sockets if possible to increase throughput.

**Note:** Using `'rediss://...` for the protocol in a `redis_url` will enable a TLS socket connection. However, additional TLS options will need to be passed in `options`, if required.

#### `options` object properties

| Property                   | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| host                       | 127.0.0.1 | IP address of the Redis server                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| port                       | 6379      | Port of the Redis server                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| path                       | null      | The UNIX socket string of the Redis server                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| url                        | null      | The URL of the Redis server. Format: `[redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]` (More info avaliable at [IANA](http://www.iana.org/assignments/uri-schemes/prov/redis)).                                                                                                                                                                                                                                                                                                                                       |
| string_numbers             | null      | Set to `true`, Node Redis will return Redis number values as Strings instead of javascript Numbers. Useful if you need to handle big numbers (above `Number.MAX_SAFE_INTEGER === 2^53`). Hiredis is incapable of this behavior, so setting this option to `true` will result in the built-in javascript parser being used no matter the value of the `parser` option.                                                                                                                                                                                                         |
| return_buffers             | false     | If set to `true`, then all replies will be sent to callbacks as Buffers instead of Strings.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| detect_buffers             | false     | If set to `true`, then replies will be sent to callbacks as Buffers. This option lets you switch between Buffers and Strings on a per-command basis, whereas `return_buffers` applies to every command on a client. **Note**: This doesn't work properly with the pubsub mode. A subscriber has to either always return Strings or Buffers.                                                                                                                                                                                                                                   |
| socket_keepalive           | true      | If set to `true`, the keep-alive functionality is enabled on the underlying socket.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| socket_initial_delay       | 0         | Initial Delay in milliseconds, and this will also behave the interval keep alive message sending to Redis.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| no_ready_check             | false     | When a connection is established to the Redis server, the server might still be loading the database from disk. While loading, the server will not respond to any commands. To work around this, Node Redis has a "ready check" which sends the `INFO` command to the server. The response from the `INFO` command indicates whether the server is ready for more commands. When ready, `node_redis` emits a `ready` event. Setting `no_ready_check` to `true` will inhibit this check.                                                                                       |
| enable_offline_queue       | true      | By default, if there is no active connection to the Redis server, commands are added to a queue and are executed once the connection has been established. Setting `enable_offline_queue` to `false` will disable this feature and the callback will be executed immediately with an error, or an error will be emitted if no callback is specified.                                                                                                                                                                                                                          |
| retry_unfulfilled_commands | false     | If set to `true`, all commands that were unfulfilled while the connection is lost will be retried after the connection has been reestablished. Use this with caution if you use state altering commands (e.g. `incr`). This is especially useful if you use blocking commands.                                                                                                                                                                                                                                                                                                |
| password                   | null      | If set, client will run Redis auth command on connect. Alias `auth_pass` **Note** Node Redis < 2.5 must use `auth_pass`                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| user                       | null      | The ACL user (only valid when `password` is set)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| db                         | null      | If set, client will run Redis `select` command on connect.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| family                     | IPv4      | You can force using IPv6 if you set the family to 'IPv6'. See Node.js [net](https://nodejs.org/api/net.html) or [dns](https://nodejs.org/api/dns.html) modules on how to use the family type.                                                                                                                                                                                                                                                                                                                                                                                 |
| disable_resubscribing      | false     | If set to `true`, a client won't resubscribe after disconnecting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| rename_commands            | null      | Passing an object with renamed commands to use instead of the original functions. For example, if you renamed the command KEYS to "DO-NOT-USE" then the rename_commands object would be: `{ KEYS : "DO-NOT-USE" }` . See the [Redis security topics](http://redis.io/topics/security) for more info.                                                                                                                                                                                                                                                                          |
| tls                        | null      | An object containing options to pass to [tls.connect](http://nodejs.org/api/tls.html#tls_tls_connect_port_host_options_callback) to set up a TLS connection to Redis (if, for example, it is set up to be accessible via a tunnel).                                                                                                                                                                                                                                                                                                                                           |
| prefix                     | null      | A string used to prefix all used keys (e.g. `namespace:test`). Please be aware that the `keys` command will not be prefixed. The `keys` command has a "pattern" as argument and no key and it would be impossible to determine the existing keys in Redis if this would be prefixed.                                                                                                                                                                                                                                                                                          |
| retry_strategy             | function  | A function that receives an options object as parameter including the retry `attempt`, the `total_retry_time` indicating how much time passed since the last time connected, the `error` why the connection was lost and the number of `times_connected` in total. If you return a number from this function, the retry will happen exactly after that time in milliseconds. If you return a non-number, no further retry will happen and all offline commands are flushed with errors. Return an error to return that specific error to all offline commands. Example below. |
| connect_timeout            | 3600000   | In milliseconds. This should only be the timeout for connecting to redis, but for now it interferes with `retry_strategy` and stops it from reconnecting after this timeout.                                                                                                                                                                                                                                                                                                                                                                                                  |

**`detect_buffers` example:**

```js
const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });

client.set("foo_rand000000000000", "OK");

// This will return a JavaScript String
client.get("foo_rand000000000000", function(err, reply) {
  console.log(reply.toString()); // Will print `OK`
});

// This will return a Buffer since original key is specified as a Buffer
client.get(new Buffer("foo_rand000000000000"), function(err, reply) {
  console.log(reply.toString()); // Will print `<Buffer 4f 4b>`
});
```

**`retry_strategy` example:**

```js
const client = redis.createClient({
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});
```

### client.auth(password[, callback])

When connecting to a Redis server that requires authentication, the `AUTH`
command must be sent as the first command after connecting. This can be tricky
to coordinate with reconnections, the ready check, etc. To make this easier,
`client.auth()` stashes `password` and will send it after each connection,
including reconnections. `callback` is invoked only once, after the response to
the very first `AUTH` command sent.
NOTE: Your call to `client.auth()` should not be inside the ready handler. If
you are doing this wrong, `client` will emit an error that looks
something like this `Error: Ready check failed: ERR operation not permitted`.

### client.quit(callback)

This sends the quit command to the redis server and ends cleanly right after all
running commands were properly handled. If this is called while reconnecting
(and therefore no connection to the redis server exists) it is going to end the
connection right away instead of resulting in further reconnections! All offline
commands are going to be flushed with an error in that case.

### client.end(flush)

Forcibly close the connection to the Redis server. Note that this does not wait
until all replies have been parsed. If you want to exit cleanly, call
`client.quit()` as mentioned above.

You should set flush to true, if you are not absolutely sure you do not care
about any other commands. If you set flush to false all still running commands
will silently fail.

This example closes the connection to the Redis server before the replies have
been read. You probably don't want to do this:

```js
const redis = require("redis");
const client = redis.createClient();

client.set("hello", "world", function(err) {
  // This will either result in an error (flush parameter is set to true)
  // or will silently fail and this callback will not be called at all (flush set to false)
  console.error(err);
});

// No further commands will be processed
client.end(true);

client.get("hello", function(err) {
  console.error(err); // => 'The connection has already been closed.'
});
```

`client.end()` without the flush parameter set to true should NOT be used in production!

### Error Handling

Currently the following `Error` subclasses exist:

- `RedisError`: _All errors_ returned by the client
- `ReplyError` subclass of `RedisError`: All errors returned by **Redis** itself
- `AbortError` subclass of `RedisError`: All commands that could not finish due
  to what ever reason
- `ParserError` subclass of `RedisError`: Returned in case of a parser error
  (this should not happen)
- `AggregateError` subclass of `AbortError`: Emitted in case multiple unresolved
  commands without callback got rejected in debug_mode instead of lots of
  `AbortError`s.

All error classes are exported by the module.

#### Example

```js
const assert = require("assert");

const redis = require("redis");
const { AbortError, AggregateError, ReplyError } = require("redis");

const client = redis.createClient();

client.on("error", function(err) {
  assert(err instanceof Error);
  assert(err instanceof AbortError);
  assert(err instanceof AggregateError);

  // The set and get are aggregated in here
  assert.strictEqual(err.errors.length, 2);
  assert.strictEqual(err.code, "NR_CLOSED");
});

client.set("foo", "bar", "baz", function(err, res) {
  // Too many arguments
  assert(err instanceof ReplyError); // => true
  assert.strictEqual(err.command, "SET");
  assert.deepStrictEqual(err.args, ["foo", 123, "bar"]);

  redis.debug_mode = true;

  client.set("foo", "bar");
  client.get("foo");

  process.nextTick(function() {
    // Force closing the connection while the command did not yet return
    client.end(true);
    redis.debug_mode = false;
  });
});
```

Every `ReplyError` contains the `command` name in all-caps and the arguments (`args`).

If Node Redis emits a library error because of another error, the triggering
error is added to the returned error as `origin` attribute.

**_Error codes_**

Node Redis returns a `NR_CLOSED` error code if the clients connection dropped.
If a command unresolved command got rejected a `UNCERTAIN_STATE` code is
returned. A `CONNECTION_BROKEN` error code is used in case Node Redis gives up
to reconnect.

### client.unref()

Call `unref()` on the underlying socket connection to the Redis server, allowing
the program to exit once no more commands are pending.

This is an **experimental** feature, and only supports a subset of the Redis
protocol. Any commands where client state is saved on the Redis server, e.g.
`*SUBSCRIBE` or the blocking `BL*` commands will _NOT_ work with `.unref()`.

```js
const redis = require("redis");
const client = redis.createClient();

/*
 * Calling unref() will allow this program to exit immediately after the get
 * command finishes. Otherwise the client would hang as long as the
 * client-server connection is alive.
 */
client.unref();

client.get("foo", function(err, value) {
  if (err) throw err;
  console.log(value);
});
```

### Hash Commands

Most Redis commands take a single String or an Array of Strings as arguments,
and replies are sent back as a single String or an Array of Strings. When
dealing with hash values, there are a couple of useful exceptions to this.

#### client.hgetall(hash, callback)

The reply from an `HGETALL` command will be converted into a JavaScript Object. That way you can interact with the 
responses using JavaScript syntax.

**Example:**

```js
client.hmset("key", "foo", "bar", "hello", "world");

client.hgetall("key", function(err, value) {
  console.log(value.foo); // > "bar"
  console.log(value.hello); // > "world"
});
```

#### client.hmset(hash, key1, val1, ...keyN, valN, [callback])

Multiple values may also be set by supplying more arguments.

**Example:**

```js
//  key
//    1) foo   => bar
//    2) hello => world
client.HMSET("key", "foo", "bar", "hello", "world");
```

### PubSub

#### Example

This example opens two client connections, subscribes to a channel on one of them, and publishes to that
channel on the other.

```js
const redis = require("redis");

const subscriber = redis.createClient();
const publisher = redis.createClient();

let messageCount = 0;

subscriber.on("subscribe", function(channel, count) {
  publisher.publish("a channel", "a message");
  publisher.publish("a channel", "another message");
});

subscriber.on("message", function(channel, message) {
  messageCount += 1;

  console.log("Subscriber received message in channel '" + channel + "': " + message);

  if (messageCount === 2) {
    subscriber.unsubscribe();
    subscriber.quit();
    publisher.quit();
  }
});

subscriber.subscribe("a channel");
```

When a client issues a `SUBSCRIBE` or `PSUBSCRIBE`, that connection is put into
a `"subscriber"` mode. At that point, the only valid commands are those that modify the subscription
set, and quit (also ping on some redis versions). When
the subscription set is empty, the connection is put back into regular mode.

If you need to send regular commands to Redis while in subscriber mode, just
open another connection with a new client (use `client.duplicate()` to quickly duplicate an existing client).

#### Subscriber Events

If a client has subscriptions active, it may emit these events:

**"message" (channel, message)**:

Client will emit `message` for every message received that matches an active subscription.
Listeners are passed the channel name as `channel` and the message as `message`.

**"pmessage" (pattern, channel, message)**:

Client will emit `pmessage` for every message received that matches an active
subscription pattern. Listeners are passed the original pattern used with
`PSUBSCRIBE` as `pattern`, the sending channel name as `channel`, and the
message as `message`.

**"message_buffer" (channel, message)**:

This is the same as the `message` event with the exception, that it is always
going to emit a buffer. If you listen to the `message` event at the same time as
the `message_buffer`, it is always going to emit a string.

**"pmessage_buffer" (pattern, channel, message)**:

This is the same as the `pmessage` event with the exception, that it is always
going to emit a buffer. If you listen to the `pmessage` event at the same time
as the `pmessage_buffer`, it is always going to emit a string.

**"subscribe" (channel, count)**:

Client will emit `subscribe` in response to a `SUBSCRIBE` command. Listeners are
passed the channel name as `channel` and the new count of subscriptions for this
client as `count`.

**"psubscribe" (pattern, count)**:

Client will emit `psubscribe` in response to a `PSUBSCRIBE` command. Listeners
are passed the original pattern as `pattern`, and the new count of subscriptions
for this client as `count`.

**"unsubscribe" (channel, count)**:

Client will emit `unsubscribe` in response to a `UNSUBSCRIBE` command. Listeners
are passed the channel name as `channel` and the new count of subscriptions for
this client as `count`. When `count` is 0, this client has left subscriber mode
and no more subscriber events will be emitted.

**"punsubscribe" (pattern, count)**:

Client will emit `punsubscribe` in response to a `PUNSUBSCRIBE` command.
Listeners are passed the channel name as `channel` and the new count of
subscriptions for this client as `count`. When `count` is 0, this client has
left subscriber mode and no more subscriber events will be emitted.

### client.multi([commands])

`MULTI` commands are queued up until an `EXEC` is issued, and then all commands
are run atomically by Redis. The interface returns an
individual `Multi` object by calling `client.multi()`. If any command fails to
queue, all commands are rolled back and none is going to be executed (For
further information see the [Redis transactions](http://redis.io/topics/transactions) documentation).

```js
const redis = require("redis");
const client = redis.createClient();

let setSize = 20;

client.sadd("key", "member1");
client.sadd("key", "member2");

while (setSize > 0) {
  client.sadd("key", "member" + setSize);
  setSize -= 1;
}

// chain commands
client
  .multi()
  .scard("key")
  .smembers("key")
  .keys("*")
  .dbsize()
  .exec(function(err, replies) {
    console.log("MULTI got " + replies.length + " replies");
    replies.forEach(function(reply, index) {
      console.log("REPLY  @ index " + index + ": " + reply.toString());
    });
  });
```

#### Multi.exec([callback])

`client.multi()` is a constructor that returns a `Multi` object. `Multi` objects
share all of the same command methods as `client` objects do. Commands are
queued up inside the `Multi` object until `Multi.exec()` is invoked.

If your code contains an syntax error an `EXECABORT` error is going to be thrown
and all commands are going to be aborted. That error contains a `.errors`
property that contains the concrete errors.
If all commands were queued successfully and an error is thrown by redis while
processing the commands that error is going to be returned in the result array!
No other command is going to be aborted though than the ones failing.

You can either chain together `MULTI` commands as in the above example, or you
can queue individual commands while still sending regular client command as in
this example:

```js
const redis = require("redis");
const client = redis.createClient();

// start a separate multi command queue
const multi = client.multi();

// add some commands to the queue
multi.incr("count_cats", redis.print);
multi.incr("count_dogs", redis.print);

// runs a command immediately outside of the `multi` instance
client.mset("count_cats", 100, "count_dogs", 50, redis.print);

// drains the multi queue and runs each command atomically
multi.exec(function(err, replies) {
  console.log(replies); // 101, 51
});
```

In addition to adding commands to the `MULTI` queue individually, you can also
pass an array of commands and arguments to the constructor:

```js
const redis = require("redis");

const client = redis.createClient();

client
  .multi([
    ["mget", "foo", "bar", redis.print],
    ["incr", "hello"],
  ])
  .exec(function(err, replies) {
    console.log(replies);
  });
```

#### Multi.exec_atomic([callback])

Identical to Multi.exec but with the difference that executing a single command
will not use transactions.

#### Optimistic Locks

Using `multi` you can make sure your modifications run as a transaction, but you
can't be sure you got there first. What if another client modified a key while
you were working with it's data?

To solve this, Redis supports the [WATCH](https://redis.io/topics/transactions)
command, which is meant to be used with MULTI:

```js
const redis = require("redis");

const client = redis.createClient();

client.watch("foo", function(watchError) {
  if (watchError) throw watchError;

  client.get("foo", function(getError, result) {
    if (getError) throw getError;

    // Process result
    // Heavy and time consuming operation here to generate "bar"

    client
      .multi()
      .set("foo", "bar")
      .exec(function(execError, results) {
        /**
         * If err is null, it means Redis successfully attempted
         * the operation.
         */
        if (execError) throw execError;

        /**
         * If results === null, it means that a concurrent client
         * changed the key while we were processing it and thus
         * the execution of the MULTI command was not performed.
         *
         * NOTICE: Failing an execution of MULTI is not considered
         * an error. So you will have err === null and results === null
         */
      });
  });
});
```

The above snippet shows the correct usage of `watch` with `multi`. Every time a
watched key is changed before the execution of a `multi` command, the execution
will return `null`. On a normal situation, the execution will return an array of
values with the results of the operations.

As stated in the snippet, failing the execution of a `multi` command being watched
is not considered an error. The execution may return an error if, for example, the
client cannot connect to Redis.

An example where we can see the execution of a `multi` command fail is as follows:

```js
const clients = {
  watcher: redis.createClient(),
  modifier: redis.createClient(),
};

clients.watcher.watch("foo", function(watchError) {
  if (watchError) throw watchError;

  // if you comment out the next line, the transaction will work
  clients.modifier.set("foo", Math.random(), setError => {
    if (setError) throw setError;
  });

  // using a setTimeout here to ensure that the MULTI/EXEC will come after the SET.
  // Normally, you would use a callback to ensure order, but I want the above SET command
  // to be easily comment-out-able.
  setTimeout(function() {
    clients.watcher
      .multi()
      .set("foo", "bar")
      .set("hello", "world")
      .exec((multiExecError, results) => {
        if (multiExecError) throw multiExecError;

        if (results === null) {
          console.log("transaction aborted because results were null");
        } else {
          console.log("transaction worked and returned", results);
        }

        clients.watcher.quit();
        clients.modifier.quit();
      });
  }, 1000);
});
```

#### `WATCH` limitations

Redis WATCH works only on _whole_ key values. For example, with WATCH you can
watch a hash for modifications, but you cannot watch a specific field of a hash.

The following example would watch the keys `foo` and `hello`, not the field `hello`
of hash `foo`:

```js
const redis = require("redis");

const client = redis.createClient();

client.hget("foo", "hello", function(hashGetError, result) {
  if (hashGetError) throw hashGetError;

  //Do some processing with the value from this field and watch it after

  client.watch("foo", "hello", function(watchError) {
    if (watchError) throw watchError;

    /**
     * This is now watching the keys 'foo' and 'hello'. It is not
     * watching the field 'hello' of hash 'foo'. Because the key 'foo'
     * refers to a hash, this command is now watching the entire hash
     * for modifications.
     */
  });
});
```

This limitation also applies to sets (you can not watch individual set members)
and any other collections.

### client.batch([commands])

Identical to `.multi()` without transactions. This is recommended if you want to
execute many commands at once but don't need to rely on transactions.

`BATCH` commands are queued up until an `EXEC` is issued, and then all commands
are run atomically by Redis. The interface returns an
individual `Batch` object by calling `client.batch()`. The only difference
between .batch and .multi is that no transaction is going to be used.
Be aware that the errors are - just like in multi statements - in the result.
Otherwise both, errors and results could be returned at the same time.

If you fire many commands at once this is going to boost the execution speed
significantly compared to firing the same commands in a loop without waiting for
the result! See the benchmarks for further comparison. Please remember that all
commands are kept in memory until they are fired.

### Monitor mode

Redis supports the `MONITOR` command, which lets you see all commands received
by the Redis server across all client connections, including from other client
libraries and other computers.

A `monitor` event is going to be emitted for every command fired from any client
connected to the server including the monitoring client itself. The callback for
the `monitor` event takes a timestamp from the Redis server, an array of command
arguments and the raw monitoring string.

#### Example:

```js
const redis = require("redis");
const client = redis.createClient();

client.monitor(function(err, res) {
  console.log("Entering monitoring mode.");
});

client.set("foo", "bar");

client.on("monitor", function(time, args, rawReply) {
  console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
});
```

## Extras

Some other things you might find useful.

### `client.server_info`

After the ready probe completes, the results from the INFO command are saved in
the `client.server_info` object.

The `versions` key contains an array of the elements of the version string for
easy comparison.

```
> client.server_info.redis_version
'2.3.0'
> client.server_info.versions
[ 2, 3, 0 ]
```

### `redis.print()`

A handy callback function for displaying return values when testing. Example:

```js
const redis = require("redis");
const client = redis.createClient();

client.on("connect", function() {
  client.set("foo", "bar", redis.print); // => "Reply: OK"
  client.get("foo", redis.print); // => "Reply: bar"
  client.quit();
});
```

### Multi-word commands

To execute redis multi-word commands like `SCRIPT LOAD` or `CLIENT LIST` pass
the second word as first parameter:

```js
client.script("load", "return 1");

client
  .multi()
  .script("load", "return 1")
  .exec();

client.multi([["script", "load", "return 1"]]).exec();
```

### `client.duplicate([options][, callback])`

Duplicate all current options and return a new redisClient instance. All options
passed to the duplicate function are going to replace the original option. If
you pass a callback, duplicate is going to wait until the client is ready and
returns it in the callback. If an error occurs in the meanwhile, that is going
to return an error instead in the callback.

One example of when to use duplicate() would be to accommodate the connection-
blocking redis commands `BRPOP`, `BLPOP`, and `BRPOPLPUSH`. If these commands
are used on the same Redis client instance as non-blocking commands, the
non-blocking ones may be queued up until after the blocking ones finish.

Another reason to use duplicate() is when multiple DBs on the same server are
accessed via the redis SELECT command. Each DB could use its own connection.

### `client.sendCommand(command_name[, [args][, callback]])`

All Redis commands have been added to the `client` object. However, if new
commands are introduced before this library is updated or if you want to add
individual commands you can use `sendCommand()` to send arbitrary commands to
Redis.

All commands are sent as multi-bulk commands. `args` can either be an Array of
arguments, or omitted / set to undefined.

### `redis.addCommand(command_name)`

Calling addCommand will add a new command to the prototype. The exact command
name will be used when calling using this new command. Using arbitrary arguments
is possible as with any other command.

### `client.connected`

Boolean tracking the state of the connection to the Redis server.

### `client.command_queue_length`

The number of commands that have been sent to the Redis server but not yet
replied to. You can use this to enforce some kind of maximum queue depth for
commands while connected.

### `client.offline_queue_length`

The number of commands that have been queued up for a future connection. You can
use this to enforce some kind of maximum queue depth for pre-connection
commands.

### Commands with Optional and Keyword arguments

This applies to anything that uses an optional `[WITHSCORES]` or `[LIMIT offset count]` in the [redis.io/commands](http://redis.io/commands) documentation.

#### Example

```js
const args = ["myzset", 1, "one", 2, "two", 3, "three", 99, "ninety-nine"];

client.zadd(args, function(addError, addResponse) {
  if (addError) throw addError;
  console.log("added " + addResponse + " items.");

  // -Infinity and +Infinity also work
  const args1 = ["myzset", "+inf", "-inf"];
  client.zrevrangebyscore(args1, function(rangeError, rangeResponse) {
    if (rangeError) throw rangeError;
    console.log("response1", rangeResponse);
    // ...
  });

  const max = 3;
  const min = 1;
  const offset = 1;
  const count = 2;
  const args2 = ["myzset", max, min, "WITHSCORES", "LIMIT", offset, count];
  client.zrevrangebyscore(args2, function(rangeError, rangeResponse) {
    if (rangeError) throw rangeError;
    console.log("response2", rangeResponse);
    // ...
  });
});
```

## Performance

Much effort has been spent to make Node Redis as fast as possible for common operations.

```
Mac mini (2018), i7-3.2GHz and 32gb memory
clients: 1, NodeJS: 12.15.0, Redis: 5.0.6, parser: javascript, connected by: tcp
         PING,         1/1 avg/max:   0.03/  3.28 2501ms total,   31926 ops/sec
         PING,  batch 50/1 avg/max:   0.08/  3.35 2501ms total,  599460 ops/sec
   SET 4B str,         1/1 avg/max:   0.03/  3.54 2501ms total,   29483 ops/sec
   SET 4B str,  batch 50/1 avg/max:   0.10/  1.39 2501ms total,  477689 ops/sec
   SET 4B buf,         1/1 avg/max:   0.04/  1.52 2501ms total,   23449 ops/sec
   SET 4B buf,  batch 50/1 avg/max:   0.20/  2.09 2501ms total,  244382 ops/sec
   GET 4B str,         1/1 avg/max:   0.03/  1.35 2501ms total,   32205 ops/sec
   GET 4B str,  batch 50/1 avg/max:   0.09/  2.02 2501ms total,  568992 ops/sec
   GET 4B buf,         1/1 avg/max:   0.03/  2.93 2501ms total,   32802 ops/sec
   GET 4B buf,  batch 50/1 avg/max:   0.08/  1.03 2501ms total,  592863 ops/sec
 SET 4KiB str,         1/1 avg/max:   0.03/  0.76 2501ms total,   29287 ops/sec
 SET 4KiB str,  batch 50/1 avg/max:   0.35/  2.97 2501ms total,  143163 ops/sec
 SET 4KiB buf,         1/1 avg/max:   0.04/  1.21 2501ms total,   23070 ops/sec
 SET 4KiB buf,  batch 50/1 avg/max:   0.28/  2.34 2501ms total,  176809 ops/sec
 GET 4KiB str,         1/1 avg/max:   0.03/  1.54 2501ms total,   29555 ops/sec
 GET 4KiB str,  batch 50/1 avg/max:   0.18/  1.59 2501ms total,  279188 ops/sec
 GET 4KiB buf,         1/1 avg/max:   0.03/  1.80 2501ms total,   30681 ops/sec
 GET 4KiB buf,  batch 50/1 avg/max:   0.17/  5.00 2501ms total,  285886 ops/sec
         INCR,         1/1 avg/max:   0.03/  1.99 2501ms total,   32757 ops/sec
         INCR,  batch 50/1 avg/max:   0.09/  2.54 2501ms total,  538964 ops/sec
        LPUSH,         1/1 avg/max:   0.05/  4.85 2501ms total,   19482 ops/sec
        LPUSH,  batch 50/1 avg/max:   0.12/  9.52 2501ms total,  395562 ops/sec
    LRANGE 10,         1/1 avg/max:   0.06/  9.21 2501ms total,   17062 ops/sec
    LRANGE 10,  batch 50/1 avg/max:   0.22/  1.03 2501ms total,  228269 ops/sec
   LRANGE 100,         1/1 avg/max:   0.05/  1.44 2501ms total,   19051 ops/sec
   LRANGE 100,  batch 50/1 avg/max:   0.99/  3.46 2501ms total,   50480 ops/sec
 SET 4MiB str,         1/1 avg/max:   4.11/ 13.96 2501ms total,     243 ops/sec
 SET 4MiB str,  batch 20/1 avg/max:  91.16/145.01 2553ms total,     219 ops/sec
 SET 4MiB buf,         1/1 avg/max:   2.81/ 11.90 2502ms total,     354 ops/sec
 SET 4MiB buf,  batch 20/1 avg/max:  36.21/ 70.96 2535ms total,     552 ops/sec
 GET 4MiB str,         1/1 avg/max:   2.82/ 19.10 2503ms total,     354 ops/sec
 GET 4MiB str,  batch 20/1 avg/max: 128.57/207.86 2572ms total,     156 ops/sec
 GET 4MiB buf,         1/1 avg/max:   3.13/ 23.88 2501ms total,     318 ops/sec
 GET 4MiB buf,  batch 20/1 avg/max:  65.91/ 87.59 2572ms total,     303 ops/sec
```

## Debugging

To get debug output run your Node Redis application with `NODE_DEBUG=redis`.

This is also going to result in good stack traces opposed to useless ones
otherwise for any async operation.
If you only want to have good stack traces but not the debug output run your
application in development mode instead (`NODE_ENV=development`).

Good stack traces are only activated in development and debug mode as this
results in a significant performance penalty.

**_Comparison_**:

Standard stack trace:

```
ReplyError: ERR wrong number of arguments for 'set' command
    at parseError (/home/ruben/repos/redis/node_modules/redis-parser/lib/parser.js:158:12)
    at parseType (/home/ruben/repos/redis/node_modules/redis-parser/lib/parser.js:219:14)
```

Debug stack trace:

```
ReplyError: ERR wrong number of arguments for 'set' command
    at new Command (/home/ruben/repos/redis/lib/command.js:9:902)
    at RedisClient.set (/home/ruben/repos/redis/lib/commands.js:9:3238)
    at Context.<anonymous> (/home/ruben/repos/redis/test/good_stacks.spec.js:20:20)
    at callFnAsync (/home/ruben/repos/redis/node_modules/mocha/lib/runnable.js:349:8)
    at Test.Runnable.run (/home/ruben/repos/redis/node_modules/mocha/lib/runnable.js:301:7)
    at Runner.runTest (/home/ruben/repos/redis/node_modules/mocha/lib/runner.js:422:10)
    at /home/ruben/repos/redis/node_modules/mocha/lib/runner.js:528:12
    at next (/home/ruben/repos/redis/node_modules/mocha/lib/runner.js:342:14)
    at /home/ruben/repos/redis/node_modules/mocha/lib/runner.js:352:7
    at next (/home/ruben/repos/redis/node_modules/mocha/lib/runner.js:284:14)
    at Immediate._onImmediate (/home/ruben/repos/redis/node_modules/mocha/lib/runner.js:320:5)
    at processImmediate [as _immediateCallback] (timers.js:383:17)
```

## Contributing

Please see the [contributing guide](CONTRIBUTING.md).

## License

This repository is licensed under the "MIT" license. See [LICENSE](LICENSE).
