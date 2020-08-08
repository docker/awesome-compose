#!/usr/bin/env bats

load test_helper

@test 'batslib_print_kv_single() <width> <pair...>: displays <pair...> in two-column format with <width> wide key column' {
  local -ar pairs=( 'k _1'  'v 1'
                    'k 2 '  'v 2'
                    'k __3' 'v 3' )
  run batslib_print_kv_single 5 "${pairs[@]}"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" == '3' ]
  [ "${lines[0]}" == 'k _1  : v 1' ]
  [ "${lines[1]}" == 'k 2   : v 2' ]
  [ "${lines[2]}" == 'k __3 : v 3' ]
}

@test 'batslib_print_kv_single() <width> <pair...>: does not truncate keys when the column is too narrow' {
  local -ar pairs=( 'k _1'  'v 1'
                    'k 2'   'v 2'
                    'k __3' 'v 3' )
  run batslib_print_kv_single 0 "${pairs[@]}"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" == '3' ]
  [ "${lines[0]}" == 'k _1 : v 1' ]
  [ "${lines[1]}" == 'k 2 : v 2' ]
  [ "${lines[2]}" == 'k __3 : v 3' ]
}
