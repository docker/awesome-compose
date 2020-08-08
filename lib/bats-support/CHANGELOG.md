# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [0.3.0] - 2016-11-29

### Added

- Restricting invocation to specific locations with
  `batslib_is_caller()`


## [0.2.0] - 2016-03-22

### Added

- `npm` support
- Reporting arbitrary failures with `fail()` (moved from `bats-assert`)

### Changed

- Library renamed to `bats-support`


## 0.1.0 - 2016-02-16

### Added

- Two-column key-value formatting with `batslib_print_kv_single()`
- Multi-line key-value formatting with `batslib_print_kv_multi()`
- Mixed formatting with `batslib_print_kv_single_or_multi()`
- Header and footer decoration with `batslib_decorate()`
- Prefixing lines with `batslib_prefix()`
- Marking lines with `batslib_mark()`
- Common output function `batslib_err()`
- Line counting with `batslib_count_lines()`
- Checking whether a text is one line long with
  `batslib_is_single_line()`
- Determining key width for two-column and mixed formatting with
  `batslib_get_max_single_line_key_width()`


[0.3.0]: https://github.com/ztombol/bats-support/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/ztombol/bats-support/compare/v0.1.0...v0.2.0
