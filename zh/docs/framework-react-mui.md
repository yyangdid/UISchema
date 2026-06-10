# UISchema 适配：React + Material UI

## 概述

本文档定义 UISchema 到 React + Material UI (MUI) 的映射规则。

适配版本：

- React 19.x
- Material UI v9+

参考来源：https://mui.com/material-ui/llms.txt

---

## 组件映射

| UISchema | Material UI | 说明 |
|----------|-------------|------|
| page | `<Box sx={{ width:'100vw', height:'100vh' }}>` | 全屏页面容器 |
| button | Button | variant: text（默认）/ contained / outlined |
| checkbox | Checkbox | - |
| checkbox-group | FormGroup + Checkbox | - |
| input | TextField | variant: outlined（默认）/ filled / standard |
| input-search | TextField + InputAdornment | 需自行组合 |
| input-password | TextField type="password" | - |
| textarea | TextField multiline | - |
| input-number | TextField type="number" | - |
| select | Select + MenuItem | - |
| radio-group | RadioGroup + FormControlLabel | - |
| switch | Switch | - |
| table | Table + TableBody + TableCell 等 | MUI Table 为组合式 |
| dialog | Dialog | - |
| drawer | Drawer | - |
| form | Box component="form" | - |
| form-item | FormControl + FormLabel | - |
| space | Stack | spacing prop 控制间距 |
| flex | Stack direction prop | + Box for flex |
| stack | Stack | 同 space |
| box | Box | 通用容器 |
| container | Container | 居中容器 |
| grid | Grid | 栅格系统 |
| card | Card | CardContent / CardActions |
| card-content | CardContent | - |
| card-actions | CardActions | - |
| tag / chip | Chip | - |
| badge | Badge | - |
| avatar | Avatar | - |
| pagination | Pagination | - |
| divider | Divider | - |
| menu | Menu + MenuItem | - |
| tabs | Tabs + Tab | - |
| breadcrumb | Breadcrumbs | - |
| steps | Stepper + Step | - |
| dropdown | Menu | - |
| alert | Alert | - |
| progress | CircularProgress / LinearProgress | - |
| progress-circular | CircularProgress | - |
| progress-linear | LinearProgress | - |
| spin | CircularProgress | 加载中 |
| skeleton | Skeleton | - |
| collapse | Collapse | - |
| tooltip | Tooltip | - |
| popover | Popover | - |
| date-picker | DatePicker（@mui/x-date-pickers） | 需额外包 |
| time-picker | TimePicker（@mui/x-date-pickers） | 需额外包 |
| slider | Slider | - |
| rating | Rating | - |
| typography | Typography | variant: h1-h6 / body1 / body2 |
| typography-title | Typography variant="h1"-"h6" | - |
| typography-text | Typography variant="body1" | - |
| image | Box + img | - |
| upload | Button + 原生 input | - |
| transfer-list | TransferList | @mui/material |
| autocomplete | Autocomplete | - |
| speed-dial | SpeedDial | - |
| toggle-button | ToggleButton / ToggleButtonGroup | - |
| icon-button | IconButton | - |
| button-group | ButtonGroup | - |
| list | List + ListItem | - |
| list-item | ListItem | - |
| list-item-text | ListItemText | - |
| list-item-icon | ListItemIcon | - |
| bottom-navigation | BottomNavigation | - |
| app-bar | AppBar + Toolbar | - |
| snackbar | Snackbar | - |
| backdrop | Backdrop | - |

---

## 组件映射原则

- 未在映射表中列出的组件名，按**直接透传**规则处理
- Material UI 组件名使用 PascalCase，props 使用 camelCase
- MUI 中部分组件是"组合式"的（如 Table 由多个子组件协同工作），AI 应生成完整结构

---

## props 映射

props 键名使用 camelCase。

```json
{
  "component": "button",
  "props": {
    "variant": "contained",
    "color": "primary",
    "size": "small",
    "text": "保存"
  }
}
```

```tsx
<Button variant="contained" color="primary" size="small">保存</Button>
```

### text 映射

`props.text` 映射到组件的 **children**。

```json
{ "props": { "text": "确认删除" } }
```

```tsx
<Button>确认删除</Button>
<Chip label="确认删除" />
```

对于 Chip 等使用 `label` prop 的组件，`text` 映射到 `label`。

### size 映射

| UISchema 值 | MUI 值 |
|-------------|--------|
| small | small |
| middle / default | medium |
| large | large |

### variant 映射

Button 的 variant 在 UISchema 中使用 `props.variant`：
- `"contained"` → 实心按钮（相当于 Element Plus 的 primary）
- `"outlined"` → 描边按钮
- `"text"` → 文本按钮（默认）

### color 映射

UISchema `props.color` → MUI color prop：
- `primary` / `secondary` / `success` / `error` / `info` / `warning`

---

## events 映射

| 通用事件名 | Material UI |
|-----------|-------------|
| click | onClick |
| change | onChange |
| input | onChange |
| blur | onBlur |
| focus | onFocus |
| submit | onSubmit |
| close | onClose |
| open | onOpen |

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

---

## bindings 映射

MUI 使用 `value` + `onChange` 模式：

```json
{
  "bindings": {
    "value": "formData.username"
  }
}
```

```tsx
<TextField
  value={formData.username}
  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
/>
```

### 常见组件的绑定模式

| UISchema 组件 | MUI 绑定模式 |
|--------------|-------------|
| input / textfield | value + onChange(e.target.value) |
| select | value + onChange(e.target.value) |
| checkbox | checked + onChange(e.target.checked) |
| switch | checked + onChange(e.target.checked) |
| radio-group | value + onChange(e.target.value) |
| slider | value + onChange(event, value) |
| rating | value + onChange(event, value) |
| autocomplete | value + onChange(event, newValue) |

AI 应生成对应的 `useState` 声明：

```tsx
import { useState } from 'react';

const [formData, setFormData] = useState({ username: '' });
```

---

## style 映射

style 对象映射为 React 的 `style` prop 或 MUI 的 `sx` prop：

```json
{
  "style": {
    "width": "200px",
    "color": "#f00"
  }
}
```

```tsx
// 方式一：sx prop（推荐，支持主题）
<Box sx={{ width: '200px', color: '#f00' }}>

// 方式二：style prop
<Box style={{ width: '200px', color: '#f00' }}>
```

---

## layout 映射

layout 属性映射为 CSS Flex 布局：

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
<Box sx={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
```

也可使用 MUI 的 `<Stack>` 布局容器：

```json
{
  "component": "stack",
  "props": {
    "direction": "row",
    "spacing": 2,
    "justifyContent": "flex-end",
    "alignItems": "flex-end"
  },
  "children": []
}
```

```tsx
<Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-end">
  {/* children */}
</Stack>
```

---

## 示例

### Button

```json
{
  "component": "button",
  "props": { "variant": "contained", "color": "primary", "size": "small", "text": "保存" },
  "events": { "click": "handleSave" }
}
```

```tsx
<Button variant="contained" color="primary" size="small" onClick={handleSave}>保存</Button>
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
<Checkbox
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
<span>同意协议</span>
```

### TextField with binding

```json
{
  "component": "input",
  "props": { "label": "用户名", "placeholder": "请输入用户名" },
  "bindings": { "value": "formData.username" }
}
```

```tsx
<TextField
  label="用户名"
  placeholder="请输入用户名"
  value={formData.username}
  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
/>
```

### Select with options

MUI 的 Select 通过 `MenuItem` 子元素定义选项。

```json
{
  "component": "select",
  "props": { "label": "角色" },
  "bindings": { "value": "formData.role" },
  "children": [
    { "component": "menu-item", "props": { "value": "admin", "text": "管理员" } },
    { "component": "menu-item", "props": { "value": "user", "text": "普通用户" } }
  ]
}
```

```tsx
<Select
  label="角色"
  value={formData.role}
  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
>
  <MenuItem value="admin">管理员</MenuItem>
  <MenuItem value="user">普通用户</MenuItem>
</Select>
```

### Dialog (Modal)

```json
{
  "component": "dialog",
  "props": { "title": "确认删除" },
  "bindings": { "open": "dialogOpen" },
  "events": { "close": "handleDialogClose" },
  "children": [
    { "component": "dialog-content", "props": { "text": "确定要删除此项吗？" } },
    {
      "component": "dialog-actions",
      "children": [
        { "component": "button", "props": { "text": "取消" }, "events": { "click": "handleCancel" } },
        { "component": "button", "props": { "text": "确认", "variant": "contained" }, "events": { "click": "handleConfirm" } }
      ]
    }
  ]
}
```

```tsx
<Dialog open={dialogOpen} onClose={handleDialogClose}>
  <DialogTitle>确认删除</DialogTitle>
  <DialogContent>确定要删除此项吗？</DialogContent>
  <DialogActions>
    <Button onClick={handleCancel}>取消</Button>
    <Button variant="contained" onClick={handleConfirm}>确认</Button>
  </DialogActions>
</Dialog>
```

### Table

```json
{
  "component": "table",
  "props": { "stickyHeader": true },
  "bindings": { "data": "rows" },
  "children": [
    { "component": "table-head", "children": [
      { "component": "table-row", "children": [
        { "component": "table-cell", "props": { "text": "姓名" } },
        { "component": "table-cell", "props": { "text": "年龄" } }
      ]}
    ]},
    { "component": "table-body", "children": [
      { "component": "table-row", "children": [
        { "component": "table-cell", "props": { "text": "张三" } },
        { "component": "table-cell", "props": { "text": "28" } }
      ]}
    ]}
  ]
}
```

```tsx
<Table stickyHeader>
  <TableHead>
    <TableRow>
      <TableCell>姓名</TableCell>
      <TableCell>年龄</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.age}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 导入约定

MUI 支持两种导入方式：

```tsx
// 方式一：按需导入（推荐）
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// 方式二：批量导入
import { Button, TextField, Select, MenuItem, Stack, Box } from '@mui/material';
```

图标从 `@mui/icons-material` 导入：

```tsx
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
```

日期选择器需要额外安装 `@mui/x-date-pickers`：

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
```

---

## 生成代码格式

- 使用 TypeScript（`.tsx`）
- 函数组件 + hooks
- 样式优先使用 `sx` prop（支持主题变量）
- 事件处理函数在组件内部定义
