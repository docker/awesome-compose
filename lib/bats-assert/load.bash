# bats-assert - Common assertions for Bats
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
# Assertions are functions that perform a test and output relevant
# information on failure to help debugging. They return 1 on failure
# and 0 otherwise.
#
# All output is formatted for readability using the functions of
# `output.bash' and sent to the standard error.

# shellcheck disable=1090
source "$(dirname "${BASH_SOURCE[0]}")/src/assert.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/refute.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/assert_equal.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/assert_success.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/assert_failure.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/assert_output.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/refute_output.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/assert_line.bash"
source "$(dirname "${BASH_SOURCE[0]}")/src/refute_line.bash"
