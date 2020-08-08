#!/usr/bin/env bats

load test_helper


###############################################################################
# Containing a line
###############################################################################

#
# Literal matching
#

# Correctness
@test "assert_line() <expected>: returns 0 if <expected> is a line in \`\${lines[@]}'" {
  run printf 'a\nb\nc'
  run assert_line 'b'
  assert_test_pass
}

@test "assert_line() <expected>: returns 1 and displays details if <expected> is not a line in \`\${lines[@]}'" {
  run echo 'b'
  run assert_line 'a'

  assert_test_fail <<'ERR_MSG'

-- output does not contain line --
line   : a
output : b
--
ERR_MSG
}

# Output formatting
@test "assert_line() <expected>: displays \`\$output' in multi-line format if it is longer than one line" {
  run printf 'b 0\nb 1'
  run assert_line 'a'

  assert_test_fail <<'ERR_MSG'

-- output does not contain line --
line : a
output (2 lines):
  b 0
  b 1
--
ERR_MSG
}

# Options
@test 'assert_line() <expected>: performs literal matching by default' {
  run echo 'a'
  run assert_line '*'

  assert_test_fail <<'ERR_MSG'

-- output does not contain line --
line   : *
output : a
--
ERR_MSG
}


#
# Partial matching: `-p' and `--partial'
#

# Options
@test 'assert_line() -p <partial>: enables partial matching' {
  run printf 'a\n_b_\nc'
  run assert_line -p 'b'
  assert_test_pass
}

@test 'assert_line() --partial <partial>: enables partial matching' {
  run printf 'a\n_b_\nc'
  run assert_line --partial 'b'
  assert_test_pass
}

# Correctness
@test "assert_line() --partial <partial>: returns 0 if <partial> is a substring in any line in \`\${lines[@]}'" {
  run printf 'a\n_b_\nc'
  run assert_line --partial 'b'
  assert_test_pass
}

@test "assert_line() --partial <partial>: returns 1 and displays details if <partial> is not a substring in any lines in \`\${lines[@]}'" {
  run echo 'b'
  run assert_line --partial 'a'

  assert_test_fail <<'ERR_MSG'

-- no output line contains substring --
substring : a
output    : b
--
ERR_MSG
}

# Output formatting
@test "assert_line() --partial <partial>: displays \`\$output' in multi-line format if it is longer than one line" {
  run printf 'b 0\nb 1'
  run assert_line --partial 'a'

  assert_test_fail <<'ERR_MSG'

-- no output line contains substring --
substring : a
output (2 lines):
  b 0
  b 1
--
ERR_MSG
}


#
# Regular expression matching: `-e' and `--regexp'
#

# Options
@test 'assert_line() -e <regexp>: enables regular expression matching' {
  run printf 'a\n_b_\nc'
  run assert_line -e '^.b'
  assert_test_pass
}

@test 'assert_line() --regexp <regexp>: enables regular expression matching' {
  run printf 'a\n_b_\nc'
  run assert_line --regexp '^.b'
  assert_test_pass
}

# Correctness
@test "assert_line() --regexp <regexp>: returns 0 if <regexp> matches any line in \`\${lines[@]}'" {
  run printf 'a\n_b_\nc'
  run assert_line --regexp '^.b'
  assert_test_pass
}

@test "assert_line() --regexp <regexp>: returns 1 and displays details if <regexp> does not match any lines in \`\${lines[@]}'" {
  run echo 'b'
  run assert_line --regexp '^.a'

  assert_test_fail <<'ERR_MSG'

-- no output line matches regular expression --
regexp : ^.a
output : b
--
ERR_MSG
}

# Output formatting
@test "assert_line() --regexp <regexp>: displays \`\$output' in multi-line format if longer than one line" {
  run printf 'b 0\nb 1'
  run assert_line --regexp '^.a'

  assert_test_fail <<'ERR_MSG'

-- no output line matches regular expression --
regexp : ^.a
output (2 lines):
  b 0
  b 1
--
ERR_MSG
}


###############################################################################
# Matching single line: `-n' and `--index'
###############################################################################

# Options
@test 'assert_line() -n <idx> <expected>: matches against the <idx>-th line only' {
  run printf 'a\nb\nc'
  run assert_line -n 1 'b'
  assert_test_pass
}

@test 'assert_line() --index <idx> <expected>: matches against the <idx>-th line only' {
  run printf 'a\nb\nc'
  run assert_line --index 1 'b'
  assert_test_pass
}

@test 'assert_line() --index <idx>: returns 1 and displays an error message if <idx> is not an integer' {
  run assert_line --index 1a

  assert_test_fail <<'ERR_MSG'

-- ERROR: assert_line --
`--index' requires an integer argument: `1a'
--
ERR_MSG
}


#
# Literal matching
#

# Correctness
@test "assert_line() --index <idx> <expected>: returns 0 if <expected> equals \`\${lines[<idx>]}'" {
  run printf 'a\nb\nc'
  run assert_line --index 1 'b'
  assert_test_pass
}

@test "assert_line() --index <idx> <expected>: returns 1 and displays details if <expected> does not equal \`\${lines[<idx>]}'" {
  run printf 'a\nb\nc'
  run assert_line --index 1 'a'

  assert_test_fail <<'ERR_MSG'

-- line differs --
index    : 1
expected : a
actual   : b
--
ERR_MSG
}

# Options
@test 'assert_line() --index <idx> <expected>: performs literal matching by default' {
  run printf 'a\nb\nc'
  run assert_line --index 1 '*'

  assert_test_fail <<'ERR_MSG'

-- line differs --
index    : 1
expected : *
actual   : b
--
ERR_MSG
}


#
# Partial matching: `-p' and `--partial'
#

# Options
@test 'assert_line() --index <idx> -p <partial>: enables partial matching' {
  run printf 'a\n_b_\nc'
  run assert_line --index 1 -p 'b'
  assert_test_pass
}

@test 'assert_line() --index <idx> --partial <partial>: enables partial matching' {
  run printf 'a\n_b_\nc'
  run assert_line --index 1 --partial 'b'
  assert_test_pass
}

# Correctness
@test "assert_line() --index <idx> --partial <partial>: returns 0 if <partial> is a substring in \`\${lines[<idx>]}'" {
  run printf 'a\n_b_\nc'
  run assert_line --index 1 --partial 'b'
  assert_test_pass
}

@test "assert_line() --index <idx> --partial <partial>: returns 1 and displays details if <partial> is not a substring in \`\${lines[<idx>]}'" {
  run printf 'b 0\nb 1'
  run assert_line --index 1 --partial 'a'

  assert_test_fail <<'ERR_MSG'

-- line does not contain substring --
index     : 1
substring : a
line      : b 1
--
ERR_MSG
}


#
# Regular expression matching: `-e' and `--regexp'
#

# Options
@test 'assert_line() --index <idx> -e <regexp>: enables regular expression matching' {
  run printf 'a\n_b_\nc'
  run assert_line --index 1 -e '^.b'
  assert_test_pass
}

@test 'assert_line() --index <idx> --regexp <regexp>: enables regular expression matching' {
  run printf 'a\n_b_\nc'
  run assert_line --index 1 --regexp '^.b'
  assert_test_pass
}

# Correctness
@test "assert_line() --index <idx> --regexp <regexp>: returns 0 if <regexp> matches \`\${lines[<idx>]}'" {
  run printf 'a\n_b_\nc'
  run assert_line --index 1 --regexp '^.b'
  assert_test_pass
}

@test "assert_line() --index <idx> --regexp <regexp>: returns 1 and displays details if <regexp> does not match \`\${lines[<idx>]}'" {
  run printf 'a\nb\nc'
  run assert_line --index 1 --regexp '^.a'

  assert_test_fail <<'ERR_MSG'

-- regular expression does not match line --
index  : 1
regexp : ^.a
line   : b
--
ERR_MSG
}


###############################################################################
# Common
###############################################################################

@test "assert_line(): \`--partial' and \`--regexp' are mutually exclusive" {
  run assert_line --partial --regexp

  assert_test_fail <<'ERR_MSG'

-- ERROR: assert_line --
`--partial' and `--regexp' are mutually exclusive
--
ERR_MSG
}

@test 'assert_line() --regexp <regexp>: returns 1 and displays an error message if <regexp> is not a valid extended regular expression' {
  run assert_line --regexp '[.*'

  assert_test_fail <<'ERR_MSG'

-- ERROR: assert_line --
Invalid extended regular expression: `[.*'
--
ERR_MSG
}

@test "assert_line(): \`--' stops parsing options" {
  run printf 'a\n-p\nc'
  run assert_line -- '-p'
  assert_test_pass
}
