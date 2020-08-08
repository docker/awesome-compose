#!/usr/bin/env bats

load test_helper

@test "assert_success(): returns 0 if \`\$status' is 0" {
  run true
  run assert_success

  assert_test_pass
}

@test "assert_success(): returns 1 and displays details if \`\$status' is not 0" {
  run bash -c 'echo "a"
               exit 1'
  run assert_success

  assert_test_fail <<'ERR_MSG'

-- command failed --
status : 1
output : a
--
ERR_MSG
}

@test "assert_success(): displays \`\$output' in multi-line format if it is longer than one line" {
  run bash -c 'printf "a 0\na 1"
               exit 1'
  run assert_success

  assert_test_fail <<'ERR_MSG'

-- command failed --
status : 1
output (2 lines):
  a 0
  a 1
--
ERR_MSG
}
