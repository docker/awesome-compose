# Load dependencies.
load "${BATS_TEST_DIRNAME}/../node_modules/bats-support/load.bash"

# Load library.
load '../load'

# validate that bats-assert is safe to use under -u
set -u

: "${status:=}"
: "${lines:=}"
: "${output:=}"

assert_test_pass() {
  test "$status" -eq 0
  test "${#lines[@]}" -eq 0
}

assert_test_fail() {
  local err_msg="${1-$(cat -)}"
  local num_lines
  num_lines="$(printf '%s' "$err_msg" | wc -l)"

  test "$status" -eq 1
  test "${#lines[@]}" -eq "$num_lines"
  test "$output" == "$err_msg"
}
