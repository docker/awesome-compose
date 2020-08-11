.phony: test-all test-changed update-tests

BASE_REF ?= origin/master
UID := $(shell id -u)
GID := $(shell grep docker /etc/group| cut -d: -f3)

all: docker-test-changed

test-all:
	@bats -T $(shell find . -name test.bats| sort )

test-changed:
	@bats -T $(shell git diff --name-status ${BASE_REF} | awk '{ print $$2}' | xargs -I% dirname % | grep -v -E '(^\.|lib)' | xargs -I% echo "%/test.bats")

update-tests:
	@find . -maxdepth 1 -type d -not -path '*/\.*' -not -path '.' -not -path './lib' -exec cp ./lib/test.bats.example {}/test.bats \;

docker:
	@docker build --build-arg=UID=${UID} --build-arg=GID=${GID} -t awesome-compose ./extras

docker-test-all: docker
	@docker run --rm -it --network=host -v /var/run/docker.sock:/var/run/docker.sock -v ${PWD}:/code awesome-compose -c "make test-all"

docker-test-changed: docker
	@docker run --rm -it --network=host -v /var/run/docker.sock:/var/run/docker.sock -v ${PWD}:/code awesome-compose -c "make test-changed"

shell: docker
	@docker run --rm -it --network=host -v /var/run/docker.sock:/var/run/docker.sock -v ${PWD}:/code awesome-compose
