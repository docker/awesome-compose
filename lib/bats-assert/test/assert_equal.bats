#!/usr/bin/env bats

load test_helper

@test 'assert_equal() <actual> <expected>: returns 0 if <actual> equals <expected>' {
  run assert_equal 'a' 'a'
  assert_test_pass
}

@test 'assert_equal() <actual> <expected>: returns 1 and displays details if <actual> does not equal <expected>' {
  run assert_equal 'a' 'b'

  assert_test_fail <<'ERR_MSG'

-- values do not equal --
expected : b
actual   : a
--
ERR_MSG
}

@test 'assert_equal() <actual> <expected>: displays details in multi-line format if <actual> is longer than one line' {
  run assert_equal $'a 0\na 1' 'b'

  assert_test_fail <<'ERR_MSG'

-- values do not equal --
expected (1 lines):
  b
actual (2 lines):
  a 0
  a 1
--
ERR_MSG
}

@test 'assert_equal() <actual> <expected>: displays details in multi-line format if <expected> is longer than one line' {
  run assert_equal 'a' $'b 0\nb 1'

  assert_test_fail <<'ERR_MSG'

-- values do not equal --
expected (2 lines):
  b 0
  b 1
actual (1 lines):
  a
--
ERR_MSG
}

@test 'assert_equal() <actual> <expected>: performs literal matching' {
  run assert_equal 'a' '*'

  assert_test_fail <<'ERR_MSG'

-- values do not equal --
expected : *
actual   : a
--
ERR_MSG
}
