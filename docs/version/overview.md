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
### 1.6.4（2020.04.24）
- 优化规则：增加[showRequired](../base/rules.md)控制`星号`

### 1.6.3（2020.04.21）
- 增加规则空值自定义：[emptyMethod](../base/rules.md)

###  1.6.2（2020.03.07）
- 增加表单方法：[clearErrMsg](../base/form.md#表单方法)
- 优化规则设置：增加错误提示信息的[class和style](../base/rules.md)配置
- 优化界面调整：增加properties.ui.[toggleTexts](../base/settings.md#ui属性)切换文本配置

###  1.6.0（2020.02.23）
- 在schema中配置[表单事件](../base/form.md#表单事件)
- 优化组件文本：增加[text属性](../base/com-format.md)的显示类型（数值、布尔）

<!-- ## 旧版本记录
###  1.5.8（2020.01.05）
- 优化调试控制台
- 优化卡片数组
- 修复[值转换](../base/format.md)初始化时不同步的问题
- 优化文档，嵌入实例


###  1.5.6（2019.12.19）
- label、desc、help、unit、title支持隐藏控制（hidden属性）
- label、title支持help配置

###  1.5.4（2019.12.12）
- label、desc、help、unit、title支持[组件事件](../base/com-format.md#组件事件)

###  1.5.3（2019.12.04）
- [支持VUE组件的属性是函数类型](../base/com-format.md#当props里面的某属性是的类型是函数怎么办？)
- label、desc、help、unit、title支持style、class并且支持[动态解析](../base/parse.md)
- 优化[项组件](../base/component.md)：支持component对象里配置value
- 功能优化：对接原生表单组件

###  1.5.2（2019.11.29）
- 功能优化：对接原生表单组件
- 支持指令

###  1.5.1（2019.11.13）
- 优化esForm版本读取、优化[CDN安装](../base/install.md#npm安装)

###  1.5.0（2019.11.01）
- `优化组件显示`：隐藏的组件在表单初始化时不创建，此组件在第一次显示时再创建；已创建组件再次隐藏时，只是DOM（v-show=false）节点隐藏

###  1.4.8（2019.09.21）
- 修复$global监听问题

### 1.4.6（2019.8.25）
- 增加数组min、max时的错误提示（[minMsg, maxMsg](../base/array.md#配置属性)）
- 修复component.text的函数写法

### 1.4.4（2019.8.18）
- 优化tabs
- 兼容safari, firefox

### 1.4.2（2019.8.11）
- 增加：每次更改schema时都会触发inited事件

### 1.4.0（2019.8.7）
- 优化框架、优化实例、优化文档、增加版本记录

### 1.3.0（...）
- 暂无记录 -->
