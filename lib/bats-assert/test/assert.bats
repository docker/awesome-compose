#!/usr/bin/env bats

load test_helper

@test 'assert() <expression>: returns 0 if <expression> evaluates to TRUE' {
  run assert true
  assert_test_pass
}

@test 'assert() <expression>: returns 1 and displays <expression> if it evaluates to FALSE' {
  run assert false

  assert_test_fail <<'ERR_MSG'

-- assertion failed --
expression : false
--
ERR_MSG
}
