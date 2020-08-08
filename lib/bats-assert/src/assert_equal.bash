# assert_equal
# ============
#
# Summary: Fail if the actual and expected values are not equal.
#
# Usage: assert_equal <actual> <expected>
#
# Options:
#   <actual>      The value being compared.
#   <expected>    The value to compare against.
#
#   ```bash
#   @test 'assert_equal()' {
#     assert_equal 'have' 'want'
#   }
#   ```
#
# IO:
#   STDERR - expected and actual values, on failure
# Globals:
#   none
# Returns:
#   0 - if values equal
#   1 - otherwise
#
# On failure, the expected and actual values are displayed.
#
#   ```
#   -- values do not equal --
#   expected : want
#   actual   : have
#   --
#   ```
assert_equal() {
  if [[ $1 != "$2" ]]; then
    batslib_print_kv_single_or_multi 8 \
    'expected' "$2" \
    'actual'   "$1" \
    | batslib_decorate 'values do not equal' \
    | fail
  fi
}
