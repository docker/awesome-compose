#!/bin/bash

for service in $(docker-compose ps -q); do

    # simple test to check that any exposed port has something actually listening
    # assumes format 22/tcp, 0.0.0.0:3000->3000/tcp
    ports_string=$(docker ps --filter="ID=${service}" --format "{{.Ports}}")

    OIFS=${IFS}; IFS=','; service_port=("$ports_string"); IFS=${OIFS}; unset OIFS;

    for i in "${service_port[@]}"; do

        protocol=$(expr "${i}" : '.*\(...$\)')

        # the || true here just makes sure bats doesn't fail the test because a
        # port wasn't matched. We will check for empty ports later
        port=$(expr "${i}" : '.*:\([0-9]*\)->' || true)

        if [[ ${protocol} == "tcp" ]] && [[ ! -z ${port} ]]; then
            run nc -z -v localhost "${port}"
            [ "${?}" -eq 0  ]
        elif [[ "${protocol}" = "udp" ]] && [[ ! -z ${port} ]]; then
            run nc -z -v -u localhost "${port}"
            [ "${?}" -eq 0  ]
        fi

    done
done
