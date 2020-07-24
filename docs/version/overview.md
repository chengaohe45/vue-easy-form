# 版本总览

<div style="margin: 5px 0 0 0; font-size: 14px; min-height: 24px;">
  <span style="vertical-align: top;">系统的最新版本：</span><a href="https://www.npmjs.com/package/vue-easy-form" target="_blank"><img src="https://img.shields.io/npm/v/vue-easy-form.svg" alt="version"></a>
</div>

## 文档版本选择
<div style="margin: 10px 0; min-height: 34px;">
<ClientOnly>
  <version-select></version-select>
</ClientOnly>
</div>

## 当前版本记录

### 1.7.8
- 增加：组件[事件](../base/com-format.md#组件事件)和组件[验证](../base/rules.md)返回`表单实例`，这样在`箭头函数`中使用`表单实例`就更加方便和灵活；
- 修复：若[在actions中直接配置事件](../base/form.md)，导致无法触发[在元素中直接配置的事件](../base/form.md)的问题.

### 1.7.7
- 优化[数组](../base/array.md#实例1)：增加[delWarnBtns](../base/array.md#配置属性)，控制`删除警告框按钮的文本`

### 1.7.6
- 优化[数组](../base/array.md#实例1)：增加[btnType](../base/array.md#配置属性)，控制操作按钮的显示方式
- 优化[数组](../base/array.md#实例1)：数组下方的`全删和增加`按钮统一改为图标形式

### 1.7.5
- 优化[表单方法](../base/form.md#表单方法)：重置方法(reset)增加重置类型参数

### 1.7.4
- 优化[组件格式](../base/com-format.md)：增加[组件插槽](../base/scopedSlots.md)

### 1.7.3
- 增加数组删除提示框可自定义：增加[delMsg](../base/array.md#配置属性), [delAllMsg](../base/array.md#配置属性)
- 增加数组操作钩子：增加[before](../base/array.md#配置属性)钩子
- 优化块组件验证：修复required无动态解析问题
- 优化组件数组头部显示：修复subLabel无动态解析问题

### 1.7.1
- 优化[动态解析](../base/parse.md)：优化[数组es写法](../base/array.md#数组es写法)

### 1.7.0
- 优化[动态解析](../base/parse.md)：es写法可以去掉大括号


