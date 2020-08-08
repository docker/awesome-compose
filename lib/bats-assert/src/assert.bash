# assert
# ======
#
# Summary: Fail if the given expression evaluates to false.
#
# Usage: assert <expression>

# Options:
#   <expression>    The expression to evaluate for truthiness.
#                   *__Note:__ The expression must be a simple command.
#                   [Compound commands](https://www.gnu.org/software/bash/manual/bash.html#Compound-Commands),
#                   such as `[[`, can be used only when executed with `bash -c`.*
#
# IO:
#   STDERR - the failed expression, on failure
# Globals:
#   none
# Returns:
#   0 - if expression evaluates to true
#   1 - otherwise
#
#   ```bash
#   @test 'assert()' {
#     touch '/var/log/test.log'
#     assert [ -e '/var/log/test.log' ]
#   }
#   ```
#
# On failure, the failed expression is displayed.
#
#   ```
#   -- assertion failed --
#   expression : [ -e /var/log/test.log ]
#   --
#   ```
assert() {
  if ! "$@"; then
    batslib_print_kv_single 10 'expression' "$*" \
    | batslib_decorate 'assertion failed' \
    | fail
  fi
}
