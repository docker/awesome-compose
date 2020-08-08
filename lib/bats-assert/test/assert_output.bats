#!/usr/bin/env bats

load test_helper

#
# Literal matching
#

# Correctness
@test "assert_output() <expected>: returns 0 if <expected> equals \`\$output'" {
  run echo 'a'
  run assert_output 'a'
  assert_test_pass
}

@test "assert_output() <expected>: returns 1 and displays details if <expected> does not equal \`\$output'" {
  run echo 'b'
  run assert_output 'a'

  assert_test_fail <<'ERR_MSG'

-- output differs --
expected : a
actual   : b
--
ERR_MSG
}

@test 'assert_output(): succeeds if output is non-empty' {
  run echo 'a'
  run assert_output

  assert_test_pass
}

@test 'assert_output(): fails if output is empty' {
  run echo ''
  run assert_output

  assert_test_fail <<'ERR_MSG'

-- no output --
expected non-empty output, but output was empty
--
ERR_MSG
}

@test 'assert_output() - : reads <expected> from STDIN' {
  run echo 'a'
  run assert_output - <<STDIN
a
STDIN

  assert_test_pass
}

@test 'assert_output() --stdin : reads <expected> from STDIN' {
  run echo 'a'
  run assert_output --stdin <<STDIN
a
STDIN

  assert_test_pass
}

# Output formatting
@test "assert_output() <expected>: displays details in multi-line format if \`\$output' is longer than one line" {
  run printf 'b 0\nb 1'
  run assert_output 'a'

  assert_test_fail <<'ERR_MSG'

-- output differs --
expected (1 lines):
  a
actual (2 lines):
  b 0
  b 1
--
ERR_MSG
}

@test 'assert_output() <expected>: displays details in multi-line format if <expected> is longer than one line' {
  run echo 'b'
  run assert_output $'a 0\na 1'

  assert_test_fail <<'ERR_MSG'

-- output differs --
expected (2 lines):
  a 0
  a 1
actual (1 lines):
  b
--
ERR_MSG
}

# Options
@test 'assert_output() <expected>: performs literal matching by default' {
  run echo 'a'
  run assert_output '*'

  assert_test_fail <<'ERR_MSG'

-- output differs --
expected : *
actual   : a
--
ERR_MSG
}


#
# Partial matching: `-p' and `--partial'
#

@test 'assert_output() -p <partial>: enables partial matching' {
  run echo 'abc'
  run assert_output -p 'b'
  assert_test_pass
}

@test 'assert_output() --partial <partial>: enables partial matching' {
  run echo 'abc'
  run assert_output --partial 'b'
  assert_test_pass
}

# Correctness
@test "assert_output() --partial <partial>: returns 0 if <partial> is a substring in \`\$output'" {
  run printf 'a\nb\nc'
  run assert_output --partial 'b'
  assert_test_pass
}

@test "assert_output() --partial <partial>: returns 1 and displays details if <partial> is not a substring in \`\$output'" {
  run echo 'b'
  run assert_output --partial 'a'

  assert_test_fail <<'ERR_MSG'

-- output does not contain substring --
substring : a
output    : b
--
ERR_MSG
}

# Output formatting
@test "assert_output() --partial <partial>: displays details in multi-line format if \`\$output' is longer than one line" {
  run printf 'b 0\nb 1'
  run assert_output --partial 'a'

  assert_test_fail <<'ERR_MSG'

-- output does not contain substring --
substring (1 lines):
  a
output (2 lines):
  b 0
  b 1
--
ERR_MSG
}

@test 'assert_output() --partial <partial>: displays details in multi-line format if <partial> is longer than one line' {
  run echo 'b'
  run assert_output --partial $'a 0\na 1'

  assert_test_fail <<'ERR_MSG'

-- output does not contain substring --
substring (2 lines):
  a 0
  a 1
output (1 lines):
  b
--
ERR_MSG
}


#
# Regular expression matching: `-e' and `--regexp'
#

@test 'assert_output() -e <regexp>: enables regular expression matching' {
  run echo 'abc'
  run assert_output -e '^a'
  assert_test_pass
}

@test 'assert_output() --regexp <regexp>: enables regular expression matching' {
  run echo 'abc'
  run assert_output --regexp '^a'
  assert_test_pass
}

# Correctness
@test "assert_output() --regexp <regexp>: returns 0 if <regexp> matches \`\$output'" {
  run printf 'a\nb\nc'
  run assert_output --regexp '.*b.*'
  assert_test_pass
}

@test "assert_output() --regexp <regexp>: returns 1 and displays details if <regexp> does not match \`\$output'" {
  run echo 'b'
  run assert_output --regexp '.*a.*'

  assert_test_fail <<'ERR_MSG'

-- regular expression does not match output --
regexp : .*a.*
output : b
--
ERR_MSG
}

# Output formatting
@test "assert_output() --regexp <regexp>: displays details in multi-line format if \`\$output' is longer than one line" {
  run printf 'b 0\nb 1'
  run assert_output --regexp '.*a.*'

  assert_test_fail <<'ERR_MSG'

-- regular expression does not match output --
regexp (1 lines):
  .*a.*
output (2 lines):
  b 0
  b 1
--
ERR_MSG
}

@test 'assert_output() --regexp <regexp>: displays details in multi-line format if <regexp> is longer than one line' {
  run echo 'b'
  run assert_output --regexp $'.*a\nb.*'

  assert_test_fail <<'ERR_MSG'

-- regular expression does not match output --
regexp (2 lines):
  .*a
  b.*
output (1 lines):
  b
--
ERR_MSG
}

# Error handling
@test 'assert_output() --regexp <regexp>: returns 1 and displays an error message if <regexp> is not a valid extended regular expression' {
  run assert_output --regexp '[.*'

  assert_test_fail <<'ERR_MSG'

-- ERROR: assert_output --
Invalid extended regular expression: `[.*'
--
ERR_MSG
}


#
# Common
#

@test "assert_output(): \`--partial' and \`--regexp' are mutually exclusive" {
  run assert_output --partial --regexp

  assert_test_fail <<'ERR_MSG'

-- ERROR: assert_output --
`--partial' and `--regexp' are mutually exclusive
--
ERR_MSG
}

@test "assert_output(): \`--' stops parsing options" {
  run echo '-p'
  run assert_output -- '-p'
  assert_test_pass
}
