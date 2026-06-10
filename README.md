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

## Supported Frameworks

| Framework | Adapter Doc |
|-----------|-------------|
| Vue3 + Element Plus | `docs/framework-vue-element-plus.md` |
| Vue3 + Antdv Next | `docs/framework-vue-antdv-next.md` |
| React + Ant Design | `docs/framework-react-antd.md` |
| React + Material UI | `docs/framework-react-mui.md` |
| Avalonia UI | `docs/framework-avalonia.md` |

## Getting Started

1. Read [UISchema.md](UISchema.md) for the core specification
2. Browse `examples/` for usage samples
3. Pick your target framework and read the corresponding `docs/framework-*.md`
4. Tell the AI: "Follow the UISchema specification strictly when generating code"

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
