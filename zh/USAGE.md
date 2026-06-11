# UISchema MCP Server

UISchema 提供了一个本地 MCP 服务器，AI 助手可以通过它读取 UISchema 规范、框架适配文档和示例。

## 使用方式

在 MCP 客户端（Claude Desktop、Cursor 等）的配置文件中添加：

```json
{
  "mcpServers": {
    "uischema": {
      "command": "npx",
      "args": ["-y", "@uischema/mcp@latest"]
    }
  }
}
```

## 可用工具

| 工具 | 说明 |
|------|------|
| `read_uischema_spec` | 读取 UISchema 核心规范（节点结构、缩进语法、patch 语法、AI 规则等） |
| `list_frameworks` | 列出所有支持的框架 |
| `read_framework_adapter` | 读取指定框架的适配文档（组件映射、事件/绑定翻译、示例） |
| `read_example` | 读取示例文件（json 或 indent 格式） |
