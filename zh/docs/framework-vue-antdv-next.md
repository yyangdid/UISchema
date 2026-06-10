# UISchema 适配：Vue3 + Antdv Next

## 概述

本文档定义 UISchema 到 Vue3 + [Antdv Next](https://www.antdv-next.com/) 的映射规则。

Antdv Next 是一个基于 Ant Design 设计体系的 **Vue3 企业级组件库**。

适配版本：

- Vue 3.x
- Antdv Next 1.x

---

## 组件映射

| UISchema | Antdv Next | 说明 |
|----------|-----------|------|
| page | `<div style="width:100vw;height:100vh">` | 全屏页面容器 |
| button | a-button | - |
| checkbox | a-checkbox | v-model:checked |
| checkbox-group | a-checkbox-group | v-model:value |
| input | a-input | v-model:value |
| input-search | a-input-search | 含搜索按钮 |
| input-password | a-input-password | 密码输入框 |
| textarea | a-textarea | 多行文本 |
| input-number | a-input-number | v-model:value |
| select | a-select | v-model:value |
| radio | a-radio | - |
| radio-button | a-radio-button | 按钮样式的单选 |
| radio-group | a-radio-group | v-model:value |
| switch | a-switch | v-model:checked |
| table | a-table | :data-source, :columns |
| modal | a-modal | v-model:open |
| drawer | a-drawer | v-model:open |
| form | a-form | - |
| form-item | a-form-item | - |
| space | a-space | - |
| space-compact | a-space-compact | 紧凑模式 |
| space-addon | a-space-addon | Space.Compact 的前/后缀 |
| row | a-row | 栅格行 |
| col | a-col | 栅格列 |
| card | a-card | - |
| tag | a-tag | - |
| badge | a-badge | - |
| avatar | a-avatar | - |
| pagination | a-pagination | v-model:current |
| divider | a-divider | - |
| flex | a-flex | 弹性布局容器（替代部分 CSS Flex） |
| menu | a-menu | - |
| tabs | a-tabs | v-model:active-key |
| tab-pane | a-tab-pane | - |
| breadcrumb | a-breadcrumb | - |
| steps | a-steps | v-model:current |
| step | a-step | - |
| dropdown | a-dropdown | - |
| alert | a-alert | - |
| progress | a-progress | - |
| spin | a-spin | 加载中 |
| skeleton | a-skeleton | 骨架屏 |
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
| qr-code | a-qr-code | 二维码 |
| watermark | a-watermark | 水印 |
| upload | a-upload | - |
| tree | a-tree | v-model:checked-keys |
| tree-select | a-tree-select | v-model:value |
| transfer | a-transfer | v-model:target-keys |
| config-provider | a-config-provider | 全局配置 |
| result | a-result | 结果页 |
| empty | a-empty | 空状态 |
| statistic | a-statistic | 统计数值 |
| segmented | a-segmented | v-model:value |
| anchor | a-anchor | 锚点 |
| mentions | a-mentions | v-model:value |
| auto-complete | a-auto-complete | v-model:value |
| float-button | a-float-button | 悬浮按钮 |
| splitter | a-splitter | 面板分割 |
| tour | a-tour | 引导 |
| ribbon | a-ribbon | 缎带 |

---

## 组件映射原则

- 未在映射表中列出的组件名，按**直接透传**规则处理
- 示例：`{ "component": "affix" }` → `<a-affix />`
- Select 等组件的选项通过 `props.options` 数组传入，不使用子组件

---

## props 映射

props 键名支持 kebab-case 或 camelCase（Antdv Next 两者皆可）。

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

### size 取值

| UISchema 值 | Antdv Next 值 |
|-------------|---------------|
| small | small |
| middle / default | middle |
| large | large |

### text 映射

`props.text` 映射到组件的默认 slot（插槽内容）。

```json
{ "props": { "text": "确认删除" } }
```

```vue
<a-button>确认删除</a-button>
<a-checkbox>确认删除</a-checkbox>
```

如果组件不支持默认 slot 文本（如 `<a-input />`），AI 应忽略 `text` 并改用 `placeholder` 等对应属性。

---

## events 映射

通用事件名映射为 Vue 的 `@` 语法：

| 通用事件名 | Antdv Next |
|-----------|------------|
| click | @click |
| change | @change |
| input | @input |
| blur | @blur |
| focus | @focus |
| submit | @submit (原生表单) |
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

事件处理函数在 `<script setup>` 中声明。

---

## bindings 映射

bindings 映射为 `v-model:xxx` 语法（Antdv Next 要求显式指定绑定目标）：

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

### 常见组件的绑定目标

| UISchema bindings 键 | 组件 | Antdv Next 语法 |
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

绑定数据在 `<script setup>` 中通过 `ref()` 或 `reactive()` 声明：

```vue
<script setup lang="ts">
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

也可使用 Antdv Next 的 `a-flex` 容器简化布局：

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
<a-button type="primary" size="small" @click="handleSave">保存</a-button>
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

### Select with options

Antdv Next 的 Select 通过 `options` prop 传入选项数组（非子元素）。

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

## 禁止混用

生成代码时不得混用组件库。

错误：

```vue
<a-button />
<el-input />
```

正确：

```vue
<a-button />
<a-input />
```
