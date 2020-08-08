#!/usr/bin/env bats

load test_helper

@test 'batslib_count_lines() <string>: displays the number of lines in <string>' {
  run batslib_count_lines $'a\nb\nc\n'
  [ "$status" -eq 0 ]
  [ "$output" == '3' ]
}

@test 'batslib_count_lines() <string>: counts the last line when it is not terminated by a newline' {
  run batslib_count_lines $'a\nb\nc'
  [ "$status" -eq 0 ]
  [ "$output" == '3' ]
}

@test 'batslib_count_lines() <string>: counts empty lines' {
  run batslib_count_lines $'\n\n\n'
  [ "$status" -eq 0 ]
  [ "$output" == '3' ]
}
