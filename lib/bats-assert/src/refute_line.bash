# refute_line
# ===========
#
# Summary: Fail if the unexpected line is found in the output (default) or at a specific line number.
#
# Usage: refute_line [-n index] [-p | -e] [--] <unexpected>
#
# Options:
#   -n, --index <idx> Match the <idx>th line
#   -p, --partial     Match if `unexpected` is a substring of `$output` or line <idx>
#   -e, --regexp      Treat `unexpected` as an extended regular expression
#   <unexpected>      The unexpected line string, substring, or regular expression.
#
# IO:
#   STDERR - details, on failure
#            error message, on error
# Globals:
#   output
#   lines
# Returns:
#   0 - if match not found
#   1 - otherwise
#
# Similarly to `refute_output`, this function verifies that a command or function does not produce the unexpected output.
# (It is the logical complement of `assert_line`.)
# It checks that the unexpected line does not appear in the output (default) or at a specific line number.
# Matching can be literal (default), partial or regular expression.
#
# *__Warning:__
# Due to a [bug in Bats][bats-93], empty lines are discarded from `${lines[@]}`,
# causing line indices to change and preventing testing for empty lines.*
#
# [bats-93]: https://github.com/sstephenson/bats/pull/93
#
# ## Looking for a line in the output
#
# By default, the entire output is searched for the unexpected line.
# The assertion fails if the unexpected line is found in `${lines[@]}`.
#
#   ```bash
#   @test 'refute_line() looking for line' {
#     run echo $'have-0\nwant\nhave-2'
#     refute_line 'want'
#   }
#   ```
#
# On failure, the unexpected line, the index of its first match and the output with the matching line highlighted are displayed.
#
#   ```
#   -- line should not be in output --
#   line  : want
#   index : 1
#   output (3 lines):
#     have-0
#   > want
#     have-2
#   --
#   ```
#
# ## Matching a specific line
#
# When the `--index <idx>` option is used (`-n <idx>` for short), the unexpected line is matched only against the line identified by the given index.
# The assertion fails if the unexpected line equals `${lines[<idx>]}`.
#
#   ```bash
#   @test 'refute_line() specific line' {
#     run echo $'have-0\nwant-1\nhave-2'
#     refute_line --index 1 'want-1'
#   }
#   ```
#
# On failure, the index and the unexpected line are displayed.
#
#   ```
#   -- line should differ --
#   index : 1
#   line  : want-1
#   --
#   ```
#
# ## Partial matching
#
# Partial matching can be enabled with the `--partial` option (`-p` for short).
# When used, a match fails if the unexpected *substring* is found in the matched line.
#
#   ```bash
#   @test 'refute_line() partial matching' {
#     run echo $'have 1\nwant 2\nhave 3'
#     refute_line --partial 'want'
#   }
#   ```
#
# On failure, in addition to the details of literal matching, the substring is also displayed.
# When used with `--index <idx>` the substring replaces the unexpected line.
#
#   ```
#   -- no line should contain substring --
#   substring : want
#   index     : 1
#   output (3 lines):
#     have 1
#   > want 2
#     have 3
#   --
#   ```
#
# ## Regular expression matching
#
# Regular expression matching can be enabled with the `--regexp` option (`-e` for short).
# When used, a match fails if the *extended regular expression* matches the line being tested.
#
# *__Note__:
# As expected, the anchors `^` and `$` bind to the beginning and the end (respectively) of the matched line.*
#
#   ```bash
#   @test 'refute_line() regular expression matching' {
#     run echo $'Foobar v0.1.0\nRelease date: 2015-11-29'
#     refute_line --index 0 --regexp '^Foobar v[0-9]+\.[0-9]+\.[0-9]$'
#   }
#   ```
#
# On failure, in addition to the details of literal matching, the regular expression is also displayed.
# When used with `--index <idx>` the regular expression replaces the unexpected line.
#
#   ```
#   -- regular expression should not match line --
#   index  : 0
#   regexp : ^Foobar v[0-9]+\.[0-9]+\.[0-9]$
#   line   : Foobar v0.1.0
#   --
#   ```
# FIXME(ztombol): Display `${lines[@]}' instead of `$output'!
refute_line() {
  local -i is_match_line=0
  local -i is_mode_partial=0
  local -i is_mode_regexp=0
  : "${lines?}"

  # Handle options.
  while (( $# > 0 )); do
    case "$1" in
    -n|--index)
      if (( $# < 2 )) || ! [[ $2 =~ ^([0-9]|[1-9][0-9]+)$ ]]; then
        echo "\`--index' requires an integer argument: \`$2'" \
        | batslib_decorate 'ERROR: refute_line' \
        | fail
        return $?
      fi
      is_match_line=1
      local -ri idx="$2"
      shift 2
      ;;
    -p|--partial) is_mode_partial=1; shift ;;
    -e|--regexp) is_mode_regexp=1; shift ;;
    --) shift; break ;;
    *) break ;;
    esac
  done

  if (( is_mode_partial )) && (( is_mode_regexp )); then
    echo "\`--partial' and \`--regexp' are mutually exclusive" \
    | batslib_decorate 'ERROR: refute_line' \
    | fail
    return $?
  fi

  # Arguments.
  local -r unexpected="$1"

  if (( is_mode_regexp == 1 )) && [[ '' =~ $unexpected ]] || (( $? == 2 )); then
    echo "Invalid extended regular expression: \`$unexpected'" \
    | batslib_decorate 'ERROR: refute_line' \
    | fail
    return $?
  fi

  # Matching.
  if (( is_match_line )); then
    # Specific line.
    if (( is_mode_regexp )); then
      if [[ ${lines[$idx]} =~ $unexpected ]]; then
        batslib_print_kv_single 6 \
        'index' "$idx" \
        'regexp' "$unexpected" \
        'line'  "${lines[$idx]}" \
        | batslib_decorate 'regular expression should not match line' \
        | fail
      fi
    elif (( is_mode_partial )); then
      if [[ ${lines[$idx]} == *"$unexpected"* ]]; then
        batslib_print_kv_single 9 \
        'index'     "$idx" \
        'substring' "$unexpected" \
        'line'      "${lines[$idx]}" \
        | batslib_decorate 'line should not contain substring' \
        | fail
      fi
    else
      if [[ ${lines[$idx]} == "$unexpected" ]]; then
        batslib_print_kv_single 5 \
        'index' "$idx" \
        'line'  "${lines[$idx]}" \
        | batslib_decorate 'line should differ' \
        | fail
      fi
    fi
  else
    # Line contained in output.
    if (( is_mode_regexp )); then
      local -i idx
      for (( idx = 0; idx < ${#lines[@]}; ++idx )); do
        if [[ ${lines[$idx]} =~ $unexpected ]]; then
          { local -ar single=( 'regexp' "$unexpected" 'index' "$idx" )
            local -a may_be_multi=( 'output' "$output" )
            local -ir width="$( batslib_get_max_single_line_key_width "${single[@]}" "${may_be_multi[@]}" )"
            batslib_print_kv_single "$width" "${single[@]}"
            if batslib_is_single_line "${may_be_multi[1]}"; then
              batslib_print_kv_single "$width" "${may_be_multi[@]}"
            else
              may_be_multi[1]="$( printf '%s' "${may_be_multi[1]}" | batslib_prefix | batslib_mark '>' "$idx" )"
              batslib_print_kv_multi "${may_be_multi[@]}"
            fi
          } \
          | batslib_decorate 'no line should match the regular expression' \
          | fail
          return $?
        fi
      done
    elif (( is_mode_partial )); then
      local -i idx
      for (( idx = 0; idx < ${#lines[@]}; ++idx )); do
        if [[ ${lines[$idx]} == *"$unexpected"* ]]; then
          { local -ar single=( 'substring' "$unexpected" 'index' "$idx" )
            local -a may_be_multi=( 'output' "$output" )
            local -ir width="$( batslib_get_max_single_line_key_width "${single[@]}" "${may_be_multi[@]}" )"
            batslib_print_kv_single "$width" "${single[@]}"
            if batslib_is_single_line "${may_be_multi[1]}"; then
              batslib_print_kv_single "$width" "${may_be_multi[@]}"
            else
              may_be_multi[1]="$( printf '%s' "${may_be_multi[1]}" | batslib_prefix | batslib_mark '>' "$idx" )"
              batslib_print_kv_multi "${may_be_multi[@]}"
            fi
          } \
          | batslib_decorate 'no line should contain substring' \
          | fail
          return $?
        fi
      done
    else
      local -i idx
      for (( idx = 0; idx < ${#lines[@]}; ++idx )); do
        if [[ ${lines[$idx]} == "$unexpected" ]]; then
          { local -ar single=( 'line' "$unexpected" 'index' "$idx" )
            local -a may_be_multi=( 'output' "$output" )
            local -ir width="$( batslib_get_max_single_line_key_width "${single[@]}" "${may_be_multi[@]}" )"
            batslib_print_kv_single "$width" "${single[@]}"
            if batslib_is_single_line "${may_be_multi[1]}"; then
              batslib_print_kv_single "$width" "${may_be_multi[@]}"
            else
              may_be_multi[1]="$( printf '%s' "${may_be_multi[1]}" | batslib_prefix | batslib_mark '>' "$idx" )"
              batslib_print_kv_multi "${may_be_multi[@]}"
            fi
          } \
          | batslib_decorate 'line should not be in output' \
          | fail
          return $?
        fi
      done
    fi
  fi
}
