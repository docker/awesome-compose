#
# bats-util - Various auxiliary functions for Bats
#
# Written in 2016 by Zoltan Tombol <zoltan dot tombol at gmail dot com>
#
# To the extent possible under law, the author(s) have dedicated all
# copyright and related and neighboring rights to this software to the
# public domain worldwide. This software is distributed without any
# warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication
# along with this software. If not, see
# <http://creativecommons.org/publicdomain/zero/1.0/>.
#

#
# lang.bash
# ---------
#
# Bash language and execution related functions. Used by public helper
# functions.
#

# Check whether the calling function was called from a given function.
#
# By default, direct invocation is checked. The function succeeds if the
# calling function was called directly from the given function. In other
# words, if the given function is the next element on the call stack.
#
# When `--indirect' is specified, indirect invocation is checked. The
# function succeeds if the calling function was called from the given
# function with any number of intermediate calls. In other words, if the
# given function can be found somewhere on the call stack.
#
# Direct invocation is a form of indirect invocation with zero
# intermediate calls.
#
# Globals:
#   FUNCNAME
# Options:
#   -i, --indirect - check indirect invocation
# Arguments:
#   $1 - calling function's name
# Returns:
#   0 - current function was called from the given function
#   1 - otherwise
batslib_is_caller() {
  local -i is_mode_direct=1

  # Handle options.
  while (( $# > 0 )); do
    case "$1" in
      -i|--indirect) is_mode_direct=0; shift ;;
      --) shift; break ;;
      *) break ;;
    esac
  done

  # Arguments.
  local -r func="$1"

  # Check call stack.
  if (( is_mode_direct )); then
    [[ $func == "${FUNCNAME[2]}" ]] && return 0
  else
    local -i depth
    for (( depth=2; depth<${#FUNCNAME[@]}; ++depth )); do
      [[ $func == "${FUNCNAME[$depth]}" ]] && return 0
    done
  fi

  return 1
}
