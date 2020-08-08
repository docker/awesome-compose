#!/usr/bin/env bats

load test_helper


#
# Literal matching
#

# Correctness
@test "refute_output() <unexpected>: returns 0 if <unexpected> does not equal \`\$output'" {
  run echo 'b'
  run refute_output 'a'
  assert_test_pass
}

@test "refute_output() <unexpected>: returns 1 and displays details if <unexpected> equals \`\$output'" {
  run echo 'a'
  run refute_output 'a'

  assert_test_fail <<'ERR_MSG'

-- output equals, but it was expected to differ --
output : a
--
ERR_MSG
}

@test 'refute_output(): succeeds if output is empty' {
  run echo ''
  run refute_output

  assert_test_pass
}

@test 'refute_output(): fails if output is non-empty' {
  run echo 'a'
  run refute_output

  assert_test_fail <<'ERR_MSG'

-- output non-empty, but expected no output --
output : a
--
ERR_MSG
}

@test 'refute_output() - : reads <unexpected> from STDIN' {
  run echo '-'
  run refute_output - <<INPUT
b
INPUT

  assert_test_pass
}

@test 'refute_output() --stdin : reads <unexpected> from STDIN' {
  run echo '--stdin'
  run refute_output --stdin <<INPUT
b
INPUT

  assert_test_pass
}

# Output formatting
@test 'refute_output() <unexpected>: displays details in multi-line format if necessary' {
  run printf 'a 0\na 1'
  run refute_output $'a 0\na 1'

  assert_test_fail <<'ERR_MSG'

-- output equals, but it was expected to differ --
output (2 lines):
  a 0
  a 1
--
ERR_MSG
}

# Options
@test 'refute_output() <unexpected>: performs literal matching by default' {
  run echo 'a'
  run refute_output '*'
  assert_test_pass
}


#
# Partial matching: `-p' and `--partial'
#

# Options
@test 'refute_output() -p <partial>: enables partial matching' {
  run echo 'abc'
  run refute_output -p 'd'
  assert_test_pass
}

@test 'refute_output() --partial <partial>: enables partial matching' {
  run echo 'abc'
  run refute_output --partial 'd'
  assert_test_pass
}

# Correctness
@test "refute_output() --partial <partial>: returns 0 if <partial> is not a substring in \`\$output'" {
  run printf 'a\nb\nc'
  run refute_output --partial 'd'
  assert_test_pass
}

@test "refute_output() --partial <partial>: returns 1 and displays details if <partial> is a substring in \`\$output'" {
  run echo 'a'
  run refute_output --partial 'a'

  assert_test_fail <<'ERR_MSG'

-- output should not contain substring --
substring : a
output    : a
--
ERR_MSG
}

# Output formatting
@test 'refute_output() --partial <partial>: displays details in multi-line format if necessary' {
  run printf 'a 0\na 1'
  run refute_output --partial 'a'

  assert_test_fail <<'ERR_MSG'

-- output should not contain substring --
substring (1 lines):
  a
output (2 lines):
  a 0
  a 1
--
ERR_MSG
}


#
# Regular expression matching: `-e' and `--regexp'
#

# Options
@test 'refute_output() -e <regexp>: enables regular expression matching' {
  run echo 'abc'
  run refute_output -e '^d'
  assert_test_pass
}

@test 'refute_output() --regexp <regexp>: enables regular expression matching' {
  run echo 'abc'
  run refute_output --regexp '^d'
  assert_test_pass
}

# Correctness
@test "refute_output() --regexp <regexp>: returns 0 if <regexp> does not match \`\$output'" {
  run printf 'a\nb\nc'
  run refute_output --regexp '.*d.*'
  assert_test_pass
}

@test "refute_output() --regexp <regexp>: returns 1 and displays details if <regexp> matches \`\$output'" {
  run echo 'a'
  run refute_output --regexp '.*a.*'

  assert_test_fail <<'ERR_MSG'

-- regular expression should not match output --
regexp : .*a.*
output : a
--
ERR_MSG
}

# Output formatting
@test 'refute_output() --regexp <regexp>: displays details in multi-line format if necessary' {
  run printf 'a 0\na 1'
  run refute_output --regexp '.*a.*'

  assert_test_fail <<'ERR_MSG'

-- regular expression should not match output --
regexp (1 lines):
  .*a.*
output (2 lines):
  a 0
  a 1
--
ERR_MSG
}

# Error handling
@test 'refute_output() --regexp <regexp>: returns 1 and displays an error message if <regexp> is not a valid extended regular expression' {
  run refute_output --regexp '[.*'

  assert_test_fail <<'ERR_MSG'

-- ERROR: refute_output --
Invalid extended regular expression: `[.*'
--
ERR_MSG
}


#
# Common
#

@test "refute_output(): \`--partial' and \`--regexp' are mutually exclusive" {
  run refute_output --partial --regexp

  assert_test_fail <<'ERR_MSG'

-- ERROR: refute_output --
`--partial' and `--regexp' are mutually exclusive
--
ERR_MSG
}

@test "refute_output(): \`--' stops parsing options" {
  run echo '--'
  run refute_output -- '-p'
  assert_test_pass
}
