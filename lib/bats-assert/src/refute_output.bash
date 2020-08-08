# refute_output
# =============
#
# Summary: Fail if `$output' matches the unexpected output.
#
# Usage: refute_output [-p | -e] [- | [--] <unexpected>]
#
# Options:
#   -p, --partial  Match if `unexpected` is a substring of `$output`
#   -e, --regexp   Treat `unexpected` as an extended regular expression
#   -, --stdin     Read `unexpected` value from STDIN
#   <unexpected>   The unexpected value, substring, or regular expression
#
# IO:
#   STDIN - [=$1] unexpected output
#   STDERR - details, on failure
#            error message, on error
# Globals:
#   output
# Returns:
#   0 - if output matches the unexpected value/partial/regexp
#   1 - otherwise
#
# This function verifies that a command or function does not produce the unexpected output.
# (It is the logical complement of `assert_output`.)
# Output matching can be literal (the default), partial or by regular expression.
# The unexpected output can be specified either by positional argument or read from STDIN by passing the `-`/`--stdin` flag.
#
# ## Literal matching
#
# By default, literal matching is performed.
# The assertion fails if `$output` equals the unexpected output.
#
#   ```bash
#   @test 'refute_output()' {
#     run echo 'want'
#     refute_output 'want'
#   }
#
#   @test 'refute_output() with pipe' {
#     run echo 'hello'
#     echo 'world' | refute_output -
#   }
#
#   @test 'refute_output() with herestring' {
#     run echo 'hello'
#     refute_output - <<< world
#   }
#   ```
#
# On failure, the output is displayed.
#
#   ```
#   -- output equals, but it was expected to differ --
#   output : want
#   --
#   ```
#
# ## Existence
#
# To assert that there is no output at all, omit the matching argument.
#
#   ```bash
#   @test 'refute_output()' {
#     run foo --silent
#     refute_output
#   }
#   ```
#
# On failure, an error message is displayed.
#
#   ```
#   -- unexpected output --
#   expected no output, but output was non-empty
#   --
#   ```
#
# ## Partial matching
#
# Partial matching can be enabled with the `--partial` option (`-p` for short).
# When used, the assertion fails if the unexpected _substring_ is found in `$output`.
#
#   ```bash
#   @test 'refute_output() partial matching' {
#     run echo 'ERROR: no such file or directory'
#     refute_output --partial 'ERROR'
#   }
#   ```
#
# On failure, the substring and the output are displayed.
#
#   ```
#   -- output should not contain substring --
#   substring : ERROR
#   output    : ERROR: no such file or directory
#   --
#   ```
#
# ## Regular expression matching
#
# Regular expression matching can be enabled with the `--regexp` option (`-e` for short).
# When used, the assertion fails if the *extended regular expression* matches `$output`.
#
# *__Note__:
# The anchors `^` and `$` bind to the beginning and the end (respectively) of the entire output;
# not individual lines.*
#
#   ```bash
#   @test 'refute_output() regular expression matching' {
#     run echo 'Foobar v0.1.0'
#     refute_output --regexp '^Foobar v[0-9]+\.[0-9]+\.[0-9]$'
#   }
#   ```
#
# On failure, the regular expression and the output are displayed.
#
#   ```
#   -- regular expression should not match output --
#   regexp : ^Foobar v[0-9]+\.[0-9]+\.[0-9]$
#   output : Foobar v0.1.0
#   --
#   ```
refute_output() {
  local -i is_mode_partial=0
  local -i is_mode_regexp=0
  local -i is_mode_empty=0
  local -i use_stdin=0
  : "${output?}"

  # Handle options.
  if (( $# == 0 )); then
    is_mode_empty=1
  fi

  while (( $# > 0 )); do
    case "$1" in
    -p|--partial) is_mode_partial=1; shift ;;
    -e|--regexp) is_mode_regexp=1; shift ;;
    -|--stdin) use_stdin=1; shift ;;
    --) shift; break ;;
    *) break ;;
    esac
  done

  if (( is_mode_partial )) && (( is_mode_regexp )); then
    echo "\`--partial' and \`--regexp' are mutually exclusive" \
    | batslib_decorate 'ERROR: refute_output' \
    | fail
    return $?
  fi

  # Arguments.
  local unexpected
  if (( use_stdin )); then
    unexpected="$(cat -)"
  else
    unexpected="${1-}"
  fi

  if (( is_mode_regexp == 1 )) && [[ '' =~ $unexpected ]] || (( $? == 2 )); then
    echo "Invalid extended regular expression: \`$unexpected'" \
    | batslib_decorate 'ERROR: refute_output' \
    | fail
    return $?
  fi

  # Matching.
  if (( is_mode_empty )); then
    if [ -n "$output" ]; then
      batslib_print_kv_single_or_multi 6 \
      'output' "$output" \
      | batslib_decorate 'output non-empty, but expected no output' \
      | fail
    fi
  elif (( is_mode_regexp )); then
    if [[ $output =~ $unexpected ]]; then
      batslib_print_kv_single_or_multi 6 \
      'regexp'  "$unexpected" \
      'output' "$output" \
      | batslib_decorate 'regular expression should not match output' \
      | fail
    fi
  elif (( is_mode_partial )); then
    if [[ $output == *"$unexpected"* ]]; then
      batslib_print_kv_single_or_multi 9 \
      'substring' "$unexpected" \
      'output'    "$output" \
      | batslib_decorate 'output should not contain substring' \
      | fail
    fi
  else
    if [[ $output == "$unexpected" ]]; then
      batslib_print_kv_single_or_multi 6 \
      'output' "$output" \
      | batslib_decorate 'output equals, but it was expected to differ' \
      | fail
    fi
  fi
}
