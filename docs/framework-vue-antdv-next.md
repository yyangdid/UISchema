# UISchema Adapter: Vue3 + Antdv Next

## Overview

This document defines the mapping rules from UISchema to Vue3 + [Antdv Next](https://www.antdv-next.com/).

Antdv Next is a **Vue3 enterprise-level component library** based on the Ant Design design system.

Adapter Versions:

- Vue 3.x
- Antdv Next 1.x

---

## Component Mapping

| UISchema | Antdv Next | Description |
|----------|-----------|------|
| page | `<div style="width:100vw;height:100vh">` | Full-screen page container |
| button | a-button | - |
| checkbox | a-checkbox | v-model:checked |
| checkbox-group | a-checkbox-group | v-model:value |
| input | a-input | v-model:value |
| input-search | a-input-search | With search button |
| input-password | a-input-password | Password input |
| textarea | a-textarea | Multi-line text |
| input-number | a-input-number | v-model:value |
| select | a-select | v-model:value |
| radio | a-radio | - |
| radio-button | a-radio-button | Radio styled as button |
| radio-group | a-radio-group | v-model:value |
| switch | a-switch | v-model:checked |
| table | a-table | :data-source, :columns |
| modal | a-modal | v-model:open |
| drawer | a-drawer | v-model:open |
| form | a-form | - |
| form-item | a-form-item | - |
| space | a-space | - |
| space-compact | a-space-compact | Compact mode |
| space-addon | a-space-addon | Space.Compact prefix/suffix |
| row | a-row | Grid row |
| col | a-col | Grid column |
| card | a-card | - |
| tag | a-tag | - |
| badge | a-badge | - |
| avatar | a-avatar | - |
| pagination | a-pagination | v-model:current |
| divider | a-divider | - |
| flex | a-flex | Flex layout container (replaces some CSS Flex) |
| menu | a-menu | - |
| tabs | a-tabs | v-model:active-key |
| tab-pane | a-tab-pane | - |
| breadcrumb | a-breadcrumb | - |
| steps | a-steps | v-model:current |
| step | a-step | - |
| dropdown | a-dropdown | - |
| alert | a-alert | - |
| progress | a-progress | - |
| spin | a-spin | Loading spinner |
| skeleton | a-skeleton | Skeleton screen |
| collapse | a-collapse | v-model:active-key |
| tooltip | a-tooltip | - |
| popover | a-popover | - |
| popconfirm | a-popconfirm | - |
| date-picker | a-date-picker | v-model:value |
| time-picker | a-time-picker | v-model:value |
| cascader | a-cascader | v-model:value |
| slider | a-slider | v-model:value |
| rate | a-rate | v-model:value |
| color-picker | a-color-picker | - |
| descriptions | a-descriptions | - |
| typography-title | a-typography-title | - |
| typography-text | a-typography-text | - |
| image | a-image | - |
| qr-code | a-qr-code | QR code |
| watermark | a-watermark | Watermark |
| upload | a-upload | - |
| tree | a-tree | v-model:checked-keys |
| tree-select | a-tree-select | v-model:value |
| transfer | a-transfer | v-model:target-keys |
| config-provider | a-config-provider | Global configuration |
| result | a-result | Result page |
| empty | a-empty | Empty state |
| statistic | a-statistic | Statistical value |
| segmented | a-segmented | v-model:value |
| anchor | a-anchor | Anchor |
| mentions | a-mentions | v-model:value |
| auto-complete | a-auto-complete | v-model:value |
| float-button | a-float-button | Floating button |
| splitter | a-splitter | Panel splitter |
| tour | a-tour | Guided tour |
| ribbon | a-ribbon | Ribbon |

---

## Component Mapping Principles

- Component names not listed in the mapping table follow the **passthrough** rule.
- Example: `{ "component": "affix" }` → `<a-affix />`
- Options for components like Select are passed via `props.options` array, not child components

---

## Props Mapping

Props keys support kebab-case or camelCase (Antdv Next accepts both).

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
<a-button type="primary" size="small">保存</a-button>
```

### Size Values

| UISchema Value | Antdv Next Value |
|-------------|---------------|
| small | small |
| middle / default | middle |
| large | large |

### Text Mapping

`props.text` maps to the component's default slot.

```json
{ "props": { "text": "确认删除" } }
```

```vue
<a-button>确认删除</a-button>
<a-checkbox>确认删除</a-checkbox>
```

If the component does not support default slot text (e.g. `<a-input />`), AI should ignore `text` and use the corresponding prop like `placeholder` instead.

---

## Events Mapping

Common event names map to Vue's `@` syntax:

| Common Event Name | Antdv Next |
|-----------|------------|
| click | @click |
| change | @change |
| input | @input |
| blur | @blur |
| focus | @focus |
| submit | @submit (native form) |
| open | @open (modal/drawer) |
| close | @close |

```json
{
  "events": {
    "click": "handleSubmit"
  }
}
```

```vue
<a-button @click="handleSubmit">提交</a-button>
```

Event handlers are declared in `<script setup>`.

---

## Bindings Mapping

Bindings map to the `v-model:xxx` syntax (Antdv Next requires explicit binding target):

```json
{
  "bindings": {
    "value": "formData.username"
  }
}
```

```vue
<a-input v-model:value="formData.username" />
```

### Common Component Binding Targets

| UISchema bindings Key | Component | Antdv Next Syntax |
|---------------------|------|----------------|
| value | input | v-model:value |
| value | select | v-model:value |
| value | date-picker | v-model:value |
| value | input-number | v-model:value |
| value | radio-group | v-model:value |
| value | checkbox-group | v-model:value |
| value | segmented | v-model:value |
| checked | checkbox | v-model:checked |
| checked | switch | v-model:checked |
| open | modal / drawer | v-model:open |
| current | pagination | v-model:current |
| current | steps | v-model:current |
| active-key | tabs | v-model:active-key |

Binding data is declared in `<script setup>` via `ref()` or `reactive()`:

```vue
<script setup lang="ts">
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

You can also use Antdv Next's `a-flex` container to simplify layout:

```json
{
  "component": "flex",
  "props": {
    "justify": "flex-end",
    "align": "flex-end",
    "gap": "small"
  },
  "children": []
}
```

```vue
<a-flex justify="flex-end" align="flex-end" gap="small">
  <!-- children -->
</a-flex>
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
<a-button type="primary" size="small" @click="handleSave">保存</a-button>
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
<a-checkbox v-model:checked="agreed">同意协议</a-checkbox>
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
<a-input v-model:value="formData.username" placeholder="请输入用户名" />
```

### Select with Options

Antdv Next's Select passes the options array via the `options` prop (not child elements).

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
<a-select
  v-model:value="formData.role"
  placeholder="请选择"
  :options="[
    { value: 'admin', label: '管理员' },
    { value: 'user', label: '普通用户' }
  ]"
/>
```

### Modal

```json
{
  "component": "modal",
  "props": { "title": "确认删除" },
  "bindings": { "open": "modalVisible" },
  "events": { "close": "handleModalClose" },
  "children": [
    { "component": "text", "props": { "content": "确定要删除此项吗？" } }
  ]
}
```

```vue
<a-modal v-model:open="modalVisible" title="确认删除" @close="handleModalClose">
  确定要删除此项吗？
</a-modal>
```

---

## No Mixing Allowed

Do not mix component libraries when generating code.

Wrong:

```vue
<a-button />
<el-input />
```

Correct:

```vue
<a-button />
<a-input />
```
