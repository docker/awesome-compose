#!/bin/bash

set -e

if [ -z "$DOMAIN" ]
then
    # If DOMAIN is blank, set to localhost
    # Note: in prod, domain will be the actual domain
    export DOMAIN="localhost"
fi

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
