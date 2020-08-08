# assert_failure
# ==============
#
# Summary: Fail if `$status` is 0; or is not equal to the optionally provided status.
#
# Usage: assert_failure [<expected_status>]
#
# Options:
#   <expected_status>    The specific status code to check against.
#                        If not provided, simply asserts status is != 0.
#
# IO:
#   STDERR - `$output`, on failure;
#          - also, `$status` and `expected_status`, if provided
# Globals:
#   status
#   output
# Returns:
#   0 - if `$status' is 0,
#       or if expected_status is provided but does not equal `$status'
#   1 - otherwise
#
#   ```bash
#   @test 'assert_failure() status only' {
#     run echo 'Success!'
#     assert_failure
#   }
#   ```
#
# On failure, `$output` is displayed.
#
#   ```
#   -- command succeeded, but it was expected to fail --
#   output : Success!
#   --
#   ```
#
# ## Expected status
#
# When `expected_status` is provided, fail if `$status` does not equal the `expected_status`.
#
#   ```bash
#   @test 'assert_failure() with expected status' {
#     run bash -c "echo 'Error!'; exit 1"
#     assert_failure 2
#   }
#   ```
#
# On failure, both the expected and actual statuses, and `$output` are displayed.
#
#   ```
#   -- command failed as expected, but status differs --
#   expected : 2
#   actual   : 1
#   output   : Error!
#   --
#   ```
assert_failure() {
  : "${output?}"
  : "${status?}"

  (( $# > 0 )) && local -r expected="$1"
  if (( status == 0 )); then
    batslib_print_kv_single_or_multi 6 'output' "$output" \
    | batslib_decorate 'command succeeded, but it was expected to fail' \
    | fail
  elif (( $# > 0 )) && (( status != expected )); then
    { local -ir width=8
      batslib_print_kv_single "$width" \
      'expected' "$expected" \
      'actual'   "$status"
      batslib_print_kv_single_or_multi "$width" \
      'output' "$output"
    } \
    | batslib_decorate 'command failed as expected, but status differs' \
    | fail
  fi
}
