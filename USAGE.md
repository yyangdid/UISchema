# UISchema MCP Server

UISchema provides a local MCP server that AI assistants can use to read the UISchema specification, framework adapter docs, and examples.

## Usage

Add to your MCP client configuration (Claude Desktop, Cursor, etc.):

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

## Available Tools

| Tool | Description |
|------|-------------|
| `read_uischema_spec` | Read the UISchema core specification (node structure, indent syntax, patch syntax, AI rules, etc.) |
| `list_frameworks` | List all supported frameworks |
| `read_framework_adapter` | Read a specific framework's adapter doc (component mappings, event/binding translations, examples) |
| `read_example` | Read an example file (json or indent format) |
