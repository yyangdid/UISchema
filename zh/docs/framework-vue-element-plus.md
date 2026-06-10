# UISchema 适配：Vue3 + Element Plus

## 概述

本文档定义 UISchema 到 Vue3 + Element Plus 的映射规则。

适配版本：

- Vue 3.x
- Element Plus 2.x

---

## 组件映射

| UISchema | Element Plus |
|----------|------------|
| page | `<div style="width:100vw;height:100vh">` |
| button | el-button |
| checkbox | el-checkbox |
| input | el-input |
| select | el-select |
| option | el-option |
| radio | el-radio |
| switch | el-switch |
| table | el-table |
| column | el-table-column |
| dialog | el-dialog |
| drawer | el-drawer |
| form | el-form |
| form-item | el-form-item |
| space | el-space |
| row | el-row |
| col | el-col |
| card | el-card |
| container | el-container |
| header | el-header |
| main | el-main |
| footer | el-footer |
| tag | el-tag |
| pagination | el-pagination |
| divider | el-divider |
| badge | el-badge |
| avatar | el-avatar |
| menu | el-menu |
| tabs | el-tabs |
| tab-pane | el-tab-pane |
| breadcrumb | el-breadcrumb |
| breadcrumb-item | el-breadcrumb-item |
| steps | el-steps |
| step | el-step |
| alert | el-alert |
| progress | el-progress |
| tooltip | el-tooltip |
| popover | el-popover |
| popconfirm | el-popconfirm |
| date-picker | el-date-picker |
| time-picker | el-time-picker |
| input-number | el-input-number |
| cascader | el-cascader |
| slider | el-slider |
| rate | el-rate |
| color-picker | el-color-picker |
| descriptions | el-descriptions |
| descriptions-item | el-descriptions-item |
| collapse | el-collapse |
| collapse-item | el-collapse-item |
| timeline | el-timeline |
| timeline-item | el-timeline-item |

---

## 组件映射原则

- 未在映射表中列出的组件名，按**直接透传**规则处理
- 示例：`{ "component": "affix" }` → `<el-affix />`

---

## props 映射

props 键名直接映射为 Element Plus 组件的 props（kebab-case）。

```json
{
  "component": "button",
  "props": {
    "type": "primary",
    "size": "small",
    "text": "保存"
  }
}
```

```vue
<el-button type="primary" size="small">保存</el-button>
```

### text 映射

`props.text` 映射到组件的默认 slot（插槽内容）。

```json
{ "props": { "text": "确认删除" } }
```

```vue
<el-button>确认删除</el-button>
<el-checkbox>确认删除</el-checkbox>
```

如果组件不支持默认 slot 文本（如 `<el-input />`），AI 应忽略 `text`。

### size 映射

| UISchema 值 | Element Plus 值 |
|-------------|----------------|
| small | small |
| middle / default | default |
| large | large |

---

## events 映射

通用事件名映射为 Vue 的 `@` 语法：

| 通用事件名 | Element Plus |
|-----------|-------------|
| click | @click |
| change | @change |
| input | @input |
| blur | @blur |
| focus | @focus |
| submit | @submit |
| open | @open |
| close | @close |

```json
{
  "events": {
    "click": "handleSubmit"
  }
}
```

```vue
<el-button @click="handleSubmit">提交</el-button>
```

事件处理函数在 `<script setup>` 中声明。

---

## bindings 映射

bindings 映射为 `v-model`：

```json
{
  "bindings": {
    "value": "formData.username"
  }
}
```

```vue
<el-input v-model="formData.username" />
```

绑定数据在 `<script setup>` 中通过 `ref()` 或 `reactive()` 声明。

```vue
<script setup>
import { reactive } from 'vue'

const formData = reactive({
  username: ''
})
</script>
```

---

## style 映射

style 对象直接映射为 Vue 的 `:style` 绑定：

```json
{
  "style": {
    "width": "200px",
    "color": "#f00"
  }
}
```

```vue
<div :style="{ width: '200px', color: '#f00' }">
```

---

## layout 映射

layout 属性映射为 CSS Flex 布局实现：

| layout 属性 | 等效 CSS |
|-------------|----------|
| justify-self: flex-end | margin-left: auto |
| justify-self: flex-start | 默认行为 |
| align-self: flex-start | align-self: flex-start |
| align-self: flex-end | align-self: flex-end |
| align-self: center | align-self: center |

```json
{
  "layout": {
    "justify-self": "flex-end",
    "align-self": "flex-end"
  }
}
```

```vue
<div :style="{ alignSelf: 'flex-end', marginLeft: 'auto' }">
```

---

## 示例

### Button

```json
{
  "component": "button",
  "props": { "type": "primary", "size": "small", "text": "保存" },
  "events": { "click": "handleSave" }
}
```

```vue
<el-button type="primary" size="small" @click="handleSave">保存</el-button>
```

### Checkbox with binding

```json
{
  "component": "checkbox",
  "props": { "text": "同意协议" },
  "bindings": { "checked": "agreed" }
}
```

```vue
<el-checkbox v-model="agreed">同意协议</el-checkbox>
```

### Input

```json
{
  "component": "input",
  "props": { "placeholder": "请输入用户名" },
  "bindings": { "value": "formData.username" }
}
```

```vue
<el-input v-model="formData.username" placeholder="请输入用户名" />
```

### Space

```json
{
  "component": "space",
  "props": { "size": "default" },
  "children": []
}
```

```vue
<el-space size="default">
  <!-- children -->
</el-space>
```

### Select with options

Element Plus 支持两种方式：`el-option` 子元素或 `:options` prop。

**方式一（子元素，推荐）：**

```json
{
  "component": "select",
  "props": { "placeholder": "请选择" },
  "bindings": { "value": "formData.role" },
  "children": [
    { "component": "option", "props": { "value": "admin", "label": "管理员" } },
    { "component": "option", "props": { "value": "user", "label": "普通用户" } }
  ]
}
```

```vue
<el-select v-model="formData.role" placeholder="请选择">
  <el-option label="管理员" value="admin" />
  <el-option label="普通用户" value="user" />
</el-select>
```

**方式二（options prop，2.10.5+）：**

```json
{
  "component": "select",
  "props": {
    "placeholder": "请选择",
    "options": [
      { "value": "admin", "label": "管理员" },
      { "value": "user", "label": "普通用户" }
    ]
  },
  "bindings": { "value": "formData.role" }
}
```

```vue
<el-select v-model="formData.role" placeholder="请选择" :options="options" />
```

---

## 禁止混用

生成代码时不得混用组件库。

错误：

```vue
<el-button />
<a-input />
```

正确：

```vue
<el-button />
<el-input />
```
