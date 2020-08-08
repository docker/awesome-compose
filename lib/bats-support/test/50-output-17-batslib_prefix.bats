#!/usr/bin/env bats

load test_helper

@test 'batslib_prefix() <prefix>: prefixes each line of the input with <prefix>' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf 'a\nb\nc\n' | batslib_prefix '_'"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == '_a' ]
  [ "${lines[1]}" == '_b' ]
  [ "${lines[2]}" == '_c' ]
}

@test 'batslib_prefix() <prefix>: prefixes the last line when it is not terminated by a newline' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf 'a\nb\nc' | batslib_prefix '_'"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == '_a' ]
  [ "${lines[1]}" == '_b' ]
  [ "${lines[2]}" == '_c' ]
}

@test 'batslib_prefix() <prefix>: prefixes empty lines' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf '\n\n\n' | batslib_prefix '_'"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == '_' ]
  [ "${lines[1]}" == '_' ]
  [ "${lines[2]}" == '_' ]
}

@test 'batslib_prefix(): <prefix> default to two spaces' {
  run bash -c "source '${TEST_MAIN_DIR}/load.bash'
               printf 'a\nb\nc\n' | batslib_prefix"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 3 ]
  [ "${lines[0]}" == '  a' ]
  [ "${lines[1]}" == '  b' ]
  [ "${lines[2]}" == '  c' ]
}
