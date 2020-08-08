#!/usr/bin/env bats

load test_helper

@test 'batslib_mark() <mark> <index>: marks the <index>-th line of the input with <mark>' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf ' a\n b\n c\n' | batslib_mark '>' 0"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == '>a' ]
  [ "${lines[1]}" == ' b' ]
  [ "${lines[2]}" == ' c' ]
}

@test 'batslib_mark() <mark> <index...>: marks multiple lines when <index...> is in ascending order' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf ' a\n b\n c\n' | batslib_mark '>' 1 2"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == ' a' ]
  [ "${lines[1]}" == '>b' ]
  [ "${lines[2]}" == '>c' ]
}

@test 'batslib_mark() <mark> <index...>: marks multiple lines when <index...> is in random order' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf ' a\n b\n c\n d\n' | batslib_mark '>' 2 1 3"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 4 ]
  [ "${lines[0]}" == ' a' ]
  [ "${lines[1]}" == '>b' ]
  [ "${lines[2]}" == '>c' ]
  [ "${lines[3]}" == '>d' ]
}

@test 'batslib_mark() <mark> <index...>: ignores duplicate indices' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf ' a\n b\n c\n' | batslib_mark '>' 1 2 1"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == ' a' ]
  [ "${lines[1]}" == '>b' ]
  [ "${lines[2]}" == '>c' ]
}

@test 'batslib_mark() <mark> <index...>: outputs the input untouched if <mark> is the empty string' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf ' a\n b\n c\n' | batslib_mark '' 1"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == ' a' ]
  [ "${lines[1]}" == ' b' ]
  [ "${lines[2]}" == ' c' ]
}

@test 'batslib_mark() <mark> <index>: marks the last line when it is not terminated by a newline' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf ' a\n b\n c' | batslib_mark '>' 2"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == ' a' ]
  [ "${lines[1]}" == ' b' ]
  [ "${lines[2]}" == '>c' ]
}

@test 'batslib_mark() <mark> <index>: does not truncate <mark> if it is longer than the marked line' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf '\n' | batslib_mark '>' 0"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 1 ]
  [ "${lines[0]}" == '>' ]
}
