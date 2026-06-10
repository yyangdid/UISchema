# UISchema 适配：React + Ant Design

## 概述

本文档定义 UISchema 到 React + Ant Design 的映射规则。

适配版本：

- React 19.x
- Ant Design 6.x

参考来源：https://ant.design/llms-full.txt

---

## 组件映射

| UISchema | Ant Design | 说明 |
|----------|-----------|------|
| page | `<div style="width:100vw;height:100vh">` | 全屏页面容器 |
| button | Button | - |
| checkbox | Checkbox | - |
| checkbox-group | Checkbox.Group | - |
| input | Input | - |
| input-search | Input.Search | 含搜索按钮 |
| input-password | Input.Password | 密码输入框 |
| textarea | Input.TextArea | 多行文本 |
| input-number | InputNumber | - |
| select | Select | 使用 `options` prop |
| radio | Radio | - |
| radio-group | Radio.Group | - |
| switch | Switch | - |
| table | Table | :dataSource, :columns |
| modal | Modal | - |
| drawer | Drawer | - |
| form | Form | - |
| form-item | Form.Item | - |
| space | Space | - |
| flex | Flex | 弹性布局容器 |
| row | Row | 栅格行 |
| col | Col | 栅格列 |
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
| spin | Spin | 加载中 |
| skeleton | Skeleton | 骨架屏 |
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
| qr-code | QRCode | 二维码 |
| watermark | Watermark | 水印 |
| upload | Upload | - |
| tree | Tree | - |
| tree-select | TreeSelect | - |
| transfer | Transfer | - |
| result | Result | 结果页 |
| empty | Empty | 空状态 |
| statistic | Statistic | 统计数值 |
| segmented | Segmented | - |
| anchor | Anchor | 锚点 |
| mentions | Mentions | - |
| auto-complete | AutoComplete | - |
| float-button | FloatButton | 悬浮按钮 |
| tour | Tour | 引导 |
| affix | Affix | - |
| config-provider | ConfigProvider | 全局配置 |
| layout | Layout | 布局容器 |
| layout-header | Layout.Header | - |
| layout-sider | Layout.Sider | - |
| layout-content | Layout.Content | - |
| layout-footer | Layout.Footer | - |

---

## 组件映射原则

- 未在映射表中列出的组件名，按**直接透传**规则处理
- 示例：`{ "component": "Watermark" }` → `<Watermark>`
- Ant Design 组件名使用 PascalCase，props 使用 camelCase

---

## props 映射

props 键名使用 camelCase。

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

### text 映射

`props.text` 映射到组件的 **children**。

```json
{ "props": { "text": "确认删除" } }
```

```tsx
<Button>确认删除</Button>
<Checkbox>确认删除</Checkbox>
```

如果组件不支持 children 文本（如 `<Input />`），AI 应忽略 `text` 并改用 `placeholder` 等对应属性。

### size 映射

| UISchema 值 | Ant Design 值 |
|-------------|---------------|
| small | small |
| middle / default | middle |
| large | large |

---

## events 映射

通用事件名映射为 React 的 `onXxx` 语法：

| 通用事件名 | Ant Design |
|-----------|------------|
| click | onClick |
| change | onChange |
| input | onChange |
| blur | onBlur |
| focus | onFocus |
| submit | onSubmit |
| open | onOpen (或 onOpenChange) |
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

事件处理函数可在组件内定义：

```tsx
const handleSubmit = () => {
  // ...
};
```

---

## bindings 映射

React 没有 v-model，bindings 映射为 `value` + `onChange` 模式：

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

AI 应生成对应的 `useState` 或 `useReducer` 声明：

```tsx
import { useState } from 'react';

const [formData, setFormData] = useState({ username: '' });
```

### 常见组件的绑定模式

| UISchema 组件 | 绑定模式 |
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

## style 映射

style 对象映射为 React 的 `style` prop（camelCase CSS 属性）：

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

## layout 映射

layout 属性映射为 CSS Flex 布局实现：

| layout 属性 | 等效 CSS |
|-------------|----------|
| justify-self: flex-end | marginLeft: auto |
| justify-self: flex-start | 默认行为 |
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

也可使用 Ant Design 的 `<Flex>` 组件：

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

## 示例

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

### Checkbox with binding

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

### Select with options

Ant Design 的 Select 通过 `options` prop 传入选项数组。

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

### Table with columns

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

## 完整示例（Web 框架目标）

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

### 生成结果

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

## 导入约定

生成代码时应包含必要的 import 语句：

```tsx
import React from 'react';
import { Button, Input, Checkbox, Select, Space, Table, Modal, Form, message } from 'antd';
```

图标需从 `@ant-design/icons` 导入：

```tsx
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
```

---

## 生成代码格式

- 使用 TypeScript（`.tsx`）
- 函数组件 + hooks
- 事件处理函数在组件内部定义
- 样式使用 inline style 或 CSS module
