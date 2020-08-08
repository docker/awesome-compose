#!/usr/bin/env bats

load test_helper

@test "assert_failure(): returns 0 if \`\$status' is not 0" {
  run false
  run assert_failure
  assert_test_pass
}

@test "assert_failure(): returns 1 and displays details if \`\$status' is 0" {
  run bash -c 'echo "a"
               exit 0'
  run assert_failure

  assert_test_fail <<'ERR_MSG'

-- command succeeded, but it was expected to fail --
output : a
--
ERR_MSG
}

@test "assert_failure(): displays \`\$output' in multi-line format if it is longer then one line" {
  run bash -c 'printf "a 0\na 1"
               exit 0'
  run assert_failure

  assert_test_fail <<'ERR_MSG'

-- command succeeded, but it was expected to fail --
output (2 lines):
  a 0
  a 1
--
ERR_MSG
}

@test "assert_failure() <status>: returns 0 if \`\$status' equals <status>" {
  run bash -c 'exit 1'
  run assert_failure 1
  assert_test_pass
}

@test "assert_failure() <status>: returns 1 and displays details if \`\$status' does not equal <status>" {
  run bash -c 'echo "a"
               exit 1'
  run assert_failure 2

  assert_test_fail <<'ERR_MSG'

-- command failed as expected, but status differs --
expected : 2
actual   : 1
output   : a
--
ERR_MSG
}

@test "assert_failure() <status>: displays \`\$output' in multi-line format if it is longer then one line" {
  run bash -c 'printf "a 0\na 1"
               exit 1'
  run assert_failure 2

  assert_test_fail <<'ERR_MSG'

-- command failed as expected, but status differs --
expected : 2
actual   : 1
output (2 lines):
  a 0
  a 1
--
ERR_MSG
}
