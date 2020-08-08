#!/usr/bin/env bats

load test_helper

@test 'batslib_print_kv_multi() <pair...>: displays <pair...> in multi-line format' {
  local -ar pairs=( 'k _1'  'v 1'
                    'k 2'   $'v 2-1\nv 2-2'
                    'k __3' 'v 3' )
  run batslib_print_kv_multi "${pairs[@]}"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" == '7' ]
  [ "${lines[0]}" == 'k _1 (1 lines):' ]
  [ "${lines[1]}" == 'v 1' ]
  [ "${lines[2]}" == 'k 2 (2 lines):' ]
  [ "${lines[3]}" == 'v 2-1' ]
  [ "${lines[4]}" == 'v 2-2' ]
  [ "${lines[5]}" == 'k __3 (1 lines):' ]
  [ "${lines[6]}" == 'v 3' ]
}
