#!/usr/bin/env bats

load 'test_helper'


# Test functions
test_func_lvl_2() {
  test_func_lvl_1 "$@"
}

test_func_lvl_1() {
  test_func_lvl_0 "$@"
}

test_func_lvl_0() {
  batslib_is_caller "$@"
}


#
# Direct invocation
#

# Interface
@test 'batslib_is_caller() <function>: returns 0 if the current function was called directly from <function>' {
  run test_func_lvl_1 test_func_lvl_1
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 0 ]
}

@test 'batslib_is_caller() <function>: returns 1 if the current function was not called directly from <function>' {
  run test_func_lvl_0 test_func_lvl_1
  [ "$status" -eq 1 ]
  [ "${#lines[@]}" -eq 0 ]
}

# Correctness
@test 'batslib_is_caller() <function>: the current function does not appear on the call stack' {
  run test_func_lvl_0 test_func_lvl_0
  [ "$status" -eq 1 ]
  [ "${#lines[@]}" -eq 0 ]
}


#
# Indirect invocation
#

# Options
test_i_indirect() {
  run test_func_lvl_2 "$@"
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 0 ]
}

@test 'batslib_is_caller() -i <function>: enables indirect checking' {
  test_i_indirect -i test_func_lvl_2
}

@test 'batslib_is_caller() --indirect <function>: enables indirect checking' {
  test_i_indirect --indirect test_func_lvl_2
}

# Interface
@test 'batslib_is_caller() --indirect <function>: returns 0 if the current function was called indirectly from <function>' {
  run test_func_lvl_2 --indirect test_func_lvl_2
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 0 ]
}

@test 'batslib_is_caller() --indirect <function>: returns 1 if the current function was not called indirectly from <function>' {
  run test_func_lvl_1 --indirect test_func_lvl_2
  [ "$status" -eq 1 ]
  [ "${#lines[@]}" -eq 0 ]
}

# Correctness
@test 'batslib_is_caller() --indirect <function>: direct invocation is a special case of indirect invocation with zero intermediate calls' {
  run test_func_lvl_1 --indirect test_func_lvl_1
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -eq 0 ]
}

@test 'batslib_is_caller() --indirect <function>: the current function does not appear on the call stack' {
  run test_func_lvl_0 --indirect test_func_lvl_0
  [ "$status" -eq 1 ]
  [ "${#lines[@]}" -eq 0 ]
}
