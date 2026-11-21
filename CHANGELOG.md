# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `buildPath(pattern, { params, search })`: builds a path with params inferred from the path pattern.
- `removeDuplicates(items, { by })`: removes duplicates by a typed key or a selector and keeps the first occurrence.

### Changed

- **Breaking:** the package is ESM only (`"type": "module"`). On Node 24+, `require('mxs')` still works.
- **Breaking:** requires Node 24 or newer.

### Removed

- **Breaking:** `applyTo`, `compose`, `curry`, `pipe`, `isEmpty` and `uniq`, deprecated in 0.11.0.
- The UMD browser build.

## [0.11.0] - 2026-11-21

### Deprecated

- `applyTo`: call the function directly. Removed in 1.0.
- `compose`: use plain function calls. Removed in 1.0.
- `curry`: use plain function calls or arrow functions. Removed in 1.0.
- `pipe`: use plain function calls. Removed in 1.0.
- `isEmpty`: use a type-specific check (`length`, `size` or `Object.keys`). Removed in 1.0.
- `uniq`: use `removeDuplicates`. Removed in 1.0.

### Fixed

- Publishing now builds `dist` before packing, not after.

Earlier versions: see the [git history](https://github.com/helderberto/maximus/commits/v0.10.1).

[Unreleased]: https://github.com/helderberto/maximus/compare/v0.11.0...HEAD
[0.11.0]: https://github.com/helderberto/maximus/compare/v0.10.1...v0.11.0
