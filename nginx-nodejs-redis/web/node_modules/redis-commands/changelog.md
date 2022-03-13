## v.1.7.0 - 6 Feb, 2021

Features

-  Updated commands list to Redis 6.2

## v.1.6.0 - 25 Jul, 2020

Features

-  Updated commands list to Redis 6.06

## v.1.5.0 - 10 May, 2019

Features

-  Updated the commands list
-  Added support for `XREAD` and `XREADGROUP` in `.getKeyIndexes()`

## v.1.4.0 - 8 Oct, 2018

Features

-  Updated the commands list

## v.1.3.5 - 28 Feb, 2018

Bugfix

-  Rebuild the commands with the latest stable release.
   In v.1.3.3 the wrong Redis version was used.

## v.1.3.4 - 26 Feb, 2018

Chore

-  Removed coverage folder from npm

## v.1.3.3 - 24 Feb, 2018

Features

-  Rebuild the commands

## v.1.3.2 - 24 Feb, 2018

Chore

-  Updated dependencies
-  Fixed typos

## v.1.3.1 - 25 Jan, 2017

Bugfix

-  Fix require for for webpack

## v.1.3.0 - 20 Oct, 2016

Features

-  Rebuild the commands with the newest Redis unstable release

## v.1.2.0 - 21 Apr, 2016

Features

-  Added support for `MIGRATE [...] KEYS key1, key2` (Redis >= v.3.0.6)
-  Added build sanity check for unhandled commands with moveable keys
-  Rebuild the commands with the newest unstable release
-  Improved performance of .getKeyIndexes()

Bugfix

-  Fixed command command returning the wrong arity due to a Redis bug
-  Fixed brpop command returning the wrong keystop due to a Redis bug

## v.1.1.0 - 09 Feb, 2016

Features

-  Added .exists() to check for command existence
-  Improved performance of .hasFlag()
