# UISchema Adapter: Vue3 + Element Plus

## Overview

This document defines the mapping rules from UISchema to Vue3 + Element Plus.

Adapter Versions:

- Vue 3.x
- Element Plus 2.x

---

## Component Mapping

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

## Component Mapping Principles

- Component names not listed in the mapping table follow the **passthrough** rule.
- Example: `{ "component": "affix" }` → `<el-affix />`

---

## Props Mapping

Props keys map directly to Element Plus component props (kebab-case).

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

### Text Mapping

`props.text` maps to the component's default slot.

```json
{ "props": { "text": "确认删除" } }
```

```vue
<el-button>确认删除</el-button>
<el-checkbox>确认删除</el-checkbox>
```

If the component does not support default slot text (e.g. `<el-input />`), AI should ignore `text`.

### Size Mapping

| UISchema Value | Element Plus Value |
|-------------|----------------|
| small | small |
| middle / default | default |
| large | large |

---

## Events Mapping

Common event names map to Vue's `@` syntax:

| Common Event Name | Element Plus |
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

Event handlers are declared in `<script setup>`.

---

## Bindings Mapping

Bindings map to `v-model`:

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

Binding data is declared in `<script setup>` via `ref()` or `reactive()`.

```vue
<script setup>
import { reactive } from 'vue'

const formData = reactive({
  username: ''
})
</script>
```

---

## Style Mapping

The style object maps directly to Vue's `:style` binding:

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

## Layout Mapping

Layout attributes map to CSS Flexbox implementations:

| Layout Attribute | Equivalent CSS |
|-------------|----------|
| justify-self: flex-end | margin-left: auto |
| justify-self: flex-start | default behavior |
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

## Examples

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

### Checkbox with Binding

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

### Select with Options

Element Plus supports two approaches: child `el-option` elements or the `:options` prop.

**Approach 1 (child elements, recommended):**

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

**Approach 2 (options prop, 2.10.5+):**

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

## No Mixing Allowed

Do not mix component libraries when generating code.

Wrong:

```vue
<el-button />
<a-input />
```

Correct:

```vue
<el-button />
<el-input />
```
