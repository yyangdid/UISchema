# @uischema/mcp

MCP server for [UISchema](https://github.com/your-repo/uischema) — a framework-agnostic UI description format for AI code generation.

## Tools

| Tool | Description |
|------|-------------|
| `read_uischema_spec` | Read the UISchema core specification |
| `list_frameworks` | List all supported frameworks |
| `read_framework_adapter` | Read a specific framework's adapter doc |
| `read_example` | Read an example file |

## Usage

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
