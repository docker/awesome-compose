# assert_success
# ==============
#
# Summary: Fail if `$status` is not 0.
#
# Usage: assert_success
#
# IO:
#   STDERR - `$status` and `$output`, on failure
# Globals:
#   status
#   output
# Returns:
#   0 - if `$status' is 0
#   1 - otherwise
#
#   ```bash
#   @test 'assert_success() status only' {
#     run bash -c "echo 'Error!'; exit 1"
#     assert_success
#   }
#   ```
#
# On failure, `$status` and `$output` are displayed.
#
#   ```
#   -- command failed --
#   status : 1
#   output : Error!
#   --
#   ```
assert_success() {
  : "${output?}"
  : "${status?}"

  if (( status != 0 )); then
    { local -ir width=6
      batslib_print_kv_single "$width" 'status' "$status"
      batslib_print_kv_single_or_multi "$width" 'output' "$output"
    } \
    | batslib_decorate 'command failed' \
    | fail
  fi
}
