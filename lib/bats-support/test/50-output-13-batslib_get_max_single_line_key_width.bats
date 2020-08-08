#!/usr/bin/env bats

load test_helper

@test 'batslib_get_max_single_line_key_width() <pair...>: displays the length of the longest key' {
  local -ar pairs=( 'k _1'  'v 1'
                    'k 2'   'v 2'
                    'k __3' 'v 3' )
  run batslib_get_max_single_line_key_width "${pairs[@]}"
  [ "$status" -eq 0 ]
  [ "$output" == '5' ]
}

@test 'batslib_get_max_single_line_key_width() <pair...>: only considers keys with single-line values' {
  local -ar pairs=( 'k _1'  'v 1'
                    'k 2'   'v 2'
                    'k __3' $'v\n3' )
  run batslib_get_max_single_line_key_width "${pairs[@]}"
  [ "$status" -eq 0 ]
  [ "$output" == '4' ]
}
