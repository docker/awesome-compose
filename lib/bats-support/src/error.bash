#
# bats-support - Supporting library for Bats test helpers
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
# error.bash
# ----------
#
# Functions implementing error reporting. Used by public helper
# functions or test suits directly.
#

# Fail and display a message. When no parameters are specified, the
# message is read from the standard input. Other functions use this to
# report failure.
#
# Globals:
#   none
# Arguments:
#   $@ - [=STDIN] message
# Returns:
#   1 - always
# Inputs:
#   STDIN - [=$@] message
# Outputs:
#   STDERR - message
fail() {
  (( $# == 0 )) && batslib_err || batslib_err "$@"
  return 1
}
