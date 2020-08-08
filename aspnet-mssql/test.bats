#!/usr/bin/env bats

load '../lib/test_helper.bash'
load '../lib/bats-support/load.bash'
load '../lib/bats-assert/load.bash'

cd ${BATS_TEST_DIRNAME}

function setup_file() {
    check_deps
    compose_cleanup
}

function teardown_file() {
    compose_cleanup
}

@test "$(basename ${BATS_TEST_DIRNAME}): pull check" {
    run docker-compose pull
    assert_success
}

@test "$(basename ${BATS_TEST_DIRNAME}): build check" {
    run docker-compose build
    assert_success
}

@test "$(basename ${BATS_TEST_DIRNAME}): up check" {
    run docker-compose up -d
    assert_success
}

@test "$(basename ${BATS_TEST_DIRNAME}): ports check" {

    for service in $(docker-compose ps -q); do

        # simple test to check that any exposed port has something actually listening
        # assumes format 22/tcp, 0.0.0.0:3000->3000/tcp
        ports_string=$(docker ps --filter="ID=${service}" --format "{{.Ports}}")

        if [[ ! -z ${ports_string} ]]; then

            OIFS=${IFS}; IFS=','; service_port=("$ports_string"); IFS=${OIFS}; unset OIFS;

            for i in "${service_port[@]}"; do

                protocol=$(expr "${i}" : '.*\(...$\)')

                # the || true here just makes sure bats doesn't fail the test because a
                # port wasn't matched. We will check for empty ports later
                port=$(expr "${i}" : '.*:\([0-9]*\)->' || true)

                if [[ ${protocol} == "tcp" ]] && [[ ! -z ${port} ]]; then
                    run nc -z -v localhost "${port}"
                    assert_success
                elif [[ "${protocol}" = "udp" ]] && [[ ! -z ${port} ]]; then
                    run nc -z -v -u localhost "${port}"
                    assert_success
                fi

            done

        fi
    done
}
