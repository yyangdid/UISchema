# UISchema Adapter: Avalonia UI

## Overview

This document defines the mapping rules from UISchema to Avalonia UI.

Avalonia is a cross-platform .NET UI framework that uses XAML (AXAML) to define interfaces, supporting Windows, macOS, Linux, iOS, Android, and WebAssembly.

Adapter Versions:

- .NET 10+
- Avalonia 12.x

Reference: https://docs.avaloniaui.net/, Avalonia MCP

---

## Key Differences (Compared to Web Frameworks)

| Concept | Web Frameworks (Vue/React) | Avalonia UI |
|------|----------------------|-------------|
| UI Language | HTML / JSX | XAML (AXAML) |
| Layout Model | CSS Flex / Grid | StackPanel / Grid / DockPanel |
| Style Syntax | CSS | XAML Styles (Style element) |
| Property Naming | kebab-case / camelCase | **PascalCase** |
| Event Naming | @click / onClick | **Click** (PascalCase) |
| Data Binding | v-model / value+onChange | `{Binding Path}` / `{Binding Path, Mode=TwoWay}` |
| Size Units | px / rem / % | px / `*` (star sizing) / Auto |
| Component Content | children / slot | **Content** property or child elements |

---

## Component Mapping

### Basic Controls

| UISchema | Avalonia | Description |
|----------|----------|------|
| page | Window / UserControl | Window or user control |
| button | Button | Content property |
| text | TextBlock | Read-only text |
| label | Label | Text label |
| input | TextBox | Text property |
| textarea | TextBox AcceptsReturn=True | Multi-line text |
| password-box | TextBox PasswordChar | Password input |
| checkbox | CheckBox | IsChecked property |
| radio-button | RadioButton | IsChecked + GroupName |
| switch | ToggleSwitch | IsChecked |
| select / combo-box | ComboBox | Items + SelectedItem |
| list-box | ListBox | Items + SelectedItem |
| image | Image | Source property |
| slider | Slider | Value / Minimum / Maximum |
| progress-bar | ProgressBar | Value / IsIndeterminate |
| date-picker | DatePicker | SelectedDate |
| time-picker | TimePicker | SelectedTime |
| tooltip | ToolTip | Attached property ToolTip.Tip |
| separator | Separator | Separator line |

### Layout Containers

| UISchema | Avalonia | Description |
|----------|----------|------|
| stack-panel | StackPanel | Orientation + Spacing |
| stack-panel-h | StackPanel Orientation="Horizontal" | Horizontal layout |
| stack-panel-v | StackPanel Orientation="Vertical" | Vertical layout (default) |
| grid | Grid | RowDefinitions + ColumnDefinitions |
| dock-panel | DockPanel | Dock attached property |
| wrap-panel | WrapPanel | Auto-wrapping layout |
| canvas | Canvas | Absolute positioning, Left/Top attached properties |
| border | Border | Background / BorderBrush / CornerRadius |
| scroll-viewer | ScrollViewer | Scrollable container |
| expander | Expander | Header + Content |
| group-box | GroupBox | Group container (GroupBox / Expander) |
| panel | Panel | Basic panel |
| content-control | ContentControl | Content container |

### Data Display

| UISchema | Avalonia | Description |
|----------|----------|------|
| data-grid | DataGrid | Items + Columns (requires DataGrid package) |
| tree-view | TreeView | Items |
| tree-view-item | TreeViewItem | Header |
| menu | Menu | MenuItem collection |
| menu-item | MenuItem | Header + Command |
| context-menu | ContextMenu | Context menu |
| tabs | TabControl | TabItem collection |
| tab-item | TabItem | Header + Content |
| status-bar | StatusBar | Status bar |

### Window and Navigation

| UISchema | Avalonia | Description |
|----------|----------|------|
| window | Window | Title / Content / SizeToContent |
| user-control | UserControl | Reusable user control |
| dialog | Window SizeToContent | Dialog effect |
| split-view | SplitView | Hamburger menu layout |
| carousel | Carousel | Carousel container |

### Shapes and Decorations

| UISchema | Avalonia | Description |
|----------|----------|------|
| rectangle | Rectangle | Fill / Stroke |
| ellipse | Ellipse | Fill / Stroke |
| path-icon | PathIcon | Data property (SVG path) |
| progress-ring | ProgressRing | Ring progress |

---

## Component Mapping Principles

- Component names not listed in the mapping table follow the **passthrough** rule (e.g. `{ "component": "SplitButton" }` → `<SplitButton />`)
- Component names and property names use **PascalCase**
- Layout sizes support `*` (star sizing) and `Auto`

---

## Props Mapping

Props keys use PascalCase.

```json
{
  "component": "button",
  "props": {
    "content": "保存",
    "horizontalAlignment": "Center",
    "verticalAlignment": "Center"
  }
}
```

```xml
<Button Content="保存" HorizontalAlignment="Center" VerticalAlignment="Center" />
```

### Text Mapping

`props.text` maps to the component's `Content` or `Text` property:

| Component | Mapping Target |
|------|---------|
| Button | Content |
| TextBlock | Text |
| Label | Content |
| CheckBox | Content |
| RadioButton | Content |
| ListBoxItem | Content |
| MenuItem | Header |
| TabItem | Header |

```json
{ "component": "button", "props": { "text": "保存" } }
```

```xml
<Button Content="保存" />
```

---

## Events Mapping

Avalonia events use PascalCase event names:

| Common Event Name | Avalonia |
|-----------|----------|
| click | Click |
| change | PropertyChanged (or specific event like TextChanged) |
| text-changed | TextChanged |
| selection-changed | SelectionChanged |
| checked | IsCheckedChanged |
| checked-changed | IsCheckedChanged |
| value-changed | ValueChanged |
| lost-focus | LostFocus |
| got-focus | GotFocus |
| key-down | KeyDown |
| pointer-pressed | PointerPressed |
| pointer-released | PointerReleased |
| closing | Closing (Window) |
| closed | Closed |
| loaded | Loaded |

```json
{
  "events": {
    "click": "OnSaveClick"
  }
}
```

```xml
<Button Content="保存" Click="OnSaveClick" />
```

Event handlers are implemented in the code-behind:

```csharp
private void OnSaveClick(object? sender, RoutedEventArgs e)
{
    // ...
}
```

---

## Bindings Mapping

Avalonia uses XAML data binding syntax through the `{Binding}` markup extension.

### One-Way Binding

```json
{
  "bindings": {
    "text": "ViewModel.Title"
  }
}
```

```xml
<TextBlock Text="{Binding Title}" />
```

### Two-Way Binding (TwoWay)

Avalonia 12 enables **compiled bindings** by default, which requires declaring `x:DataType` on the root element:

```json
{
  "component": "input",
  "props": { "watermark": "请输入用户名" },
  "bindings": {
    "text": "ViewModel.Username"
  }
}
```

```xml
<UserControl
  xmlns="https://github.com/avaloniaui"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  xmlns:vm="using:MyApp.ViewModels"
  x:DataType="vm:MainViewModel"
  x:CompileBindings="True">
  <TextBox
    Watermark="请输入用户名"
    Text="{Binding Username, Mode=TwoWay}"
  />
</UserControl>
```

If compiled bindings are not enabled, the traditional reflection binding `{Binding Username, Mode=TwoWay}` syntax remains the same, without needing `x:DataType`.

### Command Binding

Avalonia uses the Command pattern instead of events:

```json
{
  "component": "button",
  "props": { "text": "保存" },
  "bindings": {
    "command": "ViewModel.SaveCommand"
  }
}
```

```xml
<Button Content="保存" Command="{Binding SaveCommand}" />
```

### Common Binding Patterns

| UISchema bindings Key | Component | Avalonia Syntax |
|---------------------|------|-------------|
| text | TextBox | `{Binding Path, Mode=TwoWay}` |
| text | TextBlock | `{Binding Path}` |
| is-checked | CheckBox / RadioButton | `{Binding Path, Mode=TwoWay}` |
| is-checked | ToggleSwitch | `{Binding Path, Mode=TwoWay}` |
| selected-item | ComboBox / ListBox | `{Binding Path, Mode=TwoWay}` |
| selected-date | DatePicker | `{Binding Path, Mode=TwoWay}` |
| value | Slider | `{Binding Path, Mode=TwoWay}` |
| command | Button / MenuItem | `{Binding Path}` |
| command-parameter | Button / MenuItem | `{Binding Path}` |
| items | ListBox / ComboBox | `{Binding Path}` |
| items-source | DataGrid | `{Binding Path}` |

### ViewModel Convention

AI should generate the corresponding ViewModel (using CommunityToolkit.Mvvm):

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private string _username = string.Empty;

    [RelayCommand]
    private void Save()
    {
        // ...
    }
}
```

---

## Layout Mapping

Avalonia uses the XAML layout system, not CSS. Layout attributes map to positioning properties of layout containers:

| Layout Attribute | Equivalent XAML |
|-------------|----------|
| justify-self: flex-end | HorizontalAlignment="Right" |
| justify-self: flex-start | HorizontalAlignment="Left" |
| justify-self: center | HorizontalAlignment="Center" |
| align-self: flex-start | VerticalAlignment="Top" |
| align-self: flex-end | VerticalAlignment="Bottom" |
| align-self: center | VerticalAlignment="Center" |
| align-self: stretch | VerticalAlignment="Stretch" |

```json
{
  "layout": {
    "justify-self": "flex-end",
    "align-self": "flex-end"
  }
}
```

```xml
<Button
  Content="保存"
  HorizontalAlignment="Right"
  VerticalAlignment="Bottom"
/>
```

### Positioning in Grid Layout

```json
{
  "layout": {
    "grid-row": "1",
    "grid-column": "2",
    "grid-row-span": "2"
  }
}
```

```xml
<Button
  Content="保存"
  Grid.Row="1"
  Grid.Column="2"
  Grid.RowSpan="2"
/>
```

### StackPanel / Grid as Parent Containers

Parent containers in UISchema should map to the corresponding Avalonia panels:

```json
{
  "component": "stack-panel-v",
  "props": { "spacing": "8" },
  "children": []
}
```

```xml
<StackPanel Orientation="Vertical" Spacing="8">
  <!-- children -->
</StackPanel>
```

```json
{
  "component": "grid",
  "props": {
    "columnDefinitions": "Auto,*,Auto",
    "rowDefinitions": "Auto,*"
  },
  "children": []
}
```

```xml
<Grid ColumnDefinitions="Auto,*,Auto" RowDefinitions="Auto,*">
  <!-- children -->
</Grid>
```

---

## Style Mapping

Avalonia style attributes map to direct control properties (PascalCase):

```json
{
  "style": {
    "width": "200",
    "height": "100",
    "margin": "10",
    "padding": "8",
    "background": "#f0f0f0",
    "foreground": "#ff0000",
    "font-size": "14"
  }
}
```

```xml
<Button
  Width="200"
  Height="100"
  Margin="10"
  Padding="8"
  Background="#f0f0f0"
  Foreground="#ff0000"
  FontSize="14"
/>
```

### Style Key Mapping Table

| UISchema style Key | Avalonia Property | Description |
|-------------------|--------------|------|
| width | Width | Numeric value |
| height | Height | Numeric value |
| min-width | MinWidth | - |
| min-height | MinHeight | - |
| max-width | MaxWidth | - |
| max-height | MaxHeight | - |
| margin | Margin | Numeric value or "left,top,right,bottom" |
| padding | Padding | Numeric value or "left,top,right,bottom" |
| background | Background | Color or brush |
| foreground | Foreground | Text color |
| color | Foreground | Text color (alias) |
| border | BorderBrush | Border color |
| border-thickness | BorderThickness | Border width |
| corner-radius | CornerRadius | Corner radius |
| font-size | FontSize | Font size (numeric) |
| font-weight | FontWeight | "Bold" / "Normal" |
| font-style | FontStyle | "Italic" / "Normal" |
| opacity | Opacity | 0-1 |
| cursor | Cursor | Mouse cursor style |
| horizontal-alignment | HorizontalAlignment | "Left"/"Center"/"Right"/"Stretch" |
| vertical-alignment | VerticalAlignment | "Top"/"Center"/"Bottom"/"Stretch" |
| row | Grid.Row | Grid row index |
| column | Grid.Column | Grid column index |
| row-span | Grid.RowSpan | Grid row span |
| column-span | Grid.ColumnSpan | Grid column span |

---

## Examples

### Button

```json
{
  "component": "button",
  "props": { "text": "保存", "horizontalAlignment": "Center" },
  "events": { "click": "OnSaveClick" }
}
```

```xml
<Button Content="保存" HorizontalAlignment="Center" Click="OnSaveClick" />
```

### TextBox with Binding

```json
{
  "component": "input",
  "props": { "watermark": "请输入用户名" },
  "bindings": { "text": "ViewModel.Username" }
}
```

```xml
<TextBox Watermark="请输入用户名" Text="{Binding Username, Mode=TwoWay}" />
```

### CheckBox

```json
{
  "component": "checkbox",
  "props": { "text": "同意协议" },
  "bindings": { "is-checked": "ViewModel.IsAgreed" }
}
```

```xml
<CheckBox Content="同意协议" IsChecked="{Binding IsAgreed, Mode=TwoWay}" />
```

### ComboBox (Select)

```json
{
  "component": "combo-box",
  "props": { "text": "选择角色" },
  "bindings": { "selected-item": "ViewModel.SelectedRole", "items": "ViewModel.Roles" }
}
```

```xml
<ComboBox
  Content="选择角色"
  Items="{Binding Roles}"
  SelectedItem="{Binding SelectedRole, Mode=TwoWay}"
/>
```

### StackPanel Layout

```json
{
  "component": "stack-panel-v",
  "props": { "spacing": "12", "margin": "20" },
  "children": [
    {
      "component": "button",
      "props": { "text": "确定", "horizontalAlignment": "Right" },
      "events": { "click": "OnConfirmClick" }
    },
    {
      "component": "button",
      "props": { "text": "取消", "horizontalAlignment": "Right" },
      "events": { "click": "OnCancelClick" }
    }
  ]
}
```

```xml
<StackPanel Orientation="Vertical" Spacing="12" Margin="20">
  <Button Content="确定" HorizontalAlignment="Right" Click="OnConfirmClick" />
  <Button Content="取消" HorizontalAlignment="Right" Click="OnCancelClick" />
</StackPanel>
```

### Window (Page)

```json
{
  "component": "page",
  "props": {
    "title": "主窗口",
    "width": "800",
    "height": "600"
  },
  "children": []
}
```

```xml
<Window
  xmlns="https://github.com/avaloniaui"
  Title="主窗口"
  Width="800"
  Height="600"
>
  <!-- children -->
</Window>
```

### Grid Layout

```json
{
  "component": "grid",
  "props": {
    "columnDefinitions": "Auto,*,Auto",
    "rowDefinitions": "Auto,*"
  },
  "children": [
    {
      "component": "text",
      "props": { "text": "用户名" },
      "layout": { "grid-row": "0", "grid-column": "0" }
    },
    {
      "component": "input",
      "props": { "watermark": "请输入用户名" },
      "layout": { "grid-row": "0", "grid-column": "1" },
      "bindings": { "text": "ViewModel.Username" }
    }
  ]
}
```

```xml
<Grid ColumnDefinitions="Auto,*,Auto" RowDefinitions="Auto,*">
  <TextBlock Text="用户名" Grid.Row="0" Grid.Column="0" />
  <TextBox
    Watermark="请输入用户名"
    Text="{Binding Username, Mode=TwoWay}"
    Grid.Row="0" Grid.Column="1"
  />
</Grid>
```

---

## Imports and Code Structure

Generated code should include the complete XAML and C# code:

### XAML File (.axaml)

```xml
<UserControl
  xmlns="https://github.com/avaloniaui"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  x:Class="MyApp.Views.MainView">
  <StackPanel Spacing="8">
    <!-- controls -->
  </StackPanel>
</UserControl>
```

### C# Code-Behind

```csharp
using Avalonia.Controls;
using Avalonia.Interactivity;

namespace MyApp.Views;

public partial class MainView : UserControl
{
    public MainView()
    {
        InitializeComponent();
    }

    private void OnSaveClick(object? sender, RoutedEventArgs e)
    {
        // handle click
    }
}
```

### ViewModel (using CommunityToolkit.Mvvm)

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace MyApp.ViewModels;

public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private string _username = string.Empty;

    [RelayCommand]
    private async Task SaveAsync()
    {
        // save logic
    }
}
```
