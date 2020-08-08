# refute
# ======
#
# Summary: Fail if the given expression evaluates to true.
#
# Usage: refute <expression>
#
# Options:
#   <expression>    The expression to evaluate for falsiness.
#                   *__Note:__ The expression must be a simple command.
#                   [Compound commands](https://www.gnu.org/software/bash/manual/bash.html#Compound-Commands),
#                   such as `[[`, can be used only when executed with `bash -c`.*
#
# IO:
#   STDERR - the successful expression, on failure
# Globals:
#   none
# Returns:
#   0 - if expression evaluates to false
#   1 - otherwise
#
#   ```bash
#   @test 'refute()' {
#     rm -f '/var/log/test.log'
#     refute [ -e '/var/log/test.log' ]
#   }
#   ```
#
# On failure, the successful expression is displayed.
#
#   ```
#   -- assertion succeeded, but it was expected to fail --
#   expression : [ -e /var/log/test.log ]
#   --
#   ```
refute() {
  if "$@"; then
    batslib_print_kv_single 10 'expression' "$*" \
    | batslib_decorate 'assertion succeeded, but it was expected to fail' \
    | fail
  fi
}
