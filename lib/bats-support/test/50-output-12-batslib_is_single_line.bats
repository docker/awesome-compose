#!/usr/bin/env bats

load test_helper

@test 'batslib_is_single_line() <string...>: returns 0 if all <string...> are single-line' {
  run batslib_is_single_line 'a' $'b\n' 'c'
  [ "$status" -eq 0 ]
}

@test 'batslib_is_single_line() <string...>: returns 1 if at least one of <string...> is longer than one line' {
  run batslib_is_single_line 'a' $'b\nb' 'c'
  [ "$status" -eq 1 ]
}
