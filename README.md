# UISchema

UISchema is a **framework-agnostic** UI description format based on JSON / indent syntax, designed for describing UI layouts to AI.

Write a UISchema → AI generates target framework code (Vue / React / Avalonia / etc.).


<p align="center"><a href="zh/">中文版</a></p>

## Quick Example

**JSON format:**

```json
{
  "component": "button",
  "props": { "type": "primary", "text": "Save" },
  "events": { "click": "handleSave" }
}
```

**Indent format (equivalent):**

```
button "Save" [type=primary]
    .click handleSave
```

Both formats are equally understood by AI. Output:

```vue
<el-button type="primary" @click="handleSave">Save</el-button>
```

```tsx
<Button type="primary" onClick={handleSave}>Save</Button>
```

```xml
<Button Content="Save" Click="OnSaveClick" />
```

## Patch Example

Modify an existing UI without rewriting the whole description:

```patch
# Insert a button between Confirm and Cancel
patch after space > button[1]
    button "Apply" [size=small]
        .click handleApply

# Remove the Cancel button
patch remove space > button[2]
```

See `examples/` for more patch scenarios.

## Supported Frameworks

| Framework | Adapter Doc |
|-----------|-------------|
| Vue3 + Element Plus | `docs/framework-vue-element-plus.md` |
| Vue3 + Antdv Next | `docs/framework-vue-antdv-next.md` |
| React + Ant Design | `docs/framework-react-antd.md` |
| React + Material UI | `docs/framework-react-mui.md` |
| Avalonia UI | `docs/framework-avalonia.md` |

## MCP Server

UISchema provides an MCP server (`@uischema/mcp`) for AI assistants to read the specification, framework adapters, and examples directly.

```json
{
  "mcpServers": {
    "uischema": {
      "command": "npx",
      "args": ["-y", "@uischema/mcp"]
    }
  }
}
```

| Tool | Description |
|------|-------------|
| `read_uischema_spec` | Read the UISchema core specification — node structure, indent syntax, patch syntax, AI rules, layout models |
| `list_frameworks` | List all supported frameworks (Vue/Element Plus, Vue/Antdv Next, React/Ant Design, React/MUI, Avalonia) |
| `read_framework_adapter` | Read adapter docs for a specific framework — component mappings, prop/event/binding translations, code examples |
| `read_example` | Read example files in JSON or indent format (login, search-form, crud-table, dialog, patch-login) |

## Getting Started

1. Read [UISchema.md](UISchema.md) for the core specification
2. Browse `examples/` for usage samples
3. Pick your target framework and read the corresponding `docs/framework-*.md`
4. Configure the MCP server (see above) and ask the AI: "Follow the UISchema specification strictly when generating code"

## Project Structure

```
├── UISchema.md                    # Core specification (English)
├── zh/                            # Chinese version
├── docs/
│   ├── framework-vue-element-plus.md
│   ├── framework-vue-antdv-next.md
│   ├── framework-react-antd.md
│   ├── framework-react-mui.md
│   └── framework-avalonia.md
├── examples/
│   ├── json/                      # JSON format examples
│   └── indent/                    # Indent format examples
├── schemas/
│   └── uischema.schema.json       # JSON Schema
├── mcp-server/                    # Local MCP server (node)
│   ├── index.js
│   └── package.json
├── USAGE.md                       # Integration guide
├── LICENSE
└── CHANGELOG.md
```
