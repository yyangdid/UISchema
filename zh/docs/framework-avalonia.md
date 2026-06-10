# UISchema 适配：Avalonia UI

## 概述

本文档定义 UISchema 到 Avalonia UI 的映射规则。

Avalonia 是一个跨平台的 .NET UI 框架，使用 XAML（AXAML）定义界面，支持 Windows、macOS、Linux、iOS、Android 和 WebAssembly。

适配版本：

- .NET 10+
- Avalonia 12.x

参考来源：https://docs.avaloniaui.net/、Avalonia MCP

---

## 核心差异（与 Web 框架对比）

| 概念 | Web 框架（Vue/React） | Avalonia UI |
|------|----------------------|-------------|
| 界面语言 | HTML / JSX | XAML（AXAML） |
| 布局模型 | CSS Flex / Grid | StackPanel / Grid / DockPanel |
| 样式语法 | CSS | XAML 样式（Style 元素） |
| 属性命名 | kebab-case / camelCase | **PascalCase** |
| 事件命名 | @click / onClick | **Click**（PascalCase） |
| 数据绑定 | v-model / value+onChange | `{Binding Path}` / `{Binding Path, Mode=TwoWay}` |
| 尺寸单位 | px / rem / % | px / `*`（star sizing）/ Auto |
| 组件内容 | children / slot | **Content** 属性或子元素 |

---

## 组件映射

### 基础控件

| UISchema | Avalonia | 说明 |
|----------|----------|------|
| page | Window / UserControl | 窗口或用户控件 |
| button | Button | Content 属性 |
| text | TextBlock | 只读文本 |
| label | Label | 文本标签 |
| input | TextBox | Text 属性 |
| textarea | TextBox AcceptsReturn=True | 多行文本 |
| password-box | TextBox PasswordChar | 密码输入 |
| checkbox | CheckBox | IsChecked 属性 |
| radio-button | RadioButton | IsChecked + GroupName |
| switch | ToggleSwitch | IsChecked |
| select / combo-box | ComboBox | Items + SelectedItem |
| list-box | ListBox | Items + SelectedItem |
| image | Image | Source 属性 |
| slider | Slider | Value / Minimum / Maximum |
| progress-bar | ProgressBar | Value / IsIndeterminate |
| date-picker | DatePicker | SelectedDate |
| time-picker | TimePicker | SelectedTime |
| tooltip | ToolTip | 附加属性 ToolTip.Tip |
| separator | Separator | 分割线 |

### 布局容器

| UISchema | Avalonia | 说明 |
|----------|----------|------|
| stack-panel | StackPanel | Orientation + Spacing |
| stack-panel-h | StackPanel Orientation="Horizontal" | 水平排列 |
| stack-panel-v | StackPanel Orientation="Vertical" | 垂直排列（默认） |
| grid | Grid | RowDefinitions + ColumnDefinitions |
| dock-panel | DockPanel | Dock 附加属性 |
| wrap-panel | WrapPanel | 自动换行排列 |
| canvas | Canvas | 绝对定位，Left/Top 附加属性 |
| border | Border | Background / BorderBrush / CornerRadius |
| scroll-viewer | ScrollViewer | 滚动容器 |
| expander | Expander | Header + Content |
| group-box | GroupBox | 分组容器（GroupBox / Expander） |
| panel | Panel | 基本面板 |
| content-control | ContentControl | 内容容器 |

### 数据展示

| UISchema | Avalonia | 说明 |
|----------|----------|------|
| data-grid | DataGrid | Items + Columns（需 DataGrid 包） |
| tree-view | TreeView | Items |
| tree-view-item | TreeViewItem | Header |
| menu | Menu | MenuItem 集合 |
| menu-item | MenuItem | Header + Command |
| context-menu | ContextMenu | 上下文菜单 |
| tabs | TabControl | TabItem 集合 |
| tab-item | TabItem | Header + Content |
| status-bar | StatusBar | 状态栏 |

### 窗口和导航

| UISchema | Avalonia | 说明 |
|----------|----------|------|
| window | Window | Title / Content / SizeToContent |
| user-control | UserControl | 可复用的用户控件 |
| dialog | Window SizeToContent | 弹窗效果 |
| split-view | SplitView | 汉堡菜单布局 |
| carousel | Carousel | 轮播容器 |

### 形状和装饰

| UISchema | Avalonia | 说明 |
|----------|----------|------|
| rectangle | Rectangle | Fill / Stroke |
| ellipse | Ellipse | Fill / Stroke |
| path-icon | PathIcon | Data 属性（SVG 路径） |
| progress-ring | ProgressRing | 环形进度 |

---

## 组件映射原则

- 未在映射表中列出的组件名，按**直接透传**规则处理（如 `{ "component": "SplitButton" }` → `<SplitButton />`）
- 组件名和属性名使用 **PascalCase**
- 布局大小支持 `*`（star sizing）和 `Auto`

---

## props 映射

props 键名使用 PascalCase。

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

### text 映射

`props.text` 映射到组件的 `Content` 属性或 `Text` 属性：

| 组件 | 映射目标 |
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

## events 映射

Avalonia 事件使用 PascalCase 事件名：

| 通用事件名 | Avalonia |
|-----------|----------|
| click | Click |
| change | PropertyChanged（或特定事件如 TextChanged） |
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
| closing | Closing（Window） |
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

事件处理函数在代码隐藏（code-behind）中实现：

```csharp
private void OnSaveClick(object? sender, RoutedEventArgs e)
{
    // ...
}
```

---

## bindings 映射

Avalonia 使用 XAML 数据绑定语法，通过 `{Binding}` 标记扩展。

### 单向绑定

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

### 双向绑定（TwoWay）

Avalonia 12 默认启用**编译绑定**（compiled bindings），需要在根元素上声明 `x:DataType`：

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

如果未启用编译绑定，使用传统的反射绑定 `{Binding Username, Mode=TwoWay}` 语法一致，无需 `x:DataType`。

### Command 绑定

Avalonia 使用 Command 模式替代事件：

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

### 常见绑定模式

| UISchema bindings 键 | 组件 | Avalonia 语法 |
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

### ViewModel 约定

AI 应生成对应的 ViewModel（使用 CommunityToolkit.Mvvm）：

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

## layout 映射

Avalonia 使用 XAML 布局系统，不使用 CSS。layout 属性映射为布局容器的定位属性：

| layout 属性 | 等效 XAML |
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

### Grid 布局中的定位

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

### StackPanel / Grid 作为父容器

UISchema 中的父容器应映射为对应的 Avalonia 面板：

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

## style 映射

Avalonia 的 style 属性映射为控件的直接属性（PascalCase）：

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

### style 键名映射表

| UISchema style 键 | Avalonia 属性 | 说明 |
|-------------------|--------------|------|
| width | Width | 数值 |
| height | Height | 数值 |
| min-width | MinWidth | - |
| min-height | MinHeight | - |
| max-width | MaxWidth | - |
| max-height | MaxHeight | - |
| margin | Margin | 数值或 "left,top,right,bottom" |
| padding | Padding | 数值或 "left,top,right,bottom" |
| background | Background | 颜色或画刷 |
| foreground | Foreground | 文字颜色 |
| color | Foreground | 文字颜色（别名） |
| border | BorderBrush | 边框颜色 |
| border-thickness | BorderThickness | 边框宽度 |
| corner-radius | CornerRadius | 圆角 |
| font-size | FontSize | 字号（数值） |
| font-weight | FontWeight | "Bold" / "Normal" |
| font-style | FontStyle | "Italic" / "Normal" |
| opacity | Opacity | 0-1 |
| cursor | Cursor | 鼠标样式 |
| horizontal-alignment | HorizontalAlignment | "Left"/"Center"/"Right"/"Stretch" |
| vertical-alignment | VerticalAlignment | "Top"/"Center"/"Bottom"/"Stretch" |
| row | Grid.Row | Grid 行索引 |
| column | Grid.Column | Grid 列索引 |
| row-span | Grid.RowSpan | Grid 行跨度 |
| column-span | Grid.ColumnSpan | Grid 列跨度 |

---

## 示例

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

### TextBox with binding

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

### StackPanel layout

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

### Grid layout

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

## 导入和代码结构

生成代码时应包含完整的 XAML 和 C# 代码：

### XAML 文件（.axaml）

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

### C# 代码隐藏

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

### ViewModel（使用 CommunityToolkit.Mvvm）

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
