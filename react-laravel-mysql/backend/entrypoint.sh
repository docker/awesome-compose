#!/bin/sh

set -e

echo "In entry point"

php artisan key:generate --silent

php artisan migrate --force

php artisan db:seed

exec "$@"