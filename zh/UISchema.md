# UI Schema 规范

## 版本

v1.0.4

## 概述

UI Schema 是一种基于 **JSON** 的、**框架无关**的界面描述格式，用于向 AI 提供结构化的页面定义。

AI 应根据 UI Schema 自动生成目标框架代码。

UI Schema 的设计目标：

1. 使用标准 JSON 格式
2. 结构清晰，便于 AI 理解
3. 尽可能贴近前端开发概念
4. 支持组件树结构
5. 支持布局、样式和属性的分离
6. 支持业务描述和设计约束
7. 支持跨组件库映射
8. 易于扩展

---

# 标准节点结构

```json
{
  "component": "",
  "meta": {},
  "props": {},
  "events": {},
  "bindings": {},
  "style": {},
  "layout": {},
  "children": []
}
```

| 字段      | 必填 | 说明 |
|----------|------|------|
| component | 是   | 组件标识符，由框架适配层映射为具体组件 |
| meta     | 否   | AI 备注、设计意图、业务约束（不参与渲染） |
| props    | 否   | 组件属性，由框架适配层映射 |
| events   | 否   | 组件事件绑定 |
| bindings | 否   | 数据绑定（详见 bindings 章节） |
| style    | 否   | 视觉外观属性（语法由框架适配层定义） |
| layout   | 否   | 在父容器中的定位规则（语法由框架适配层定义） |
| children | 否   | 子组件列表 |

---

# UISchema 缩进语法（可选）

除 JSON 外，UI Schema 还支持 **缩进语法**，便于手动编写。AI 应同等理解两种格式。

## 语法参考

| 语法 | 含义 | 示例 |
|------|------|------|
| `ComponentName` | component | `button` |
| `"text"` | props.text | `"Save"` |
| `[key=val, …]` | props（行内） | `[type=primary, size=small]` |
| `.layout <position>` | 布局简写 | `.layout bottom-right` |
| `.layout k=v, …` | 精确布局 | `.layout justify-self=flex-end` |
| `.style k=v, …` | 样式属性 | `.style color=#f00, width=200` |
| `.click <function>` | 事件 | `.click handleSave` |
| `.eventName <function>` | 事件 | `.change onInput` |
| `.eventName:subEvent <function>` | 带修饰符的事件 | `.change:size handleSizeChange` |
| `.bind <key>=<path>` | 数据绑定 | `.bind value=formData.name` |
| `.meta <description>` | 描述（支持多行） | `.meta This is the submit button` |
| `.tags <word, …>` | meta.tags | `.tags form, checkbox` |
| `.remark <text>` | meta.remarks | `.remark Keep aligned` |
| 缩进 | children 层级 | 4 空格缩进 = 子元素 |

## 示例对比

```
page "Full-screen page" [flex, padding=10]
    .meta Checkbox in top-left, button group in bottom-right
    checkbox "Checkbox" [size=small]
        .style color=#f00
        .layout top-left
    space [size=middle]
        .layout bottom-right
        button "Confirm" [size=small]
            .click handleConfirm
        button "Cancel" [size=small, type=primary]
            .click handleCancel
        button "Apply" [size=small]
            .click handleApply
```

等价于以下 JSON：

```json
{
  "component": "page",
  "meta": { "description": "Checkbox in top-left, button group in bottom-right" },
  "props": { "flex": true, "padding": "10px" },
  "children": [
    {
      "component": "checkbox",
      "props": { "text": "Checkbox", "size": "small" },
      "style": { "color": "#f00" },
      "layout": { "justify-self": "flex-start", "align-self": "flex-start" }
    },
    {
      "component": "space",
      "props": { "size": "middle" },
      "layout": { "justify-self": "flex-end", "align-self": "flex-end" },
      "children": [
        { "component": "button", "props": { "text": "Confirm", "size": "small" }, "events": { "click": "handleConfirm" } },
        { "component": "button", "props": { "text": "Cancel", "size": "small", "type": "primary" }, "events": { "click": "handleCancel" } },
        { "component": "button", "props": { "text": "Apply", "size": "small" }, "events": { "click": "handleApply" } }
      ]
    }
  ]
}
```

## 详细规则

### 组件名称

每行的第一个单词是 `component`：

```
button                      → component: "button"
input                       → component: "input"
table                       → component: "table"
form                        → component: "form"
```

### 文本

双引号包裹的内容设置 `props.text`：

```
button "Save"               → props: { "text": "Save" }
checkbox "Agree to terms"   → props: { "text": "Agree to terms" }
```

### 行内属性

`[key=val, …]` 语法：

```
button "Submit" [type=primary, size=small]
                            → props: { "text": "Submit", "type": "primary", "size": "small" }
input [placeholder=Please enter]
                            → props: { "placeholder": "Please enter" }
```

布尔值使用裸单词：

```
table [border, stripe]      → props: { "border": true, "stripe": true }
```

#### `[flex]` 特殊简写

`[flex]` 是 `display: flex` 的简写，相当于在 style 中设置 flex：

```
page [flex, padding=10]
    → style: { "display": "flex", "padding": "10" }
```

常用简写：

| 简写 | 等价于 |
|------|--------|
| `[flex]` | `style.display = "flex"` |
| `[flex, direction=row]` | `style.display = "flex"` + `style.flexDirection = "row"` |

### 布局简写位置

`.layout <position>` 映射为 justify-self + align-self：

| 简写 | justify-self | align-self |
|------|-------------|------------|
| top-left | flex-start | flex-start |
| top-center | center | flex-start |
| top-right | flex-end | flex-start |
| center-left | flex-start | center |
| center | center | center |
| center-right | flex-end | center |
| bottom-left | flex-start | flex-end |
| bottom-center | center | flex-end |
| bottom-right | flex-end | flex-end |
| stretch | stretch | stretch |

### 精确布局

`.layout k=v, k=v`：

```
.layout justify-self=flex-end, align-self=flex-end
                            → layout: { "justify-self": "flex-end", "align-self": "flex-end" }
.layout grid-row=1, grid-column=2
                            → layout: { "grid-row": "1", "grid-column": "2" }
```

### 样式

`.style k=v, k=v`：

```
.style color=#f00, width=200
                            → style: { "color": "#f00", "width": "200" }
```

样式属性名称使用 **原生 CSS 属性名**（kebab-case）。AI 根据目标框架适配层的规则转换为对应格式：

| 缩进语法 | JSON style | Web 框架输出 | XAML 输出 |
|---------|------------|-------------|-----------|
| `.style color=#f00` | `"color": "#f00"` | `color: #f00` | `Foreground="#f00"` |
| `.style font-size=14` | `"font-size": "14"` | `font-size: 14px` | `FontSize="14"` |
| `.style margin=10` | `"margin": "10"` | `margin: 10px` | `Margin="10"` |

### 事件

`.eventName functionName`：

```
.click handleSave           → events: { "click": "handleSave" }
.change onInput             → events: { "change": "onInput" }
```

支持 **子事件修饰符**，用冒号分隔，适用于组件有多个同类事件的情况：

```
.change:size handleSizeChange
                            → events: { "change-size": "handleSizeChange" }
                            → 框架适配层映射为 size-change

.change:current handleCurrentChange
                            → events: { "change-current": "handleCurrentChange" }
                            → 框架适配层映射为 current-change
```

### 数据绑定

`.bind key=path`：

```
.bind value=formData.name   → bindings: { "value": "formData.name" }
.bind checked=agreed        → bindings: { "checked": "agreed" }
```

### 描述

`.meta <text>` 映射为多个 `meta` 字段，支持多行：

```
.meta This is a checkbox for user agreement confirmation.
    Located in the first row of the form, unchecked by default.
    .tags form, checkbox, agreement
    .remark Keep aligned to bottom-right
    .remark Button order must not be adjusted
```

规则：

| 前缀 | 映射 | 说明 |
|------|------|------|
| `.meta` 首行 + 后续缩进行（无新前缀） | meta.description | 多行自动拼接 |
| `.tags <word, word, …>` | meta.tags | 逗号分隔 |
| `.remark <text>` | meta.remarks[] | 可多次出现，每行一条 |

```
.meta User agreement confirmation checkbox
    .tags form, checkbox
    .remark Keep aligned to bottom-right
```

→
```json
{
  "meta": {
    "description": "User agreement confirmation checkbox",
    "tags": ["form", "checkbox"],
    "remarks": ["Keep aligned to bottom-right"]
  }
}
```

### 子组件

缩进表示子组件层级关系。一级缩进 = 当前组件的子元素：

```
space [size=middle]
    button "Confirm"         → space.children[0] = { button... }
    button "Cancel"          → space.children[1] = { button... }
```

多级嵌套：

```
page
    card "User Info"
        form
            form-item "Username"
                input [placeholder=Please enter]
```

## 综合示例

```
# User Management Page
page [flex, padding=20]
    .meta User management page, with search and table

    card "Search Criteria"
        form
            row [gutter=20]
                col [span=8]
                    form-item "Username"
                        input [placeholder=Please enter username]
                            .bind value=searchForm.username
                col [span=8]
                    form-item "Status"
                        select [placeholder=Please select]
                            .bind value=searchForm.status
                col [span=8]
                    button "Search" [type=primary]
                        .click handleSearch
                    button "Reset"
                        .click handleReset

    card "User List"
        table [border, stripe]
            .bind data=userList
            column [label=Username, prop=username]
            column [label=Nickname, prop=nickname]
            column [label=Email, prop=email]
            column [label=Actions, fixed=right]
                button "Edit" [size=small, type=primary]
                    .click handleEdit
                button "Delete" [size=small, type=danger]
                    .click handleDelete
```

---

# component

表示组件类型，例如：

```json
{ "component": "page" }
```

```json
{ "component": "button" }
```

```json
{ "component": "checkbox" }
```

```json
{ "component": "input" }
```

```json
{ "component": "table" }
```

---

# meta

meta 用于存储语义描述、设计意图和约束信息。

meta 不参与页面渲染。

推荐结构：

```json
{
  "meta": {
    "description": "",
    "tags": [],
    "remarks": []
  }
}
```

## description

组件描述。

```json
{
  "meta": {
    "description": "User agreement confirmation checkbox"
  }
}
```

## tags

组件标签。

```json
{
  "meta": {
    "tags": ["form", "checkbox", "agreement"]
  }
}
```

## remarks

附加说明。

```json
{
  "meta": {
    "remarks": [
      "Keep aligned to bottom-right",
      "Button order must not be adjusted"
    ]
  }
}
```

允许扩展字段：

```json
{
  "meta": {
    "figmaId": "node_123",
    "designer": "Tom"
  }
}
```

---

# props

组件属性。

```json
{
  "component": "button",
  "props": {
    "type": "primary",
    "size": "small"
  }
}
```

文本统一指定为：

```json
{
  "props": {
    "text": "Save"
  }
}
```

映射规则：`props.text` 应映射到目标组件的 **默认插槽**。

```vue
<el-button>Save</el-button>
<el-checkbox>Agree to terms</el-checkbox>
```

如果组件不支持默认插槽文本（例如 `<el-input />`），AI 应忽略 `text` 属性。

---

# events

组件事件绑定。

```json
{
  "component": "button",
  "events": {
    "click": "handleSubmit"
  }
}
```

events 使用 **通用事件名称**，由框架适配层映射为各框架的语法：

| 通用事件名 | 含义 |
|-----------|------|
| click | 点击 |
| change | 值变化 |
| input | 输入 |
| blur | 失去焦点 |
| focus | 获取焦点 |
| submit | 表单提交 |
| open | 打开 |
| close | 关闭 |

事件函数名由 AI 生成。AI 应在生成的源代码中声明对应的函数。

---

# bindings

数据绑定。

```json
{
  "component": "input",
  "props": {
    "placeholder": "Please enter username"
  },
  "bindings": {
    "value": "formData.username"
  }
}
```

bindings 是一个对象，键为绑定目标，值为数据路径。

框架适配层将绑定转换为对应的数据绑定语法：

| 框架 | 输出示例 |
|------|---------|
| Vue | v-model="formData.username" |
| React | value={formData.username} onChange={...} |
| Avalonia | Text="{Binding username}" |

AI 应在生成的源代码中声明对应的数据变量。

---

# style

视觉外观属性。

```json
{
  "style": {
    "width": "200px",
    "color": "#f00"
  }
}
```

style 的语法由目标框架的适配层定义：
- **Web 框架**（Vue / React / HTML）：使用 CSS 属性
- **XAML 框架**（Avalonia）：使用依赖属性名称

---

# layout

组件在其父容器中的定位规则。

```json
{
  "layout": {
    "justify-self": "flex-end",
    "align-self": "flex-end"
  }
}
```

注意：

- style 表示组件自身的外观
- layout 表示在父容器中的定位规则

layout 的语法由目标框架的适配层定义：
- **Web 框架**：使用 Flex 布局属性（justify-self / align-self 等）
- **XAML 框架**：使用 Grid.Row / Grid.Column / HorizontalAlignment 等

---

# children

组件树结构。

```json
{
  "component": "space",
  "children": [
    { "component": "button" },
    { "component": "button" }
  ]
}
```

---

# 页面组件

page 表示 **顶层容器**（页面 / 窗口 / 屏幕）。

page 的默认尺寸由框架适配层定义：
- **Web 框架**：默认 100vw × 100vh
- **XAML 框架**：默认填充窗口或父容器

如果 UI Schema 用于对话框、抽屉或其他非顶层容器中，AI 不应生成 page 节点。应使用适当的容器组件（dialog / drawer）作为根节点。

page 的尺寸可通过 style 覆盖：

```json
{
  "component": "page",
  "style": {
    "width": "800px",
    "height": "600px"
  }
}
```

---

# Web 框架布局模型

以下规范仅适用于 **Web 框架**（Vue / React / HTML + CSS）。

## Flex 布局

```json
{
  "style": {
    "display": "flex"
  }
}
```

支持：

```json
{
  "style": {
    "display": "flex",
    "flex-direction": "row",
    "gap": "10px"
  }
}
```

### 容器级 Flex 属性

父容器的 Flex 布局属性（justify-content、align-items、flex-direction、flex-wrap、gap）统一放在父节点的 style 中。

错误：

```json
{
  "component": "page",
  "style": {
    "display": "flex"
  },
  "layout": {
    "justify-content": "space-between",
    "align-items": "center"
  }
}
```

正确：

```json
{
  "component": "page",
  "style": {
    "display": "flex",
    "justify-content": "space-between",
    "align-items": "center"
  }
}
```

### flex 简写

支持 flex-grow / flex-shrink / flex-basis 简写：

```json
{
  "style": {
    "flex": 1
  }
}
```

```json
{
  "style": {
    "flex": "0 0 200px"
  }
}
```

### justify-self 和 align-self

```json
{
  "layout": {
    "justify-self": "flex-end",
    "align-self": "flex-end"
  }
}
```

注意：

- justify-self：沿主轴方向的自对齐
- align-self：沿交叉轴方向的自对齐

虽然 `justify-self` 在 CSS Flexbox 标准中不存在，AI 应将其转换为等价实现。

#### justify-self 转换规则

| flex-direction | justify-self 值 | 等价 CSS | 描述 |
|----------------|----------------|----------|------|
| row（默认） | flex-end | margin-left: auto | 推到容器右侧 |
| row（默认） | flex-start | 默认行为，无需转换 | 保持在左侧 |
| row（默认） | center | 无纯 CSS 等价 | 需要包装容器 |
| column | flex-end | margin-top: auto | 推到容器底部 |
| column | flex-start | 默认行为，无需转换 | 保持在顶部 |
| column | center | 无纯 CSS 等价 | 需要包装容器 |
| row-reverse | flex-end | margin-right: auto | 推到容器左侧 |
| column-reverse | flex-end | margin-bottom: auto | 推到容器顶部 |

对于 `center` 情况，AI 应生成一个辅助容器包裹子节点，并在辅助容器上使用 `justify-content: center`。

#### align-self 转换规则

align-self 是标准 CSS 属性。按标准映射。

| align-self 值 | 描述 |
|--------------|------|
| flex-start | 对齐到交叉轴起点 |
| flex-end | 对齐到交叉轴终点 |
| center | 对齐到交叉轴居中 |
| stretch | 拉伸以填满交叉轴（默认） |

---

# XAML 框架布局模型

以下规范仅适用于 **XAML 框架**（Avalonia）。

## 面板布局

XAML 框架使用 Panel 容器（StackPanel / Grid / DockPanel）来管理布局。

```json
{
  "component": "stack-panel",
  "props": {
    "orientation": "Horizontal"
  },
  "layout": {
    "horizontal-alignment": "Right",
    "vertical-alignment": "Bottom"
  },
  "children": []
}
```

## 网格布局

```json
{
  "component": "grid",
  "children": [
    {
      "component": "button",
      "layout": {
        "grid-row": "1",
        "grid-column": "1"
      }
    }
  ]
}
```

---

# 框架适配器

UI Schema 核心规范是框架无关的。各目标框架的组件映射、代码生成约定和示例记录在单独的适配器文档中：

| 框架 | 适配器文档 |
|------|-----------|
| Vue3 + Element Plus | `docs/framework-vue-element-plus.md` |
| Vue3 + Antdv Next | `docs/framework-vue-antdv-next.md` |
| React + Ant Design | `docs/framework-react-antd.md` |
| React + Material UI | `docs/framework-react-mui.md` |
| Avalonia UI | `docs/framework-avalonia.md` |

## 组件映射原则

- 映射表仅记录存在命名差异的组件
- 未注册的组件名遵循 **直接透传** 规则：`{ "component": "switch" }` → 目标框架中同名的组件

---

# 通用组件示例

以下示例展示 UI Schema 核心语法。具体输出请参见框架适配器文档。

## Button

```json
{
  "component": "button",
  "props": {
    "type": "primary",
    "size": "small",
    "text": "Save"
  },
  "events": {
    "click": "handleSave"
  }
}
```

## Checkbox

```json
{
  "component": "checkbox",
  "props": {
    "text": "Agree to terms"
  },
  "bindings": {
    "checked": "agreed"
  }
}
```

## 带绑定的 Input

```json
{
  "component": "input",
  "props": {
    "placeholder": "Please enter username"
  },
  "bindings": {
    "value": "formData.username"
  }
}
```

## Space

```json
{
  "component": "space",
  "props": {
    "size": "middle"
  },
  "children": []
}
```

---

# AI 代码生成规则

1. 严格保留 children 组件层级结构
2. 优先保留布局意图
3. 优先使用组件库的原生能力
4. 根据框架适配层映射 style
5. 根据框架适配层映射 props
6. meta 仅作为语义增强信息使用
7. 保留 meta 信息
8. remarks 可作为设计约束使用
9. 冲突优先级：Props > Style > Layout > Meta
10. 从 events 生成的事件处理函数必须在源代码中声明
11. bindings 中绑定的数据路径必须在源代码中声明对应变量

### 冲突优先级示例

当同一 CSS 属性同时出现在 props 和 style 中时，props 优先：

```json
{
  "props": { "width": "100px" },
  "style": { "width": "200px" }
}
// → AI 优先使用 props.width (100px)
```

一般情况下，props 和 style 的语义不重叠，因此冲突较少。

---

# 布局容器组件

除 page 和 space 外，UI Schema 还支持以下布局容器：

## Row / Col（栅格系统）

```json
{
  "component": "row",
  "props": { "gutter": 20 },
  "children": [
    {
      "component": "col",
      "props": { "span": 12 },
      "children": []
    },
    {
      "component": "col",
      "props": { "span": 12 },
      "children": []
    }
  ]
}
```

## Card

```json
{
  "component": "card",
  "props": { "header": "User Info" },
  "children": []
}
```

生成目标框架的 Card 组件。`header` 属性映射到框架的 title 属性。

## 容器布局

```json
{
  "component": "container",
  "style": { "height": "100vh" },
  "children": [
    { "component": "header", "props": { "text": "Top Navigation" } },
    { "component": "main", "children": [] },
    { "component": "footer", "props": { "text": "Copyright Info" } }
  ]
}
```

---

# 表格列定义

表格列通过 `column` 子组件定义：

```json
{
  "component": "table",
  "props": {
    "border": true,
    "stripe": true
  },
  "bindings": {
    "data": "userList"
  },
  "children": [
    {
      "component": "column",
      "props": { "label": "Name", "prop": "name" }
    },
    {
      "component": "column",
      "props": { "label": "Age", "prop": "age", "width": "100px" }
    },
    {
      "component": "column",
      "props": { "label": "Actions", "fixed": "right" },
      "children": [
        {
          "component": "button",
          "props": { "text": "Edit", "size": "small" },
          "events": { "click": "handleEdit" }
        }
      ]
    }
  ]
}
```

---

# 表单结构

form 与 form-item 配合实现表单布局：

```json
{
  "component": "form",
  "props": {
    "label-width": "120px",
    "model": "formData"
  },
  "children": [
    {
      "component": "form-item",
      "props": { "label": "Username", "prop": "username" },
      "children": [
        {
          "component": "input",
          "props": { "placeholder": "Please enter username" },
          "bindings": {
            "value": "formData.username"
          }
        }
      ]
    },
    {
      "component": "form-item",
      "props": { "label": "Password", "prop": "password" },
      "children": [
        {
          "component": "input",
          "props": { "type": "password", "placeholder": "Please enter password" },
          "bindings": {
            "value": "formData.password"
          }
        }
      ]
    },
    {
      "component": "form-item",
      "props": { },
      "children": [
        {
          "component": "button",
          "props": { "text": "Login", "type": "primary" },
          "events": { "click": "handleLogin" }
        }
      ]
    }
  ]
}
```

---

# 补丁式增量修改

对于已有页面，可以使用 `patch` 语法描述增量修改，而无需重写完整的 UI Schema。

## 语法

```
patch <operation> <selector>
    <new component>
```

| 操作 | 描述 |
|------|------|
| `after <selector>` | 在匹配元素之后插入 |
| `before <selector>` | 在匹配元素之前插入 |
| `replace <selector>` | 替换匹配元素 |
| `remove <selector>` | 移除匹配元素 |
| `append <selector>` | 在匹配元素内部追加 |
| `prepend <selector>` | 在匹配元素内部前置 |

## 选择器

| 选择器 | 描述 |
|--------|------|
| `form` | 匹配第一个名为 form 的组件 |
| `form-item` | 匹配第一个 form-item |
| `card[2]` | 第 2 个 card（从 1 开始） |
| `card[last]` | 最后一个 card |
| `card[header=User List]` | 按 header 属性匹配 card |
| `form > form-item` | form 的直接子 form-item |
| `form > form-item[2]` | form 的第 2 个 form-item（从 1 开始） |
| `card[2] > table` | 第 2 个 card 中的 table |
| `page > form` | page 的直接子 form |
| `.layout bottom-right` | 按布局位置匹配 |
| `component[prop=value]` | 按任意属性值匹配 |

## 示例

**已有页面：**

```
page [flex, padding=10]
    checkbox "复选框" [size=small]
        .layout top-left
    space [size=middle]
        .layout bottom-right
        button "确定" [size=small]
        button "取消" [size=small, type=primary]
```

**增量修改：**

```patch
# 在 space 之前插入一个搜索框
patch before space
    input [placeholder=搜索...]
        .bind value=search.keyword

# 在 space 内部开头插入一个重置按钮
patch prepend space
    button "重置" [size=small]

# 在确定和取消之间插入应用按钮
patch after space > button[1]
    button "应用" [size=small]
        .click handleApply

# 在复选框后面加一个输入框
patch after checkbox
    input [placeholder=请输入备注]
        .bind value=form.remark

# 删除取消按钮
patch remove space > button[2]
```

**等价的完整 UI Schema：**

```
page [flex, padding=10]
    checkbox "复选框" [size=small]
        .layout top-left
    input [placeholder=请输入备注]
        .bind value=form.remark
    input [placeholder=搜索...]
        .bind value=search.keyword
    space [size=middle]
        .layout bottom-right
        button "重置" [size=small]
        button "确定" [size=small]
        button "应用" [size=small]
            .click handleApply
```

## JSON 格式的 Patch

Patch 也可以用 JSON 编写：

```json
{
  "patch": [
    { "op": "before", "selector": "space", "children": [
      { "component": "input", "props": { "placeholder": "搜索..." }, "bindings": { "value": "search.keyword" } }
    ]},
    { "op": "prepend", "selector": "space", "children": [
      { "component": "button", "props": { "text": "重置", "size": "small" } }
    ]},
    { "op": "after", "selector": "space > button[1]", "children": [
      { "component": "button", "props": { "text": "应用", "size": "small" }, "events": { "click": "handleApply" } }
    ]},
    { "op": "after", "selector": "checkbox", "children": [
      { "component": "input", "props": { "placeholder": "请输入备注" }, "bindings": { "value": "form.remark" } }
    ]},
    { "op": "remove", "selector": "space > button[2]" }
  ]
}
```

AI 应在生成最终代码前，将 patch 合并到已有的 UI Schema 中。

---

# 完整示例

以下示例演示了从抽象 UI Schema 描述到多框架代码的映射过程。同一份定义以 **JSON** 和 **缩进** 两种格式提供。AI 应同等理解两者。

### JSON 格式

```json
{
  "component": "page",
  "meta": {
    "description": "Full-screen page, checkbox in the top-left, button group in the bottom-right.",
    "tags": ["page", "demo"],
    "remarks": [
      "Page uses Flex layout.",
      "justify-self is a UISchema layout property, converted to equivalent CSS by the Web adapter layer."
    ]
  },
  "style": {
    "display": "flex",
    "padding": "10px"
  },
  "children": [
    {
      "component": "checkbox",
      "meta": {
        "description": "Checkbox located at the top-left of the page.",
        "tags": ["form", "checkbox"]
      },
      "props": {
        "size": "small",
        "text": "Checkbox"
      },
      "style": {
        "color": "#f00"
      },
      "layout": {
        "justify-self": "flex-start",
        "align-self": "flex-start"
      }
    },
    {
      "component": "space",
      "meta": {
        "description": "Action button group container located at the bottom-right of the page.",
        "tags": ["action-group", "footer"],
        "remarks": ["Button group stays aligned to the bottom-right."]
      },
      "props": {
        "size": "middle"
      },
      "layout": {
        "justify-self": "flex-end",
        "align-self": "flex-end"
      },
      "children": [
        {
          "component": "button",
          "props": { "size": "small", "type": "default", "text": "Confirm" },
          "events": { "click": "handleConfirm" }
        },
        {
          "component": "button",
          "props": { "size": "small", "type": "primary", "text": "Cancel" },
          "events": { "click": "handleCancel" }
        },
        {
          "component": "button",
          "props": { "size": "small", "type": "default", "text": "Apply" },
          "events": { "click": "handleApply" }
        }
      ]
    }
  ]
}
```

### 缩进格式

```
# Full-screen page, checkbox in the top-left, button group in the bottom-right.
page [flex, padding=10]
    .meta Full-screen page, checkbox in the top-left, button group in the bottom-right.
    .tags page, demo
    .remark Page uses Flex layout.
    .remark justify-self is a UISchema layout property, converted to equivalent CSS by the Web adapter layer.

    checkbox "Checkbox" [size=small]
        .meta Checkbox located at the top-left of the page.
        .tags form, checkbox
        .style color=#f00
        .layout top-left

    space [size=middle]
        .meta Action button group container located at the bottom-right of the page.
        .tags action-group, footer
        .remark Button group stays aligned to the bottom-right.
        .layout bottom-right

        button "Confirm" [size=small]
            .click handleConfirm
        button "Cancel" [size=small, type=primary]
            .click handleCancel
        button "Apply" [size=small]
            .click handleApply
```

### Vue + Element Plus 生成输出

```vue
<template>
  <div style="display:flex; padding:10px; width:100vw; height:100vh;">
    <el-checkbox
      style="color:#f00;"
      :style="{ alignSelf: 'flex-start', marginRight: 'auto' }"
      size="small"
    >复选框</el-checkbox>

    <el-space
      size="middle"
      :style="{ alignSelf: 'flex-end', marginLeft: 'auto' }"
    >
      <el-button size="small" @click="handleConfirm">确定</el-button>
      <el-button size="small" type="primary" @click="handleCancel">取消</el-button>
      <el-button size="small" @click="handleApply">应用</el-button>
    </el-space>
  </div>
</template>
```

### React + Ant Design 生成输出

```tsx
import { Checkbox, Space, Button } from 'antd';

export default function Page() {
  return (
    <div style={{ display: 'flex', padding: 10, width: '100vw', height: '100vh' }}>
      <Checkbox
        // style: color
        // layout: justify-self + align-self
        style={{ color: '#f00', alignSelf: 'flex-start', marginRight: 'auto' }}
      >复选框</Checkbox>

      <Space
        size="middle"
        // layout: justify-self + align-self
        style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}
      >
        <Button size="small" onClick={handleConfirm}>确定</Button>
        <Button size="small" type="primary" onClick={handleCancel}>取消</Button>
        <Button size="small" onClick={handleApply}>应用</Button>
      </Space>
    </div>
  );
}
```

### Vue + Antdv Next 生成输出

```vue
<template>
  <div style="display:flex; padding:10px; width:100vw; height:100vh;">
    <a-checkbox
      style="color:#f00;"
      :style="{ alignSelf: 'flex-start', marginRight: 'auto' }"
      size="small"
    >复选框</a-checkbox>

    <a-space size="middle" :style="{ alignSelf: 'flex-end', marginLeft: 'auto' }">
      <a-button size="small" @click="handleConfirm">确定</a-button>
      <a-button size="small" type="primary" @click="handleCancel">取消</a-button>
      <a-button size="small" @click="handleApply">应用</a-button>
    </a-space>
  </div>
</template>
```

### React + Material UI 生成输出

```tsx
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function Page() {
  return (
    <Box sx={{ display: 'flex', p: 1, width: '100vw', height: '100vh' }}>
      <Checkbox sx={{ alignSelf: 'flex-start', mr: 'auto' }} />
      <span style={{ color: '#f00' }}>复选框</span>

      <Stack
        direction="row"
        spacing={1}
        sx={{ alignSelf: 'flex-end', ml: 'auto' }}
      >
        <Button size="small" onClick={handleConfirm}>确定</Button>
        <Button size="small" variant="contained" onClick={handleCancel}>取消</Button>
        <Button size="small" onClick={handleApply}>应用</Button>
      </Stack>
    </Box>
  );
}
```

### Avalonia UI 生成输出

```xml
<UserControl
  xmlns="https://github.com/avaloniaui"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  x:Class="MyApp.Views.MainView">
  <Panel>
    <CheckBox
      Content="复选框"
      Width="200"
      Foreground="#f00"
      HorizontalAlignment="Left"
      VerticalAlignment="Top"
    />

    <StackPanel
      Orientation="Horizontal"
      Spacing="8"
      HorizontalAlignment="Right"
      VerticalAlignment="Bottom"
    >
      <Button Content="确定" Click="OnConfirm" />
      <Button Content="取消" Click="OnCancel" />
      <Button Content="应用" Click="OnApply" />
    </StackPanel>
  </Panel>
</UserControl>
```

预期布局：

```text
┌─────────────────────────────────────┐
│ ☐ 复选框                            │
│                                      │
│                                      │
│            [确定] [取消] [应用]      │
└─────────────────────────────────────┘
```
