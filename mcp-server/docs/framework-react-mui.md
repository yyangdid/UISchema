# UISchema Adapter: React + Material UI

## Overview

This document defines the mapping rules from UISchema to React + Material UI (MUI).

Adapter Versions:

- React 19.x
- Material UI v9+

Reference: https://mui.com/material-ui/llms.txt

---

## Component Mapping

| UISchema | Material UI | Description |
|----------|-------------|------|
| page | `<Box sx={{ width:'100vw', height:'100vh' }}>` | Full-screen page container |
| button | Button | variant: text (default) / contained / outlined |
| checkbox | Checkbox | - |
| checkbox-group | FormGroup + Checkbox | - |
| input | TextField | variant: outlined (default) / filled / standard |
| input-search | TextField + InputAdornment | Requires manual composition |
| input-password | TextField type="password" | - |
| textarea | TextField multiline | - |
| input-number | TextField type="number" | - |
| select | Select + MenuItem | - |
| radio-group | RadioGroup + FormControlLabel | - |
| switch | Switch | - |
| table | Table + TableBody + TableCell etc. | MUI Table is composable |
| dialog | Dialog | - |
| drawer | Drawer | - |
| form | Box component="form" | - |
| form-item | FormControl + FormLabel | - |
| space | Stack | spacing prop controls gap |
| flex | Stack direction prop | + Box for flex |
| stack | Stack | Same as space |
| box | Box | Generic container |
| container | Container | Centered container |
| grid | Grid | Grid system |
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
| spin | CircularProgress | Loading spinner |
| skeleton | Skeleton | - |
| collapse | Collapse | - |
| tooltip | Tooltip | - |
| popover | Popover | - |
| date-picker | DatePicker (@mui/x-date-pickers) | Requires extra package |
| time-picker | TimePicker (@mui/x-date-pickers) | Requires extra package |
| slider | Slider | - |
| rating | Rating | - |
| typography | Typography | variant: h1-h6 / body1 / body2 |
| typography-title | Typography variant="h1"-"h6" | - |
| typography-text | Typography variant="body1" | - |
| image | Box + img | - |
| upload | Button + native input | - |
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

## Component Mapping Principles

- Component names not listed in the mapping table follow the **passthrough** rule.
- Material UI component names use PascalCase, props use camelCase
- Some MUI components are "composable" (e.g. Table consists of multiple child components), AI should generate the full structure

---

## Props Mapping

Props keys use camelCase.

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

### Text Mapping

`props.text` maps to the component's **children**.

```json
{ "props": { "text": "确认删除" } }
```

```tsx
<Button>确认删除</Button>
<Chip label="确认删除" />
```

For components that use the `label` prop (such as Chip), `text` maps to `label`.

### Size Mapping

| UISchema Value | MUI Value |
|-------------|--------|
| small | small |
| middle / default | medium |
| large | large |

### Variant Mapping

Button's variant in UISchema uses `props.variant`:
- `"contained"` → Solid button (like Element Plus primary)
- `"outlined"` → Outlined button
- `"text"` → Text button (default)

### Color Mapping

UISchema `props.color` → MUI color prop:
- `primary` / `secondary` / `success` / `error` / `info` / `warning`

---

## Events Mapping

| Common Event Name | Material UI |
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

## Bindings Mapping

MUI uses the `value` + `onChange` pattern:

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

### Common Component Binding Patterns

| UISchema Component | MUI Binding Pattern |
|--------------|-------------|
| input / textfield | value + onChange(e.target.value) |
| select | value + onChange(e.target.value) |
| checkbox | checked + onChange(e.target.checked) |
| switch | checked + onChange(e.target.checked) |
| radio-group | value + onChange(e.target.value) |
| slider | value + onChange(event, value) |
| rating | value + onChange(event, value) |
| autocomplete | value + onChange(event, newValue) |

AI should generate corresponding `useState` declarations:

```tsx
import { useState } from 'react';

const [formData, setFormData] = useState({ username: '' });
```

---

## Style Mapping

The style object maps to React's `style` prop or MUI's `sx` prop:

```json
{
  "style": {
    "width": "200px",
    "color": "#f00"
  }
}
```

```tsx
// Approach 1: sx prop (recommended, supports theme)
<Box sx={{ width: '200px', color: '#f00' }}>

// Approach 2: style prop
<Box style={{ width: '200px', color: '#f00' }}>
```

---

## Layout Mapping

Layout attributes map to CSS Flexbox:

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
<Box sx={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
```

You can also use MUI's `<Stack>` layout container:

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

## Examples

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

### Checkbox with Binding

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

### TextField with Binding

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

### Select with Options

MUI's Select uses `MenuItem` child elements to define options.

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

## Import Conventions

MUI supports two import approaches:

```tsx
// Approach 1: Per-component imports (recommended)
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Approach 2: Bulk imports
import { Button, TextField, Select, MenuItem, Stack, Box } from '@mui/material';
```

Icons should be imported from `@mui/icons-material`:

```tsx
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
```

Date pickers require the additional `@mui/x-date-pickers` package:

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
```

---

## Generated Code Format

- Use TypeScript (`.tsx`)
- Function components + hooks
- Prefer the `sx` prop for styling (supports theme variables)
- Event handlers defined inside the component