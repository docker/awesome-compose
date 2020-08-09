.phony: test-all test-changed update-tests

BASE_REF ?= origin/master

all: test-changed

test-all:
	@bats -T $(shell find . -name test.bats| sort )

test-changed:
	@bats -T $(shell git diff --name-status ${BASE_REF} | awk '{print $2}' | xargs dirname | uniq | grep -v -E '^(\.|lib)' | xargs -I% echo -n " %/test.bats" )

update-tests:
	@find . -maxdepth 1 -type d -not -path '*/\.*' -not -path '.' -not -path './lib' -exec cp ./lib/test.bats.example {}/test.bats \;
