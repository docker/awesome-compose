#!/usr/bin/env bats

load test_helper

@test 'fail() <message>: returns 1 and displays <message>' {
  run fail 'message'
  [ "$status" -eq 1 ]
  [ "$output" == 'message' ]
}

@test 'fail(): reads <message> from STDIN' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               echo 'message' | fail"
  [ "$status" -eq 1 ]
  [ "$output" == 'message' ]
}
