# Changelog

## v3.0.0 - 09 Feb, 2020

This version is mainly a release to distribute all the unreleased changes on master since 2017 and additionally removes
a lot of old deprecated features and old internals in preparation for an upcoming modernization refactor (v4).

### Breaking Changes

- Dropped support for Node.js < 6
- Dropped support for `hiredis` (no longer required)
- Removed previously deprecated `drain` event
- Removed previously deprecated `idle` event
- Removed previously deprecated `parser` option
- Removed previously deprecated `max_delay` option
- Removed previously deprecated `max_attempts` option
- Removed previously deprecated `socket_no_delay` option

### Bug Fixes

- Removed development files from published package (#1370)
- Duplicate function now allows db param to be passed (#1311)

### Features

- Upgraded to latest `redis-commands` package
- Upgraded to latest `redis-parser` package, v3.0.0, which brings performance improvements
- Replaced `double-ended-queue` with `denque`, which brings performance improvements
- Add timestamps to debug traces
- Add `socket_initial_delay` option for `socket.setKeepAlive` (#1396)
- Add support for `rediss` protocol in url (#1282)

## v2.8.0 - 31 Jul, 2017

Features

- Accept UPPER_CASE commands in send_command
- Add arbitrary commands to the prototype by using `Redis.addCommand(name)`

Bugfixes

- Fixed not always copying subscribe unsubscribe arguments
- Fixed emitting internal errors while reconnecting with auth
- Fixed crashing with invalid url option

## v2.7.1 - 14 Mar, 2017

Bugfixes

- Fixed monitor mode not working in combination with IPv6 (2.6.0 regression)

## v2.7.0 - 11 Mar, 2017

Features

- All returned errors are from now a subclass of `RedisError`.

Bugfixes

- Fixed rename_commands not accepting `null` as value
- Fixed `AbortError`s and `AggregateError`s not showing the error message in the stack trace

## v2.6.5 - 15 Jan, 2017

Bugfixes

- Fixed parser not being reset in case the redis connection closed ASAP for overcoming of output buffer limits
- Fixed parser reset if (p)message_buffer listener is attached

## v2.6.4 - 12 Jan, 2017

Bugfixes

- Fixed monitor mode not working in combination with IPv6, sockets or lua scripts (2.6.0 regression)

## v2.6.3 - 31 Oct, 2016

Bugfixes

- Do not change the tls setting to camel_case
- Fix domain handling in combination with the offline queue (2.5.3 regression)

## v2.6.2 - 16 Jun, 2016

Bugfixes

- Fixed individual callbacks of a transaction not being called (2.6.0 regression)

## v2.6.1 - 02 Jun, 2016

Bugfixes

- Fixed invalid function name being exported

## v2.6.0 - 01 Jun, 2016

In addition to the pre-releases the following changes exist in v.2.6.0:

Features

- Updated [redis-parser](https://github.com/NodeRedis/node-redis-parser) dependency ([changelog](https://github.com/NodeRedis/node-redis-parser/releases/tag/v.2.0.0))
- The JS parser is from now on the new default as it is a lot faster than the hiredis parser
- This is no BC as there is no changed behavior for the user at all but just a performance improvement. Explicitly requireing the Hiredis parser is still possible.
- Added name property to all Redis functions (Node.js >= 4.0)
- Improved stack traces in development and debug mode

Bugfixes

- Reverted support for `__proto__` (v.2.6.0-2) to prevent and breaking change

Deprecations

- The `parser` option is deprecated and should be removed. The built-in Javascript parser is a lot faster than the hiredis parser and has more features

## v2.6.0-2 - 29 Apr, 2016

Features

- Added support for the new [CLIENT REPLY ON|OFF|SKIP](http://redis.io/commands/client-reply) command (Redis v.3.2)
- Added support for camelCase
- The Node.js landscape default is to use camelCase. node_redis is a bit out of the box here
  but from now on it is possible to use both, just as you prefer!
- If there's any documented variable missing as camelCased, please open a issue for it
- Improve error handling significantly
- Only emit an error if the error has not already been handled in a callback
- Improved unspecific error messages e.g. "Connection gone from end / close event"
- Added `args` to command errors to improve identification of the error
- Added origin to errors if there's e.g. a connection error
- Added ReplyError class. All Redis errors are from now on going to be of that class
- Added AbortError class. A subclass of AbortError. All unresolved and by node_redis rejected commands are from now on of that class
- Added AggregateError class. If a unresolved and by node_redis rejected command has no callback and
  this applies to more than a single command, the errors for the commands without callback are aggregated
  to a single error that is emitted in debug_mode in that case.
- Added `message_buffer` / `pmessage_buffer` events. That event is always going to emit a buffer
- Listening to the `message` event at the same time is always going to return the same message as string
- Added callback option to the duplicate function
- Added support for `__proto__` and other reserved keywords as hgetall field
- Updated [redis-commands](https://github.com/NodeRedis/redis-commands) dependency ([changelog](https://github.com/NodeRedis/redis-commands/releases/tag/v.1.2.0))

Bugfixes

- Fixed v.2.5.0 auth command regression (under special circumstances a reconnect would not authenticate properly)
- Fixed v.2.6.0-0 pub sub mode and quit command regressions:
- Entering pub sub mode not working if a earlier called and still running command returned an error
- Unsubscribe callback not called if unsubscribing from all channels and resubscribing right away
- Quit command resulting in an error in some cases
- Fixed special handled functions in batch and multi context not working the same as without (e.g. select and info)
- Be aware that not all commands work in combination with transactions but they all work with batch
- Fixed address always set to 127.0.0.1:6379 in case host / port is set in the `tls` options instead of the general options

## v2.6.0-1 - 01 Apr, 2016

A second pre-release with further fixes. This is likely going to be released as 2.6.0 stable without further changes.

Features

- Added type validations for client.send_command arguments

Bugfixes

- Fixed client.send_command not working properly with every command and every option
- Fixed pub sub mode unsubscribing from all channels in combination with the new `string_numbers` option crashing
- Fixed pub sub mode unsubscribing from all channels not respected while reconnecting
- Fixed pub sub mode events in combination with the `string_numbers` option emitting the number of channels not as number

## v2.6.0-0 - 27 Mar, 2016

This is mainly a very important bug fix release with some smaller features.

Features

- Monitor and pub sub mode now work together with the offline queue
- All commands that were send after a connection loss are now going to be send after reconnecting
- Activating monitor mode does now work together with arbitrary commands including pub sub mode
- Pub sub mode is completely rewritten and all known issues fixed
- Added `string_numbers` option to get back strings instead of numbers
- Quit command is from now on always going to end the connection properly

Bugfixes

- Fixed calling monitor command while other commands are still running
- Fixed monitor and pub sub mode not working together
- Fixed monitor mode not working in combination with the offline queue
- Fixed pub sub mode not working in combination with the offline queue
- Fixed pub sub mode resubscribing not working with non utf8 buffer channels
- Fixed pub sub mode crashing if calling unsubscribe / subscribe in various combinations
- Fixed pub sub mode emitting unsubscribe even if no channels were unsubscribed
- Fixed pub sub mode emitting a message without a message published
- Fixed quit command not ending the connection and resulting in further reconnection if called while reconnecting

The quit command did not end connections earlier if the connection was down at that time and this could have
lead to strange situations, therefor this was fixed to end the connection right away in those cases.

## v2.5.3 - 21 Mar, 2016

Bugfixes

- Revert throwing on invalid data types and print a warning instead

## v2.5.2 - 16 Mar, 2016

Bugfixes

- Fixed breaking changes against Redis 2.4 introduced in 2.5.0 / 2.5.1

## v2.5.1 - 15 Mar, 2016

Bugfixes

- Fixed info command not working anymore with optional section argument

## v2.5.0 - 15 Mar, 2016

Same changelog as the pre-release

## v2.5.0-1 - 07 Mar, 2016

This is a big release with some substantial underlining changes. Therefor this is released as a pre-release and I encourage anyone who's able to, to test this out.

It took way to long to release this one and the next release cycles will be shorter again.

This release is also going to deprecate a couple things to prepare for a future v.3 (it'll still take a while to v.3).

Features

- The parsers moved into the [redis-parser](https://github.com/NodeRedis/node-redis-parser) module and will be maintained in there from now on
- Improve js parser speed significantly for big SUNION/SINTER/LRANGE/ZRANGE
- Improve redis-url parsing to also accept the database-number and options as query parameters as suggested in [IANA](http://www.iana.org/assignments/uri-schemes/prov/redis)
- Added a `retry_unfulfilled_commands` option
- Setting this to 'true' results in retrying all commands that were not fulfilled on a connection loss after the reconnect. Use with caution
- Added a `db` option to select the database while connecting (this is [not recommended](https://groups.google.com/forum/#!topic/redis-db/vS5wX8X4Cjg))
- Added a `password` option as alias for auth_pass
- The client.server_info is from now on updated while using the info command
- Gracefuly handle redis protocol errors from now on
- Added a `warning` emitter that receives node_redis warnings like auth not required and deprecation messages
- Added a `retry_strategy` option that replaces all reconnect options
- The reconnecting event from now on also receives:
- The error message why the reconnect happened (params.error)
- The amount of times the client was connected (params.times_connected)
- The total reconnecting time since the last time connected (params.total_retry_time)
- Always respect the command execution order no matter if the reply could be returned sync or not (former exceptions: [#937](https://github.com/NodeRedis/node_redis/issues/937#issuecomment-167525939))
- redis.createClient is now checking input values stricter and detects more faulty input
- Started refactoring internals into individual modules
- Pipelining speed improvements

Bugfixes

- Fixed explicit undefined as a command callback in a multi context
- Fixed hmset failing to detect the first key as buffer or date if the key is of that type
- Fixed do not run toString on an array argument and throw a "invalid data" error instead
- This is not considered as breaking change, as this is likely a error in your code and if you want to have such a behavior you should handle this beforehand
- The same applies to Map / Set and individual Object types
- Fixed redis url not accepting the protocol being omitted or protocols other than the redis protocol for convenience
- Fixed parsing the db keyspace even if the first database does not begin with a zero
- Fixed handling of errors occurring while receiving pub sub messages
- Fixed huge string pipelines crashing NodeJS (Pipeline size above 256mb)
- Fixed rename_commands and prefix option not working together
- Fixed ready being emitted to early in case a slave is still syncing / master down

Deprecations

- Using any command with a argument being set to null or undefined is deprecated
- From v.3.0.0 on using a command with such an argument will return an error instead
- If you want to keep the old behavior please use a precheck in your code that converts the arguments to a string.
- Using SET or SETEX with a undefined or null value will from now on also result in converting the value to "null" / "undefined" to have a consistent behavior. This is not considered as breaking change, as it returned an error earlier.
- Using .end(flush) without the flush parameter is deprecated and the flush parameter should explicitly be used
- From v.3.0.0 on using .end without flush will result in an error
- Using .end without flush means that any command that did not yet return is going to silently fail. Therefor this is considered harmful and you should explicitly silence such errors if you are sure you want this
- Depending on the return value of a command to detect the backpressure is deprecated
- From version 3.0.0 on node_redis might not return true / false as a return value anymore. Please rely on client.should_buffer instead
- The `socket_nodelay` option is deprecated and will be removed in v.3.0.0
- If you want to buffer commands you should use [.batch or .multi](./README.md) instead. This is necessary to reduce the amount of different options and this is very likely reducing your throughput if set to false.
- If you are sure you want to activate the NAGLE algorithm you can still activate it by using client.stream.setNoDelay(false)
- The `max_attempts` option is deprecated and will be removed in v.3.0.0. Please use the `retry_strategy` instead
- The `retry_max_delay` option is deprecated and will be removed in v.3.0.0. Please use the `retry_strategy` instead
- The drain event is deprecated and will be removed in v.3.0.0. Please listen to the stream drain event instead
- The idle event is deprecated and will likely be removed in v.3.0.0. If you rely on this feature please open a new ticket in node_redis with your use case
- Redis < v. 2.6 is not officially supported anymore and might not work in all cases. Please update to a newer redis version as it is not possible to test for these old versions
- Removed non documented command syntax (adding the callback to an arguments array instead of passing it as individual argument)

## v2.4.2 - 27 Nov, 2015

Bugfixes

- Fixed not emitting ready after reconnect with disable_resubscribing ([@maxgalbu](https://github.com/maxgalbu))

## v2.4.1 - 25 Nov, 2015

Bugfixes

- Fixed a js parser regression introduced in 2.4.0 ([@BridgeAR](https://github.com/BridgeAR))

## v2.4.0 - 25 Nov, 2015

Features

- Added `tls` option to initiate a connection to a redis server behind a TLS proxy. Thanks ([@paddybyers](https://github.com/paddybyers))
- Added `prefix` option to auto key prefix any command with the provided prefix ([@luin](https://github.com/luin) & [@BridgeAR](https://github.com/BridgeAR))
- Added `url` option to pass the connection url with the options object ([@BridgeAR](https://github.com/BridgeAR))
- Added `client.duplicate([options])` to duplicate the current client and return a new one with the same options ([@BridgeAR](https://github.com/BridgeAR))
- Improve performance by up to 20% on almost all use cases ([@BridgeAR](https://github.com/BridgeAR))

Bugfixes

- Fixed js parser handling big values slow ([@BridgeAR](https://github.com/BridgeAR))
- The speed is now on par with the hiredis parser.

## v2.3.1 - 18 Nov, 2015

Bugfixes

- Fixed saving buffers with charsets other than utf-8 while using multi ([@BridgeAR](https://github.com/BridgeAR))
- Fixed js parser handling big values very slow ([@BridgeAR](https://github.com/BridgeAR))
- The speed is up to ~500% faster than before but still up to ~50% slower than the hiredis parser.

## v2.3.0 - 30 Oct, 2015

Features

- Improve speed further for: ([@BridgeAR](https://github.com/BridgeAR))
- saving big strings (up to +300%)
- using .multi / .batch (up to +50% / on Node.js 0.10.x +300%)
- saving small buffers
- Increased coverage to 99% ([@BridgeAR](https://github.com/BridgeAR))
- Refactored manual backpressure control ([@BridgeAR](https://github.com/BridgeAR))
- Removed the high water mark and low water mark. Such a mechanism should be implemented by a user instead
- The `drain` event is from now on only emitted if the stream really had to buffer
- Reduced the default connect_timeout to be one hour instead of 24h ([@BridgeAR](https://github.com/BridgeAR))
- Added .path to redis.createClient(options); ([@BridgeAR](https://github.com/BridgeAR))
- Ignore info command, if not available on server ([@ivanB1975](https://github.com/ivanB1975))

Bugfixes

- Fixed a js parser error that could result in a timeout ([@BridgeAR](https://github.com/BridgeAR))
- Fixed .multi / .batch used with Node.js 0.10.x not working properly after a reconnect ([@BridgeAR](https://github.com/BridgeAR))
- Fixed fired but not yet returned commands not being rejected after a connection loss ([@BridgeAR](https://github.com/BridgeAR))
- Fixed connect_timeout not respected if no connection has ever been established ([@gagle](https://github.com/gagle) & [@benjie](https://github.com/benjie))
- Fixed return_buffers in pub sub mode ([@komachi](https://github.com/komachi))

## v2.2.5 - 18 Oct, 2015

Bugfixes

- Fixed undefined options passed to a new instance not accepted (possible with individual .createClient functions) ([@BridgeAR](https://github.com/BridgeAR))

## v2.2.4 - 17 Oct, 2015

Bugfixes

- Fixed unspecific error message for unresolvable commands ([@BridgeAR](https://github.com/BridgeAR))
- Fixed not allowed command error in pubsub mode not being returned in a provided callback ([@BridgeAR](https://github.com/BridgeAR))
- Fixed to many commands forbidden in pub sub mode ([@BridgeAR](https://github.com/BridgeAR))
- Fixed mutation of the arguments array passed to .multi / .batch constructor ([@BridgeAR](https://github.com/BridgeAR))
- Fixed mutation of the options object passed to createClient ([@BridgeAR](https://github.com/BridgeAR))
- Fixed error callback in .multi not called if connection in broken mode ([@BridgeAR](https://github.com/BridgeAR))

## v2.2.3 - 14 Oct, 2015

Bugfixes

- Fixed multi not being executed on Node 0.10.x if node_redis not yet ready ([@BridgeAR](https://github.com/BridgeAR))

## v2.2.2 - 14 Oct, 2015

Bugfixes

- Fixed regular commands not being executed after a .multi until .exec was called ([@BridgeAR](https://github.com/BridgeAR))

## v2.2.1 - 12 Oct, 2015

No code change

## v2.2.0 - 12 Oct, 2015 - The peregrino falcon

The peregrino falcon is the fasted bird on earth and this is what this release is all about: Increased performance for heavy usage by up to **400%** [sic!] and increased overall performance for any command as well. Please check the benchmarks in the [README.md](README.md) for further details.

Features

- Added rename_commands options to handle renamed commands from the redis config ([@digmxl](https://github.com/digmxl) & [@BridgeAR](https://github.com/BridgeAR))
- Added disable_resubscribing option to prevent a client from resubscribing after reconnecting ([@BridgeAR](https://github.com/BridgeAR))
- Increased performance ([@BridgeAR](https://github.com/BridgeAR))
- exchanging built in queue with [@petkaantonov](https://github.com/petkaantonov)'s [double-ended queue](https://github.com/petkaantonov/deque)
- prevent polymorphism
- optimize statements
- Added _.batch_ command, similar to .multi but without transaction ([@BridgeAR](https://github.com/BridgeAR))
- Improved pipelining to minimize the [RTT](http://redis.io/topics/pipelining) further ([@BridgeAR](https://github.com/BridgeAR))

Bugfixes

- Fixed a javascript parser regression introduced in 2.0 that could result in timeouts on high load. ([@BridgeAR](https://github.com/BridgeAR))
- I was not able to write a regression test for this, since the error seems to only occur under heavy load with special conditions. So please have a look for timeouts with the js parser, if you use it and report all issues and switch to the hiredis parser in the meanwhile. If you're able to come up with a reproducable test case, this would be even better :)
- Fixed should_buffer boolean for .exec, .select and .auth commands not being returned and fix a couple special conditions ([@BridgeAR](https://github.com/BridgeAR))

If you do not rely on transactions but want to reduce the RTT you can use .batch from now on. It'll behave just the same as .multi but it does not have any transaction and therefor won't roll back any failed commands.<br>
Both .multi and .batch are from now on going to cache the commands and release them while calling .exec.

Please consider using .batch instead of looping through a lot of commands one by one. This will significantly improve your performance.

Here are some stats compared to ioredis 1.9.1 (Lenovo T450s i7-5600U):

                      simple set
          82,496 op/s » ioredis
         112,617 op/s » node_redis

                      simple get
          82,015 op/s » ioredis
         105,701 op/s » node_redis

                      simple get with pipeline
          10,233 op/s » ioredis
          26,541 op/s » node_redis (using .batch)

                      lrange 100
           7,321 op/s » ioredis
          26,155 op/s » node_redis

                      publish
          90,524 op/s » ioredis
         112,823 op/s » node_redis

                      subscribe
          43,783 op/s » ioredis
          61,889 op/s » node_redis

To conclude: we can proudly say that node_redis is very likely outperforming any other node redis client.

Known issues

- The pub sub system has some flaws and those will be addressed in the next minor release

## v2.1.0 - Oct 02, 2015

Features:

- Addded optional flush parameter to `.end`. If set to true, commands fired after using .end are going to be rejected instead of being ignored. (@crispy1989)
- Addded: host and port can now be provided in a single options object. E.g. redis.createClient({ host: 'localhost', port: 1337, max_attempts: 5 }); (@BridgeAR)
- Speedup common cases (@BridgeAR)

Bugfixes:

- Fix argument mutation while using the array notation with the multi constructor (@BridgeAR)
- Fix multi.hmset key not being type converted if used with an object and key not being a string (@BridgeAR)
- Fix parser errors not being catched properly (@BridgeAR)
- Fix a crash that could occur if a redis server does not return the info command as usual #541 (@BridgeAR)
- Explicitly passing undefined as a callback statement will work again. E.g. client.publish('channel', 'message', undefined); (@BridgeAR)

## v2.0.1 - Sep 24, 2015

Bugfixes:

- Fix argument mutation while using the array notation in combination with keys / callbacks ([#866](.)). (@BridgeAR)

## v2.0.0 - Sep 21, 2015

This is the biggest release that node_redis had since it was released in 2010. A long list of outstanding bugs has been fixed, so we are very happy to present you redis 2.0 and we highly recommend updating as soon as possible.

# What's new in 2.0

- Implemented a "connection is broken" mode if no connection could be established
- node_redis no longer throws under any circumstances, preventing it from terminating applications.
- Multi error handling is now working properly
- Consistent command behavior including multi
- Windows support
- Improved performance
- A lot of code cleanup
- Many bug fixes
- Better user support!

## Features:

- Added a "redis connection is broken" mode after reaching max connection attempts / exceeding connection timeout. (@BridgeAR)
- Added NODE_DEBUG=redis env to activate the debug_mode (@BridgeAR)
- Added a default connection timeout of 24h instead of never timing out as a default (@BridgeAR)
- Added: Network errors and other stream errors will from now on include the error code as `err.code` property (@BridgeAR)
- Added: Errors thrown by redis will now include the redis error code as `err.code` property. (@skeggse & @BridgeAR)
- Added: Errors thrown by node_redis will now include a `err.command` property for the command used (@BridgeAR)
- Added new commands and drop support for deprecated _substr_ (@BridgeAR)
- Added new possibilities how to provide the command arguments (@BridgeAR)
- The entries in the keyspace of the server_info is now an object instead of a string. (@SinisterLight & @BridgeAR)
- Small speedup here and there (e.g. by not using .toLowerCase() anymore) (@BridgeAR)
- Full windows support (@bcoe)
- Increased coverage by 10% and add a lot of tests to make sure everything works as it should. We now reached 97% :-) (@BridgeAR)
- Remove dead code, clean up and refactor very old chunks (@BridgeAR)
- Don't flush the offline queue if reconnecting (@BridgeAR)
- Emit all errors insteaf of throwing sometimes and sometimes emitting them (@BridgeAR)
- _auth_pass_ passwords are now checked to be a valid password (@jcppman & @BridgeAR)

## Bug fixes:

- Don't kill the app anymore by randomly throwing errors sync instead of emitting them (@BridgeAR)
- Don't catch user errors anymore occuring in callbacks (no try callback anymore & more fixes for the parser) (@BridgeAR)
- Early garbage collection of queued items (@dohse)
- Fix js parser returning errors as strings (@BridgeAR)
- Do not wrap errors into other errors (@BridgeAR)
- Authentication failures are now returned in the callback instead of being emitted (@BridgeAR)
- Fix a memory leak on reconnect (@rahar)
- Using `send_command` directly may now also be called without the args as stated in the [README.md](./README.md) (@BridgeAR)
- Fix the multi.exec error handling (@BridgeAR)
- Fix commands being inconsistent and behaving wrong (@BridgeAR)
- Channel names with spaces are now properly resubscribed after a reconnection (@pbihler)
- Do not try to reconnect after the connection timeout has been exceeded (@BridgeAR)
- Ensure the execution order is observed if using .eval (@BridgeAR)
- Fix commands not being rejected after calling .quit (@BridgeAR)
- Fix .auth calling the callback twice if already connected (@BridgeAR)
- Fix detect_buffers not working in pub sub mode and while monitoring (@BridgeAR)
- Fix channel names always being strings instead of buffers while return_buffers is true (@BridgeAR)
- Don't print any debug statements if not asked for (@BridgeAR)
- Fix a couple small other bugs

## Breaking changes:

1. redis.send_command commands have to be lower case from now on. This does only apply if you use `.send_command` directly instead of the convenient methods like `redis.command`.
2. Error messages have changed quite a bit. If you depend on a specific wording please check your application carfully.
3. Errors are from now on always either returned if a callback is present or emitted. They won't be thrown (neither sync, nor async).
4. The Multi error handling has changed a lot!

- All errors are from now on errors instead of strings (this only applied to the js parser).
- If an error occurs while queueing the commands an EXECABORT error will be returned including the failed commands as `.errors` property instead of an array with errors.
- If an error occurs while executing the commands and that command has a callback it'll return the error as first parameter (`err, undefined` instead of `null, undefined`).
- All the errors occuring while executing the commands will stay in the result value as error instance (if you used the js parser before they would have been strings). Be aware that the transaction won't be aborted if those error occurr!
- If `multi.exec` does not have a callback and an EXECABORT error occurrs, it'll emit that error instead.

5. If redis can't connect to your redis server it'll give up after a certain point of failures (either max connection attempts or connection timeout exceeded). If that is the case it'll emit an CONNECTION_BROKEN error. You'll have to initiate a new client to try again afterwards.
6. The offline queue is not flushed anymore on a reconnect. It'll stay until node_redis gives up trying to reach the server or until you close the connection.
7. Before this release node_redis catched user errors and threw them async back. This is not the case anymore! No user behavior of what so ever will be tracked or catched.
8. The keyspace of `redis.server_info` (db0...) is from now on an object instead of an string.

NodeRedis also thanks @qdb, @tobek, @cvibhagool, @frewsxcv, @davidbanham, @serv, @vitaliylag, @chrishamant, @GamingCoder and all other contributors that I may have missed for their contributions!

From now on we'll push new releases more frequently out and fix further long outstanding things and implement new features.

<hr>

## v1.0.0 - Aug 30, 2015

- Huge issue and pull-request cleanup. Thanks Blain! (@blainsmith)
- [#658](https://github.com/NodeRedis/node_redis/pull/658) Client now parses URL-format connection strings (e.g., redis://foo:pass@127.0.0.1:8080) (@kuwabarahiroshi)
- [#749](https://github.com/NodeRedis/node_redis/pull/749) Fix reconnection bug when client is in monitoring mode (@danielbprice)
- [#786](https://github.com/NodeRedis/node_redis/pull/786) Refactor createClient. Fixes #651 (@BridgeAR)
- [#793](https://github.com/NodeRedis/node_redis/pull/793) Refactor tests and improve test coverage (@erinspice, @bcoe)
- [#733](https://github.com/NodeRedis/node_redis/pull/733) Fixes detect_buffers functionality in the context of exec. Fixes #732, #263 (@raydog)
- [#785](https://github.com/NodeRedis/node_redis/pull/785) Tiny speedup by using 'use strict' (@BridgeAR)
- Fix extraneous error output due to pubsub tests (Mikael Kohlmyr)

## v0.12.1 - Aug 10, 2014

- Fix IPv6/IPv4 family selection in node 0.11+ (Various)

## v0.12.0 - Aug 9, 2014

- Fix unix socket support (Jack Tang)
- Improve createClient argument handling (Jack Tang)

## v0.11.0 - Jul 10, 2014

- IPv6 Support. (Yann Stephan)
- Revert error emitting and go back to throwing errors. (Bryce Baril)
- Set socket_keepalive to prevent long-lived client timeouts. (mohit)
- Correctly reset retry timer. (ouotuo)
- Domains protection from bad user exit. (Jake Verbaten)
- Fix reconnection socket logic to prevent misqueued entries. (Iain Proctor)

## v0.10.3 - May 22, 2014

- Update command list to match Redis 2.8.9 (Charles Feng)

## v0.10.2 - May 18, 2014

- Better binary key handling for HGETALL. (Nick Apperson)
- Fix test not resetting `error` handler. (CrypticSwarm)
- Fix SELECT error semantics. (Bryan English)

## v0.10.1 - February 17, 2014

- Skip plucking redis version from the INFO stream if INFO results weren't provided. (Robert Sköld)

## v0.10.0 - December 21, 2013

- Instead of throwing errors asynchronously, emit errors on client. (Bryce Baril)

## v0.9.2 - December 15, 2013

- Regenerate commands for new 2.8.x Redis commands. (Marek Ventur)
- Correctly time reconnect counts when using 'auth'. (William Hockey)

## v0.9.1 - November 23, 2013

- Allow hmset to accept numeric keys. (Alex Stokes)
- Fix TypeError for multiple MULTI/EXEC errors. (Kwangsu Kim)

## v0.9.0 - October 17, 2013

- Domains support. (Forrest L Norvell)

## v0.8.6 - October 2, 2013

- If error is already an Error, don't wrap it in another Error. (Mathieu M-Gosselin)
- Fix retry delay logic (Ian Babrou)
- Return Errors instead of strings where Errors are expected (Ian Babrou)
- Add experimental `.unref()` method to RedisClient (Bryce Baril / Olivier Lalonde)
- Strengthen checking of reply to prevent conflating "message" or "pmessage" fields with pub_sub replies. (Bryce Baril)

## v0.8.5 - September 26, 2013

- Add `auth_pass` option to connect and immediately authenticate (Henrik Peinar)

## v0.8.4 - June 24, 2013

Many contributed features and fixes, including:

- Ignore password set if not needed. (jbergknoff)
- Improved compatibility with 0.10.X for tests and client.end() (Bryce Baril)
- Protect connection retries from application exceptions. (Amos Barreto)
- Better exception handling for Multi/Exec (Thanasis Polychronakis)
- Renamed pubsub mode to subscriber mode (Luke Plaster)
- Treat SREM like SADD when passed an array (Martin Ciparelli)
- Fix empty unsub/punsub TypeError (Jeff Barczewski)
- Only attempt to run a callback if it one was provided (jifeng)

## v0.8.3 - April 09, 2013

Many contributed features and fixes, including:

- Fix some tests for Node.js version 0.9.x+ changes (Roman Ivanilov)
- Fix error when commands submitted after idle event handler (roamm)
- Bypass Redis for no-op SET/SETEX commands (jifeng)
- Fix HMGET + detect_buffers (Joffrey F)
- Fix CLIENT LOAD functionality (Jonas Dohse)
- Add percentage outputs to diff_multi_bench_output.js (Bryce Baril)
- Add retry_max_delay option (Tomasz Durka)
- Fix parser off-by-one errors with nested multi-bulk replies (Bryce Baril)
- Prevent parser from sinking application-side exceptions (Bryce Baril)
- Fix parser incorrect buffer skip when parsing multi-bulk errors (Bryce Baril)
- Reverted previous change with throwing on non-string values with HMSET (David Trejo)
- Fix command queue sync issue when using pubsub (Tom Leach)
- Fix compatibility with two-word Redis commands (Jonas Dohse)
- Add EVAL with array syntax (dmoena)
- Fix tests due to Redis reply order changes in 2.6.5+ (Bryce Baril)
- Added a test for the SLOWLOG command (Nitesh Sinha)
- Fix SMEMBERS order dependency in test broken by Redis changes (Garrett Johnson)
- Update commands for new Redis commands (David Trejo)
- Prevent exception from SELECT on subscriber reconnection (roamm)

## v0.8.2 - November 11, 2012

Another version bump because 0.8.1 didn't get applied properly for some mysterious reason.
Sorry about that.

Changed name of "faster" parser to "javascript".

## v0.8.1 - September 11, 2012

Important bug fix for null responses (Jerry Sievert)

## v0.8.0 - September 10, 2012

Many contributed features and fixes, including:

- Pure JavaScript reply parser that is usually faster than hiredis (Jerry Sievert)
- Remove hiredis as optionalDependency from package.json. It still works if you want it.
- Restore client state on reconnect, including select, subscribe, and monitor. (Ignacio Burgueño)
- Fix idle event (Trae Robrock)
- Many documentation improvements and bug fixes (David Trejo)

## v0.7.2 - April 29, 2012

Many contributed fixes. Thank you, contributors.

- [GH-190] - pub/sub mode fix (Brian Noguchi)
- [GH-165] - parser selection fix (TEHEK)
- numerous documentation and examples updates
- auth errors emit Errors instead of Strings (David Trejo)

## v0.7.1 - November 15, 2011

Fix regression in reconnect logic.

Very much need automated tests for reconnection and queue logic.

## v0.7.0 - November 14, 2011

Many contributed fixes. Thanks everybody.

- [GH-127] - properly re-initialize parser on reconnect
- [GH-136] - handle passing undefined as callback (Ian Babrou)
- [GH-139] - properly handle exceptions thrown in pub/sub event handlers (Felix Geisendörfer)
- [GH-141] - detect closing state on stream error (Felix Geisendörfer)
- [GH-142] - re-select database on reconnection (Jean-Hugues Pinson)
- [GH-146] - add sort example (Maksim Lin)

Some more goodies:

- Fix bugs with node 0.6
- Performance improvements
- New version of `multi_bench.js` that tests more realistic scenarios
- [GH-140] - support optional callback for subscribe commands
- Properly flush and error out command queue when connection fails
- Initial work on reconnection thresholds

## v0.6.7 - July 30, 2011

(accidentally skipped v0.6.6)

Fix and test for [GH-123]

Passing an Array as as the last argument should expand as users
expect. The old behavior was to coerce the arguments into Strings,
which did surprising things with Arrays.

## v0.6.5 - July 6, 2011

Contributed changes:

- Support SlowBuffers (Umair Siddique)
- Add Multi to exports (Louis-Philippe Perron)
- Fix for drain event calculation (Vladimir Dronnikov)

Thanks!

## v0.6.4 - June 30, 2011

Fix bug with optional callbacks for hmset.

## v0.6.2 - June 30, 2011

Bugs fixed:

- authentication retry while server is loading db (danmaz74) [GH-101]
- command arguments processing issue with arrays

New features:

- Auto update of new commands from redis.io (Dave Hoover)
- Performance improvements and backpressure controls.
- Commands now return the true/false value from the underlying socket write(s).
- Implement command_queue high water and low water for more better control of queueing.

See `examples/backpressure_drain.js` for more information.

## v0.6.1 - June 29, 2011

Add support and tests for Redis scripting through EXEC command.

Bug fix for monitor mode. (forddg)

Auto update of new commands from redis.io (Dave Hoover)

## v0.6.0 - April 21, 2011

Lots of bugs fixed.

- connection error did not properly trigger reconnection logic [GH-85]
- client.hmget(key, [val1, val2]) was not expanding properly [GH-66]
- client.quit() while in pub/sub mode would throw an error [GH-87]
- client.multi(['hmset', 'key', {foo: 'bar'}]) fails [GH-92]
- unsubscribe before subscribe would make things very confused [GH-88]
- Add BRPOPLPUSH [GH-79]

## v0.5.11 - April 7, 2011

Added DISCARD

I originally didn't think DISCARD would do anything here because of the clever MULTI interface, but somebody
pointed out to me that DISCARD can be used to flush the WATCH set.

## v0.5.10 - April 6, 2011

Added HVALS

## v0.5.9 - March 14, 2011

Fix bug with empty Array arguments - Andy Ray

## v0.5.8 - March 14, 2011

Add `MONITOR` command and special monitor command reply parsing.

## v0.5.7 - February 27, 2011

Add magical auth command.

Authentication is now remembered by the client and will be automatically sent to the server
on every connection, including any reconnections.

## v0.5.6 - February 22, 2011

Fix bug in ready check with `return_buffers` set to `true`.

Thanks to Dean Mao and Austin Chau.

## v0.5.5 - February 16, 2011

Add probe for server readiness.

When a Redis server starts up, it might take a while to load the dataset into memory.
During this time, the server will accept connections, but will return errors for all non-INFO
commands. Now node_redis will send an INFO command whenever it connects to a server.
If the info command indicates that the server is not ready, the client will keep trying until
the server is ready. Once it is ready, the client will emit a "ready" event as well as the
"connect" event. The client will queue up all commands sent before the server is ready, just
like it did before. When the server is ready, all offline/non-ready commands will be replayed.
This should be backward compatible with previous versions.

To disable this ready check behavior, set `options.no_ready_check` when creating the client.

As a side effect of this change, the key/val params from the info command are available as
`client.server_options`. Further, the version string is decomposed into individual elements
in `client.server_options.versions`.

## v0.5.4 - February 11, 2011

Fix excess memory consumption from Queue backing store.

Thanks to Gustaf Sjöberg.

## v0.5.3 - February 5, 2011

Fix multi/exec error reply callback logic.

Thanks to Stella Laurenzo.

## v0.5.2 - January 18, 2011

Fix bug where unhandled error replies confuse the parser.

## v0.5.1 - January 18, 2011

Fix bug where subscribe commands would not handle redis-server startup error properly.

## v0.5.0 - December 29, 2010

Some bug fixes:

- An important bug fix in reconnection logic. Previously, reply callbacks would be invoked twice after
  a reconnect.
- Changed error callback argument to be an actual Error object.

New feature:

- Add friendly syntax for HMSET using an object.

## v0.4.1 - December 8, 2010

Remove warning about missing hiredis. You probably do want it though.

## v0.4.0 - December 5, 2010

Support for multiple response parsers and hiredis C library from Pieter Noordhuis.
Return Strings instead of Buffers by default.
Empty nested mb reply bug fix.

## v0.3.9 - November 30, 2010

Fix parser bug on failed EXECs.

## v0.3.8 - November 10, 2010

Fix for null MULTI response when WATCH condition fails.

## v0.3.7 - November 9, 2010

Add "drain" and "idle" events.

## v0.3.6 - November 3, 2010

Add all known Redis commands from Redis master, even ones that are coming in 2.2 and beyond.

Send a friendlier "error" event message on stream errors like connection refused / reset.

## v0.3.5 - October 21, 2010

A few bug fixes.

- Fixed bug with `nil` multi-bulk reply lengths that showed up with `BLPOP` timeouts.
- Only emit `end` once when connection goes away.
- Fixed bug in `test.js` where driver finished before all tests completed.

## unversioned wasteland

See the git history for what happened before.
