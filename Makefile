.phony: test

test:
	@bats -T -r .

update-tests:
	@find . -maxdepth 1 -type d -not -path '*/\.*' -not -path '.' -not -path './lib' -exec cp ./lib/test.bats.example {}/test.bats \;
