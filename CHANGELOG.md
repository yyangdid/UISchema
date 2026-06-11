# Changelog

## v1.0.3 (2026-06-10)

### Changed

- Fixed event colon syntax examples (`.change:size` not `.size-change:size`)
- Improved MCP server tools description with detailed table in README

---

## v1.0.2 (2026-06-10)

### Changed

- Added GitHub repo URL link to mcp-server/README.md

---

## v1.0.1 (2026-06-10)

### Changed

- Updated mcp-server/README.md with UISchema overview and examples

---

## v1.0.0 (2026-06-10)

Initial public release.

### Core

- Standard node structure: component / meta / props / events / bindings / style / layout / children
- Two formats: JSON and indent syntax (4-space indentation + dot-prefix commands)
- Patch incremental modification syntax (before / after / prepend / append / replace / remove)
- Framework-agnostic design with adapter layer for framework-specific mappings

### Supported Frameworks

- Vue3 + Element Plus
- Vue3 + Antdv Next
- React + Ant Design
- React + Material UI
- Avalonia UI

### Features

- Event system with generic event names and colon-modifier syntax
- Data binding (bindings) with framework-agnostic key-value pairs
- Flex layout model for Web frameworks
- XAML layout model (StackPanel / Grid) for Avalonia
- Layout shortcut positions (top-left, center, bottom-right, etc.)
- `[flex]` shorthand for `display: flex`
- Style properties with CSS kebab-case naming
- Multi-line `.meta` descriptions with `.tags` and `.remark` sub-commands
- AI code generation rules with conflict priority

### Tools

- MCP server (`@uischema/mcp`) with 4 tools: read spec, list frameworks, read adapters, read examples
- JSON Schema for validation and IDE autocompletion
- CLAUDE.md for Claude Code integration
- Reasonix skill for Reasonix integration

### Documentation

- English and Chinese (zh/) versions
- 5 framework adapter docs with component mappings and examples
- 4 example scenarios: login, search-form, crud-table, dialog
- Patch modification examples in both indent and JSON formats
- Project README with quick start guide
