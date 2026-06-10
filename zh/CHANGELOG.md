# Changelog

## v1.0.0 (2026-06-10)

首次公开发布。

### 核心

- 标准节点结构：component / meta / props / events / bindings / style / layout / children
- 两种格式：JSON 和缩进语法（4空格缩进 + 点前缀命令）
- Patch 增量修改语法（before / after / prepend / append / replace / remove）
- 框架无关设计，适配层负责框架特定映射

### 支持的框架

- Vue3 + Element Plus
- Vue3 + Antdv Next
- React + Ant Design
- React + Material UI
- Avalonia UI

### 特性

- 事件系统，通用事件名 + 冒号修饰符语法
- 数据绑定（bindings），框架无关的键值对
- Web 框架 Flex 布局模型
- XAML 布局模型（StackPanel / Grid）
- 布局快捷位置（top-left, center, bottom-right 等）
- `[flex]` 缩写为 `display: flex`
- 样式属性使用 CSS kebab-case 命名
- 多行 `.meta` 描述，支持 `.tags` 和 `.remark` 子命令
- AI 代码生成规则，含冲突优先级

### 工具

- MCP 服务器（`@uischema/mcp`），4 个工具：读规范、列框架、读适配文档、读示例
- JSON Schema，用于校验和 IDE 自动补全
- CLAUDE.md，用于 Claude Code 集成
- Reasonix skill，用于 Reasonix 集成

### 文档

- 英文版和中文版（zh/）
- 5 个框架适配文档，含组件映射和示例
- 4 个示例场景：登录、搜索表单、CRUD 表格、弹窗
- Patch 修改示例（缩进格式和 JSON 格式）
- 项目 README，含快速开始指南
