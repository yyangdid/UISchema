# UISchema Adapter: React + Ant Design

## Overview

This document defines the mapping rules from UISchema to React + Ant Design.

Adapter Versions:

- React 19.x
- Ant Design 6.x

Reference: https://ant.design/llms-full.txt

---

## Component Mapping

| UISchema | Ant Design | Description |
|----------|-----------|------|
| page | `<div style="width:100vw;height:100vh">` | Full-screen page container |
| button | Button | - |
| checkbox | Checkbox | - |
| checkbox-group | Checkbox.Group | - |
| input | Input | - |
| input-search | Input.Search | With search button |
| input-password | Input.Password | Password input |
| textarea | Input.TextArea | Multi-line text |
| input-number | InputNumber | - |
| select | Select | Uses `options` prop |
| radio | Radio | - |
| radio-group | Radio.Group | - |
| switch | Switch | - |
| table | Table | :dataSource, :columns |
| modal | Modal | - |
| drawer | Drawer | - |
| form | Form | - |
| form-item | Form.Item | - |
| space | Space | - |
| flex | Flex | Flex layout container |
| row | Row | Grid row |
| col | Col | Grid column |
| card | Card | - |
| tag | Tag | - |
| badge | Badge | - |
| avatar | Avatar | - |
| pagination | Pagination | - |
| divider | Divider | - |
| menu | Menu | - |
| tabs | Tabs | - |
| breadcrumb | Breadcrumb | - |
| steps | Steps | - |
| dropdown | Dropdown | - |
| alert | Alert | - |
| progress | Progress | - |
| spin | Spin | Loading spinner |
| skeleton | Skeleton | Skeleton screen |
| collapse | Collapse | - |
| tooltip | Tooltip | - |
| popover | Popover | - |
| popconfirm | Popconfirm | - |
| date-picker | DatePicker | - |
| time-picker | TimePicker | - |
| cascader | Cascader | - |
| slider | Slider | - |
| rate | Rate | - |
| color-picker | ColorPicker | - |
| descriptions | Descriptions | - |
| typography-title | Typography.Title | - |
| typography-text | Typography.Text | - |
| image | Image | - |
| qr-code | QRCode | QR code |
| watermark | Watermark | Watermark |
| upload | Upload | - |
| tree | Tree | - |
| tree-select | TreeSelect | - |
| transfer | Transfer | - |
| result | Result | Result page |
| empty | Empty | Empty state |
| statistic | Statistic | Statistical value |
| segmented | Segmented | - |
| anchor | Anchor | Anchor |
| mentions | Mentions | - |
| auto-complete | AutoComplete | - |
| float-button | FloatButton | Floating button |
| tour | Tour | Guided tour |
| affix | Affix | - |
| config-provider | ConfigProvider | Global configuration |
| layout | Layout | Layout container |
| layout-header | Layout.Header | - |
| layout-sider | Layout.Sider | - |
| layout-content | Layout.Content | - |
| layout-footer | Layout.Footer | - |

---

## Component Mapping Principles

- Component names not listed in the mapping table follow the **passthrough** rule.
- Example: `{ "component": "Watermark" }` → `<Watermark>`
- Ant Design component names use PascalCase, props use camelCase

---

## Props Mapping

Props keys use camelCase.

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

```tsx
<Button type="primary" size="small">保存</Button>
```

### Text Mapping

`props.text` maps to the component's **children**.

```json
{ "props": { "text": "确认删除" } }
```

```tsx
<Button>确认删除</Button>
<Checkbox>确认删除</Checkbox>
```

If the component does not support children text (e.g. `<Input />`), AI should ignore `text` and use the corresponding prop like `placeholder` instead.

### Size Mapping

| UISchema Value | Ant Design Value |
|-------------|---------------|
| small | small |
| middle / default | middle |
| large | large |

---

## Events Mapping

Common event names map to React's `onXxx` syntax:

| Common Event Name | Ant Design |
|-----------|------------|
| click | onClick |
| change | onChange |
| input | onChange |
| blur | onBlur |
| focus | onFocus |
| submit | onSubmit |
| open | onOpen (or onOpenChange) |
| close | onClose |
| search | onSearch (Input.Search) |
| select | onSelect (Select) |

```json
{
  "events": {
    "click": "handleSubmit"
  }
}
```

```tsx
<Button onClick={handleSubmit}>提交</Button>
```

Event handlers can be defined inside the component:

```tsx
const handleSubmit = () => {
  // ...
};
```

---

## Bindings Mapping

React does not have v-model; bindings map to the `value` + `onChange` pattern:

```json
{
  "bindings": {
    "value": "formData.username"
  }
}
```

```tsx
<Input
  value={formData.username}
  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
/>
```

AI should generate corresponding `useState` or `useReducer` declarations:

```tsx
import { useState } from 'react';

const [formData, setFormData] = useState({ username: '' });
```

### Common Component Binding Patterns

| UISchema Component | Binding Pattern |
|--------------|---------|
| input | value + onChange(e.target.value) |
| select | value + onChange(value) |
| checkbox | checked + onChange(e.target.checked) |
| switch | checked + onChange(checked) |
| radio-group | value + onChange(e.target.value) |
| date-picker | value + onChange(date) |
| input-number | value + onChange(value) |
| slider | value + onChange(value) |

---

## Style Mapping

The style object maps to React's `style` prop (camelCase CSS properties):

```json
{
  "style": {
    "width": "200px",
    "color": "#f00"
  }
}
```

```tsx
<div style={{ width: '200px', color: '#f00' }}>
```

---

## Layout Mapping

Layout attributes map to CSS Flexbox implementations:

| Layout Attribute | Equivalent CSS |
|-------------|----------|
| justify-self: flex-end | marginLeft: auto |
| justify-self: flex-start | default behavior |
| align-self: flex-start | alignSelf: flex-start |
| align-self: flex-end | alignSelf: flex-end |
| align-self: center | alignSelf: center |

```json
{
  "layout": {
    "justify-self": "flex-end",
    "align-self": "flex-end"
  }
}
```

```tsx
<div style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
```

You can also use Ant Design's `<Flex>` component:

```json
{
  "component": "flex",
  "props": {
    "justify": "flex-end",
    "align": "flex-end",
    "gap": "middle"
  },
  "children": []
}
```

```tsx
<Flex justify="flex-end" align="flex-end" gap="middle">
  {/* children */}
</Flex>
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

```tsx
<Button type="primary" size="small" onClick={handleSave}>保存</Button>
```

### Checkbox with Binding

```json
{
  "component": "checkbox",
  "props": { "text": "同意协议" },
  "bindings": { "checked": "agreed" }
}
```

```tsx
<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
  同意协议
</Checkbox>
```

### Input

```json
{
  "component": "input",
  "props": { "placeholder": "请输入用户名" },
  "bindings": { "value": "formData.username" }
}
```

```tsx
<Input
  placeholder="请输入用户名"
  value={formData.username}
  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
/>
```

### Select with Options

Ant Design's Select passes the options array via the `options` prop.

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

```tsx
<Select
  placeholder="请选择"
  value={formData.role}
  onChange={(value) => setFormData({ ...formData, role: value })}
  options={[
    { value: 'admin', label: '管理员' },
    { value: 'user', label: '普通用户' },
  ]}
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

```tsx
<Modal
  title="确认删除"
  open={modalVisible}
  onCancel={handleModalClose}
>
  确定要删除此项吗？
</Modal>
```

### Table with Columns

```json
{
  "component": "table",
  "props": { "bordered": true },
  "bindings": { "data": "dataSource" },
  "children": [
    { "component": "column", "props": { "title": "姓名", "dataIndex": "name", "key": "name" } },
    { "component": "column", "props": { "title": "年龄", "dataIndex": "age", "key": "age" } },
    {
      "component": "column",
      "props": { "title": "操作", "key": "action" },
      "children": [
        { "component": "button", "props": { "text": "编辑", "size": "small" }, "events": { "click": "handleEdit" } }
      ]
    }
  ]
}
```

```tsx
<Table
  bordered
  dataSource={dataSource}
  columns={[
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    {
      title: '操作',
      key: 'action',
      render: () => <Button size="small" onClick={handleEdit}>编辑</Button>,
    },
  ]}
/>
```

### Form

```json
{
  "component": "form",
  "props": { "labelCol": { "span": 6 }, "wrapperCol": { "span": 18 } },
  "children": [
    {
      "component": "form-item",
      "props": { "label": "用户名", "name": "username", "rules": [{ "required": true, "message": "请输入用户名" }] },
      "children": [
        {
          "component": "input",
          "props": { "placeholder": "请输入用户名" }
        }
      ]
    },
    {
      "component": "form-item",
      "props": { },
      "children": [
        {
          "component": "button",
          "props": { "text": "提交", "type": "primary" }
        }
      ]
    }
  ]
}
```

```tsx
<Form
  labelCol={{ span: 6 }}
  wrapperCol={{ span: 18 }}
>
  <Form.Item
    label="用户名"
    name="username"
    rules={[{ required: true, message: '请输入用户名' }]}
  >
    <Input placeholder="请输入用户名" />
  </Form.Item>
  <Form.Item>
    <Button type="primary">提交</Button>
  </Form.Item>
</Form>
```

---

## Full Example (Web Framework Target)

```json
{
  "component": "page",
  "style": {
    "display": "flex",
    "padding": "10px"
  },
  "children": [
    {
      "component": "checkbox",
      "props": { "text": "复选框" },
      "layout": {
        "justify-self": "flex-start",
        "align-self": "flex-start"
      }
    },
    {
      "component": "space",
      "layout": {
        "justify-self": "flex-end",
        "align-self": "flex-end"
      },
      "children": [
        {
          "component": "button",
          "props": { "text": "确定", "type": "default" },
          "events": { "click": "handleConfirm" }
        },
        {
          "component": "button",
          "props": { "text": "取消", "type": "primary" },
          "events": { "click": "handleCancel" }
        },
        {
          "component": "button",
          "props": { "text": "应用", "type": "default" },
          "events": { "click": "handleApply" }
        }
      ]
    }
  ]
}
```

### Generated Output

```tsx
import React from 'react';
import { Checkbox, Space, Button } from 'antd';

export default function Page() {
  const handleConfirm = () => {};
  const handleCancel = () => {};
  const handleApply = () => {};

  return (
    <div style={{ display: 'flex', padding: 10, width: '100vw', height: '100vh' }}>
      <Checkbox
        style={{ alignSelf: 'flex-start', marginRight: 'auto' }}
      >复选框</Checkbox>

      <Space style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
        <Button onClick={handleConfirm}>确定</Button>
        <Button type="primary" onClick={handleCancel}>取消</Button>
        <Button onClick={handleApply}>应用</Button>
      </Space>
    </div>
  );
}
```

---

## Import Conventions

Generated code should include the necessary import statements:

```tsx
import React from 'react';
import { Button, Input, Checkbox, Select, Space, Table, Modal, Form, message } from 'antd';
```

Icons should be imported from `@ant-design/icons`:

```tsx
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
```

---

## Generated Code Format

- Use TypeScript (`.tsx`)
- Function components + hooks
- Event handlers defined inside the component
- Styles use inline style or CSS modules