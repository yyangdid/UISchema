# UISchema

UISchema 是一种基于 JSON / 缩进语法的**框架无关界面描述格式**，专为向 AI 描述 UI 布局而设计。

写一份 UISchema → AI 自动生成 Vue / React / Avalonia 等目标框架代码。

## 快速示例

**JSON 格式：**

```json
{
  "component": "button",
  "props": { "type": "primary", "text": "保存" },
  "events": { "click": "handleSave" }
}
```

**缩进格式（等价）：**

```
button "保存" [type=primary]
    .click handleSave
```

两种写法 AI 同等理解，输出：

```vue
<el-button type="primary" @click="handleSave">保存</el-button>
```

```tsx
<Button type="primary" onClick={handleSave}>保存</Button>
```

```xml
<Button Content="保存" Click="OnSaveClick" />
```

## Patch 示例

无需重写整个页面，即可修改已有 UI：

```patch
# 在确定和取消之间插入应用按钮
patch after space > button[1]
    button "应用" [size=small]
        .click handleApply

# 删除取消按钮
patch remove space > button[2]
```

更多 patch 场景见 `examples/` 目录。

## 支持的框架

| 框架 | 适配文档 |
|------|---------|
| Vue3 + Element Plus | `docs/framework-vue-element-plus.md` |
| Vue3 + Antdv Next | `docs/framework-vue-antdv-next.md` |
| React + Ant Design | `docs/framework-react-antd.md` |
| React + Material UI | `docs/framework-react-mui.md` |
| Avalonia UI | `docs/framework-avalonia.md` |

## MCP 服务器

UISchema 提供了 MCP 服务器（`@uischema/mcp`），AI 助手可以直接读取规范、框架适配文档和示例。

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

| 工具 | 说明 |
|------|------|
| `read_uischema_spec` | 读取 UISchema 核心规范 — 节点结构、缩进语法、patch 语法、AI 规则、布局模型 |
| `list_frameworks` | 列出所有支持的框架（Vue/Element Plus、Vue/Antdv Next、React/Ant Design、React/MUI、Avalonia） |
| `read_framework_adapter` | 读取指定框架的适配文档 — 组件映射、属性/事件/绑定翻译、代码示例 |
| `read_example` | 读取示例文件（JSON 或缩进格式），含 login、search-form、crud-table、dialog、patch-login |

## 快速开始

1. 阅读 [UISchema.md](UISchema.md) 了解核心规范
2. 查看 `examples/` 下的示例
3. 选定目标框架，参考对应的 `docs/framework-*.md`
4. 配置 MCP 服务器（见上方）后在提示词中告诉 AI：「请严格遵循 UISchema 规范生成代码」

## 项目结构

```
├── UISchema.md                    # 核心规范
├── docs/
│   ├── framework-vue-element-plus.md
│   ├── framework-vue-antdv-next.md
│   ├── framework-react-antd.md
│   ├── framework-react-mui.md
│   └── framework-avalonia.md
├── examples/
│   ├── json/                      # JSON 格式示例
│   └── indent/                    # 缩进格式示例
├── schemas/
│   └── uischema.schema.json       # JSON Schema
└── CHANGELOG.md
```
