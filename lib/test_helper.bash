function docker_compose_project_name() {
  echo "$(basename ${BATS_TEST_DIRNAME})"
}

# Runs docker ps -a filtered by the current project name
function docker_ps_by_project() {
  docker ps -a \
    --filter "label=com.docker.compose.project=$(docker_compose_project_name)" \
    "${@}"
}

function check_deps() {
    # external commands we depend on for testing
    local dependancies=(nc)

    for i in ${dependancies[@]}; do
        if [ ! command -v ${i} &> /dev/null ]; then
            echo "${i} could not be found"
            exit
        fi
    done
}

function compose_cleanup() {
    docker-compose kill || true
    docker-compose rm --force -v || true
    docker-compose down --volumes || true
}
