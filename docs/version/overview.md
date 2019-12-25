# 版本总览

# 1.5.6（2019.12.19）
- label、desc、help、unit、title支持隐藏控制（hidden属性）
- label、title支持help配置

# 1.5.4（2019.12.12）
- label、desc、help、unit、title支持[组件事件](../base/com-format.md#组件事件)

# 1.5.3（2019.12.04）
- [支持VUE组件的属性是函数类型](../base/com-format.md#当props里面的某属性是的类型是函数怎么办？)
- label、desc、help、unit、title支持style、class并且支持[动态解析](../base/com-standard.md)
- 优化[项组件](../base/component.md)：支持component对象里配置value
- 功能优化：对接原生表单组件

# 1.5.2（2019.11.29）
- 功能优化：对接原生表单组件
- 支持指令

# 1.5.1（2019.11.13）
- 优化esForm版本读取、优化[CDN安装](../base/install.md#npm安装)

# 1.5.0（2019.11.01）
- `优化组件显示`：隐藏的组件在表单初始化时不创建，此组件在第一次显示时再创建；已创建组件再次隐藏时，只是DOM（v-show=false）节点隐藏

# 1.4.8（2019.09.21）
- 修复$global监听问题

## 1.4.6（2019.8.25）
- 增加数组min、max时的错误提示（[minMsg, maxMsg](../base/array.md#配置属性)）
- 修复component.text的函数写法

## 1.4.4（2019.8.18）
- 优化tabs
- 兼容safari, firefox

## 1.4.2（2019.8.11）
- 增加：每次更改schema时都会触发inited事件

## 1.4.0（2019.8.7）
- 优化框架、优化实例、优化文档、增加版本记录

## 1.3.0（...）
- 暂无记录
