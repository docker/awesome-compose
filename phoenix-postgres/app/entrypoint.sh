#!/bin/sh
# Docker entrypoint script.

./app/bin/app eval "App.Db.Release.migrate"

# run seeding, uncomment if you have seeding scripts
# ./app/bin/app eval "App.Db.Release.seed"

# Start our app
./app/bin/app start