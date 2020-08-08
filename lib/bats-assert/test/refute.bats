#!/usr/bin/env bats

load test_helper

@test 'refute() <expression>: returns 0 if <expression> evaluates to FALSE' {
  run refute false
  assert_test_pass
}

@test 'refute() <expression>: returns 1 and displays <expression> if it evaluates to TRUE' {
  run refute true
  assert_test_fail <<'ERR_MSG'

-- assertion succeeded, but it was expected to fail --
expression : true
--
ERR_MSG
}
