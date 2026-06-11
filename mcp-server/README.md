# @uischema/mcp

MCP server for [**UISchema**](https://github.com/yyangdid/UISchema) — a framework-agnostic UI description format for AI code generation.

## What is UISchema?

UISchema lets you describe UI layouts using JSON or a lightweight indent syntax, then AI generates working code for your target framework.

**Indent format:**
```
page [flex, padding=10]
    checkbox "Remember me" [size=small]
        .layout top-left
    space [size=middle]
        .layout bottom-right
        button "Confirm" [size=small]
            .click handleConfirm
        button "Cancel" [size=small, type=primary]
            .click handleCancel
```

**Equivalent in JSON:**
```json
{
  "component": "page",
  "style": { "display": "flex", "padding": "10px" },
  "children": [
    { "component": "checkbox", "props": { "text": "Remember me", "size": "small" },
      "layout": { "justify-self": "flex-start", "align-self": "flex-start" } },
    { "component": "space", "props": { "size": "middle" },
      "layout": { "justify-self": "flex-end", "align-self": "flex-end" },
      "children": [
        { "component": "button", "props": { "text": "Confirm", "size": "small" },
          "events": { "click": "handleConfirm" } },
        { "component": "button", "props": { "text": "Cancel", "size": "small", "type": "primary" },
          "events": { "click": "handleCancel" } }
      ] }
  ]
}
```

Both formats are equivalent and equally understood by AI.

### Patch Example

Modify an existing UI without rewriting the whole description:

```patch
# Insert before an element
patch before space
    input [placeholder=Search...]

# Prepend at the beginning of a container
patch prepend space
    button "Reset" [size=small]

# Insert after a specific element
patch after space > button[1]
    button "Apply" [size=small]
        .click handleApply

# Append at the end of a container
patch append card
    button "Submit" [type=primary]

# Replace an element
patch replace card
    card "New Title" [width=400]

# Remove an element
patch remove space > button[2]
```

## Supported Frameworks

- Vue3 + Element Plus
- Vue3 + Antdv Next
- React + Ant Design
- React + Material UI
- Avalonia UI

## MCP Tools

This server provides 4 tools for AI assistants:

| Tool | Description |
|------|-------------|
| `read_uischema_spec` | Read the UISchema core specification (node structure, indent syntax, patch syntax, AI rules, etc.) |
| `list_frameworks` | List all supported frameworks |
| `read_framework_adapter` | Read a specific framework's adapter doc (component mappings, event/binding translations, examples) |
| `read_example` | Read an example file (json or indent format) |

## Usage

Add to your MCP client configuration:

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
