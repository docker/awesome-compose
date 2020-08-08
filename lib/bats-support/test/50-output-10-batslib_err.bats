#!/usr/bin/env bats

load test_helper

@test 'batslib_err() <message...>: displays <message...>' {
  run batslib_err 'm1' 'm2'
  [ "$status" -eq 0 ]
  [ "$output" == 'm1 m2' ]
}

@test 'batslib_err(): reads <message...> from STDIN' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               echo 'm1' 'm2' | batslib_err"
  [ "$status" -eq 0 ]
  [ "$output" == 'm1 m2' ]
}
