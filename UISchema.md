# UI Schema Specification

## Version

v1.0.2

## Overview

UI Schema is a **JSON-based**, **framework-agnostic** interface description format used to provide structured page definitions to AI.

AI should automatically generate target framework code based on the UI Schema.

Design goals of UI Schema:

1. Use standard JSON format
2. Clear structure, easy for AI to understand
3. Stay as close to front-end development concepts as possible
4. Support component tree structure
5. Support separation of layout, style, and properties
6. Support business descriptions and design constraints
7. Support cross-library component mapping
8. Easy to extend

---

# Standard Node Structure

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

| Field     | Required | Description |
|----------|----------|-------------|
| component | Yes      | Component identifier, mapped to a concrete component by the framework adapter layer |
| meta     | No       | AI notes, design intent, business constraints (not involved in rendering) |
| props    | No       | Component properties, mapped by the framework adapter layer |
| events   | No       | Component event bindings |
| bindings | No       | Data bindings (see bindings chapter for details) |
| style    | No       | Visual appearance properties (syntax defined by the framework adapter layer) |
| layout   | No       | Positioning rules within the parent container (syntax defined by the framework adapter layer) |
| children | No       | List of child components |

---

# UISchema Indentation Syntax (Optional)

In addition to JSON, UI Schema also supports **indentation syntax** for easy manual authoring. AI should understand both formats equally.

## Syntax Reference

| Syntax | Meaning | Example |
|--------|---------|---------|
| `ComponentName` | component | `button` |
| `"text"` | props.text | `"Save"` |
| `[key=val, …]` | props (inline) | `[type=primary, size=small]` |
| `.layout <position>` | Layout shorthand | `.layout bottom-right` |
| `.layout k=v, …` | Exact layout | `.layout justify-self=flex-end` |
| `.style k=v, …` | Style properties | `.style color=#f00, width=200` |
| `.click <function>` | Event | `.click handleSave` |
| `.eventName <function>` | Event | `.change onInput` |
| `.eventName:subEvent <function>` | Event with modifier | `.change:size handleSizeChange` |
| `.bind <key>=<path>` | Data binding | `.bind value=formData.name` |
| `.meta <description>` | Description (multi-line supported) | `.meta This is the submit button` |
| `.tags <word, …>` | meta.tags | `.tags form, checkbox` |
| `.remark <text>` | meta.remarks | `.remark Keep aligned` |
| Indent | children hierarchy | 4-space indent = child element |

## Example Comparison

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

Equivalent JSON:

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

## Detailed Rules

### Component Name

The first word of each line is `component`:

```
button                      → component: "button"
input                       → component: "input"
table                       → component: "table"
form                        → component: "form"
```

### Text

Content enclosed in double quotes sets `props.text`:

```
button "Save"               → props: { "text": "Save" }
checkbox "Agree to terms"   → props: { "text": "Agree to terms" }
```

### Inline Props

`[key=val, …]` syntax:

```
button "Submit" [type=primary, size=small]
                            → props: { "text": "Submit", "type": "primary", "size": "small" }
input [placeholder=Please enter]
                            → props: { "placeholder": "Please enter" }
```

Boolean values use bare words:

```
table [border, stripe]      → props: { "border": true, "stripe": true }
```

#### `[flex]` Special Shorthand

`[flex]` is a shorthand for `display: flex`, equivalent to setting flex in style:

```
page [flex, padding=10]
    → style: { "display": "flex", "padding": "10" }
```

Common shorthands:

| Shorthand | Equivalent to |
|-----------|---------------|
| `[flex]` | `style.display = "flex"` |
| `[flex, direction=row]` | `style.display = "flex"` + `style.flexDirection = "row"` |

### Layout Shorthand Positions

`.layout <position>` maps to justify-self + align-self:

| Shorthand | justify-self | align-self |
|-----------|-------------|------------|
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

### Exact Layout

`.layout k=v, k=v`:

```
.layout justify-self=flex-end, align-self=flex-end
                            → layout: { "justify-self": "flex-end", "align-self": "flex-end" }
.layout grid-row=1, grid-column=2
                            → layout: { "grid-row": "1", "grid-column": "2" }
```

### Style

`.style k=v, k=v`:

```
.style color=#f00, width=200
                            → style: { "color": "#f00", "width": "200" }
```

Style property names use **native CSS property names** (kebab-case). AI converts to the corresponding format based on the target framework adapter layer's rules:

| Indent Syntax | JSON style | Web Framework Output | XAML Output |
|--------------|------------|---------------------|-------------|
| `.style color=#f00` | `"color": "#f00"` | `color: #f00` | `Foreground="#f00"` |
| `.style font-size=14` | `"font-size": "14"` | `font-size: 14px` | `FontSize="14"` |
| `.style margin=10` | `"margin": "10"` | `margin: 10px` | `Margin="10"` |

### Events

`.eventName functionName`:

```
.click handleSave           → events: { "click": "handleSave" }
.change onInput             → events: { "change": "onInput" }
```

Supports **sub-event modifiers**, separated by a colon, applicable when a component has multiple similar events:

```
.change:size handleSizeChange
                            → events: { "change-size": "handleSizeChange" }
                            → framework adapter maps to size-change

.change:current handleCurrentChange
                            → events: { "change-current": "handleCurrentChange" }
                            → framework adapter maps to current-change
```

### Data Binding

`.bind key=path`:

```
.bind value=formData.name   → bindings: { "value": "formData.name" }
.bind checked=agreed        → bindings: { "checked": "agreed" }
```

### Description

`.meta <text>` maps to multiple `meta` fields, supports multi-line:

```
.meta This is a checkbox for user agreement confirmation.
    Located in the first row of the form, unchecked by default.
    .tags form, checkbox, agreement
    .remark Keep aligned to bottom-right
    .remark Button order must not be adjusted
```

Rules:

| Prefix | Mapping | Description |
|--------|---------|-------------|
| `.meta` first line + subsequent indented lines (no new prefix) | meta.description | Multi-line auto concatenation |
| `.tags <word, word, …>` | meta.tags | Comma separated |
| `.remark <text>` | meta.remarks[] | Can appear multiple times, one entry per line |

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

### Child Components

Indentation indicates child component hierarchy. One level of indent = child of the current component:

```
space [size=middle]
    button "Confirm"         → space.children[0] = { button... }
    button "Cancel"          → space.children[1] = { button... }
```

Multi-level nesting:

```
page
    card "User Info"
        form
            form-item "Username"
                input [placeholder=Please enter]
```

## Comprehensive Example

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

Represents the component type, for example:

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

meta is used to store semantic descriptions, design intent, and constraint information.

meta is not involved in page rendering.

Recommended structure:

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

Component description.

```json
{
  "meta": {
    "description": "User agreement confirmation checkbox"
  }
}
```

## tags

Component tags.

```json
{
  "meta": {
    "tags": ["form", "checkbox", "agreement"]
  }
}
```

## remarks

Additional notes.

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

Custom fields are allowed:

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

Component properties.

```json
{
  "component": "button",
  "props": {
    "type": "primary",
    "size": "small"
  }
}
```

Text is uniformly specified as:

```json
{
  "props": {
    "text": "Save"
  }
}
```

Mapping rule: `props.text` should map to the target component's **default slot**.

```vue
<el-button>Save</el-button>
<el-checkbox>Agree to terms</el-checkbox>
```

If a component does not support default slot text (e.g., `<el-input />`), AI should ignore the `text` property.

---

# events

Component event bindings.

```json
{
  "component": "button",
  "events": {
    "click": "handleSubmit"
  }
}
```

events use **generic event names**, mapped to the syntax of each framework by the framework adapter layer:

| Generic Event Name | Meaning |
|-------------------|---------|
| click | Click |
| change | Value change |
| input | Input |
| blur | Lose focus |
| focus | Gain focus |
| submit | Form submit |
| open | Open |
| close | Close |

Event function names are generated by AI. AI should declare the corresponding functions in the generated source code.

---

# bindings

Data bindings.

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

bindings is an object where keys are binding targets and values are data paths.

The framework adapter layer converts bindings to the corresponding data binding syntax:

| Framework | Output Example |
|-----------|----------------|
| Vue | v-model="formData.username" |
| React | value={formData.username} onChange={...} |
| Avalonia | Text="{Binding username}" |

AI should declare the corresponding data variables in the generated source code.

---

# style

Visual appearance properties.

```json
{
  "style": {
    "width": "200px",
    "color": "#f00"
  }
}
```

The syntax of style is defined by the target framework's adapter layer:
- **Web frameworks** (Vue / React / HTML): use CSS properties
- **XAML frameworks** (Avalonia): use dependency property names

---

# layout

Positioning rules for a component within its parent container.

```json
{
  "layout": {
    "justify-self": "flex-end",
    "align-self": "flex-end"
  }
}
```

Note:

- style represents the component's own appearance
- layout represents positioning rules within the parent container

The syntax of layout is defined by the target framework's adapter layer:
- **Web frameworks**: use Flex layout properties (justify-self / align-self, etc.)
- **XAML frameworks**: use Grid.Row / Grid.Column / HorizontalAlignment, etc.

---

# children

Component tree structure.

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

# Page Component

page represents the **top-level container** (page / window / screen).

The default dimensions of page are defined by the framework adapter layer:
- **Web frameworks**: default 100vw × 100vh
- **XAML frameworks**: default fills the window or parent container

If the UI Schema is used within a dialog, drawer, or other non-top-level container, AI should not generate a page node. The appropriate container component (dialog / drawer) should be used as the root node.

The dimensions of page can be overridden via style:

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

# Web Framework Layout Model

The following specification applies only to **Web frameworks** (Vue / React / HTML + CSS).

## Flex Layout

```json
{
  "style": {
    "display": "flex"
  }
}
```

Supports:

```json
{
  "style": {
    "display": "flex",
    "flex-direction": "row",
    "gap": "10px"
  }
}
```

### Container-level Flex Properties

The parent container's Flex layout properties (justify-content, align-items, flex-direction, flex-wrap, gap) are uniformly placed in the parent node's style.

Incorrect:

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

Correct:

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

### flex Shorthand

Supports flex-grow / flex-shrink / flex-basis shorthand:

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

### justify-self and align-self

```json
{
  "layout": {
    "justify-self": "flex-end",
    "align-self": "flex-end"
  }
}
```

Note:

- justify-self: self-alignment along the main axis
- align-self: self-alignment along the cross axis

Although `justify-self` does not exist in the CSS Flexbox standard, AI should convert it to an equivalent implementation.

#### justify-self Conversion Rules

| flex-direction | justify-self Value | Equivalent CSS | Description |
|----------------|-------------------|----------------|-------------|
| row (default) | flex-end | margin-left: auto | Push to the right of the container |
| row (default) | flex-start | Default behavior, no conversion needed | Stay on the left |
| row (default) | center | No pure CSS equivalent | Requires wrapper container |
| column | flex-end | margin-top: auto | Push to the bottom of the container |
| column | flex-start | Default behavior, no conversion needed | Stay at the top |
| column | center | No pure CSS equivalent | Requires wrapper container |
| row-reverse | flex-end | margin-right: auto | Push to the left of the container |
| column-reverse | flex-end | margin-bottom: auto | Push to the top of the container |

For `center` cases, AI should generate a helper container wrapping the child node, and use `justify-content: center` on the helper container.

#### align-self Conversion Rules

align-self is a standard CSS property. Map according to the standard.

| align-self Value | Description |
|-----------------|-------------|
| flex-start | Align to the start of the cross axis |
| flex-end | Align to the end of the cross axis |
| center | Align to the center of the cross axis |
| stretch | Stretch to fill the cross axis (default) |

---

# XAML Framework Layout Model

The following specification applies only to **XAML frameworks** (Avalonia).

## Panel Layout

XAML frameworks use Panel containers (StackPanel / Grid / DockPanel) to manage layout.

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

## Grid Layout

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

# Framework Adapters

The UI Schema core specification is framework-agnostic. Component mappings, code generation conventions, and examples for each target framework are documented in separate adapter documents:

| Framework | Adapter Document |
|-----------|-----------------|
| Vue3 + Element Plus | `docs/framework-vue-element-plus.md` |
| Vue3 + Antdv Next | `docs/framework-vue-antdv-next.md` |
| React + Ant Design | `docs/framework-react-antd.md` |
| React + Material UI | `docs/framework-react-mui.md` |
| Avalonia UI | `docs/framework-avalonia.md` |

## Component Mapping Principles

- The mapping table only records components with naming differences
- Unregistered component names follow the **direct pass-through** rule: `{ "component": "switch" }` → the component with the same name in the target framework

---

# Common Component Examples

The following examples demonstrate core UI Schema syntax. See the framework adapter documents for specific output.

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

## Input with Binding

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

# AI Code Generation Rules

1. Strictly preserve the children component hierarchy
2. Prioritize preserving layout intent
3. Prefer using the component library's native capabilities
4. Map style according to the framework adapter layer
5. Map props according to the framework adapter layer
6. meta is used only as semantic enhancement information
7. Preserve meta information
8. remarks can be used as design constraints
9. Conflict priority: Props > Style > Layout > Meta
10. Event handler functions generated from events must be declared in the source code
11. Data paths bound in bindings must have corresponding variables declared in the source code

### Conflict Priority Example

When the same CSS property appears in both props and style, props takes priority:

```json
{
  "props": { "width": "100px" },
  "style": { "width": "200px" }
}
// → AI prioritizes props.width (100px)
```

In general, the semantics of props and style do not overlap, so conflicts are rare.

---

# Layout Container Components

In addition to page and space, UI Schema also supports the following layout containers:

## Row / Col (Grid System)

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

Generates the target framework's Card component. The `header` property maps to the framework's title property.

## Container Layout

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

# Table Column Definition

Table columns are defined via `column` child components:

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

# Form Structure

form and form-item work together to implement form layout:

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

# Patch Incremental Modification

For existing pages, the `patch` syntax can be used to describe incremental modifications without rewriting the complete UI Schema.

## Syntax

```
patch <operation> <selector>
    <new component>
```

| Operation | Description |
|-----------|-------------|
| `after <selector>` | Insert after the matched element |
| `before <selector>` | Insert before the matched element |
| `replace <selector>` | Replace the matched element |
| `remove <selector>` | Remove the matched element |
| `append <selector>` | Append inside the matched element |
| `prepend <selector>` | Prepend inside the matched element |

## Selectors

| Selector | Description |
|----------|-------------|
| `form` | Match the first component named form |
| `form-item` | Match the first form-item |
| `card[2]` | The 2nd card (1-indexed) |
| `card[last]` | The last card |
| `card[header=User List]` | Match card by header property |
| `form > form-item` | Direct child form-item of form |
| `form > form-item[2]` | The 2nd form-item of form (1-indexed) |
| `card[2] > table` | The table inside the 2nd card |
| `page > form` | Direct child form of page |
| `.layout bottom-right` | Match by layout position |
| `component[prop=value]` | Match by any property value |

## Example

**Existing page:**

```
page [flex, padding=10]
    checkbox "复选框" [size=small]
        .layout top-left
    space [size=middle]
        .layout bottom-right
        button "确定" [size=small]
        button "取消" [size=small, type=primary]
```

**Incremental modification:**

```patch
# Insert a search box before space
patch before space
    input [placeholder=Search...]
        .bind value=search.keyword

# Prepend a reset button at the beginning of space
patch prepend space
    button "Reset" [size=small]

# Insert an Apply button between Confirm and Cancel
patch after space > button[1]
    button "应用" [size=small]
        .click handleApply

# Add an input after the checkbox
patch after checkbox
    input [placeholder=Please enter note]
        .bind value=form.remark

# Remove the Cancel button
patch remove space > button[2]
```

**Equivalent complete UI Schema:**

```
page [flex, padding=10]
    checkbox "复选框" [size=small]
        .layout top-left
    input [placeholder=Please enter note]
        .bind value=form.remark
    input [placeholder=Search...]
        .bind value=search.keyword
    space [size=middle]
        .layout bottom-right
        button "Reset" [size=small]
        button "确定" [size=small]
        button "应用" [size=small]
            .click handleApply
```

## JSON Format Patch

Patches can also be written in JSON:

```json
{
  "patch": [
    { "op": "before", "selector": "space", "children": [
      { "component": "input", "props": { "placeholder": "Search..." }, "bindings": { "value": "search.keyword" } }
    ]},
    { "op": "prepend", "selector": "space", "children": [
      { "component": "button", "props": { "text": "Reset", "size": "small" } }
    ]},
    { "op": "after", "selector": "space > button[1]", "children": [
      { "component": "button", "props": { "text": "应用", "size": "small" }, "events": { "click": "handleApply" } }
    ]},
    { "op": "after", "selector": "checkbox", "children": [
      { "component": "input", "props": { "placeholder": "Please enter note" }, "bindings": { "value": "form.remark" } }
    ]},
    { "op": "remove", "selector": "space > button[2]" }
  ]
}
```

AI should merge patches into the existing UI Schema before generating the final code.

---

# Complete Example

The following example demonstrates the mapping process from an abstract UI Schema description to multi-framework code. The same definition is provided in both **JSON** and **indent** formats. AI should understand both equally.

### JSON Format

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

### Indented Format

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

### Vue + Element Plus Generated Output

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

### React + Ant Design Generated Output

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

### Vue + Antdv Next Generated Output

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

### React + Material UI Generated Output

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

### Avalonia UI Generated Output

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

Expected Layout:

```text
┌─────────────────────────────────────┐
│ ☐ 复选框                            │
│                                      │
│                                      │
│            [确定] [取消] [应用]      │
└─────────────────────────────────────┘
```
