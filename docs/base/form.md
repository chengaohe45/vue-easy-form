# 表单属性/事件/方法

## 实例
```html
<es-form ref="form" 
    v-model="formValue"
    :schema="formSchema" 
    :global="global" 
    :hasConsole="hasConsole" 
    @inited="initedHandler" 
    @input="inputHandler" 
    @change="changeHandler" 
    @submit="submitHandler">
</es-form>
```
## 表单属性

| 事件名称 | 类型 | 默认值 | 说明
| -- | -- | -- | -- 
| value/v-model | Object | {} | 绑定值(表单值)
| schema | Object | {} | 具体的表单配置
| global | Object | {} | 外部值；和rootData共同影响项隐藏等
| hasConsole | boolean | -- | 是否有调试控制台；当设置true或false时，优先级会高于全局的hasConsole,不设置则取全局的hasConsole

## 表单事件

| 事件名称 | 说明 | 回调参数 | 备注
| -- | -- | -- | -- 
| inited | 表单初始化完成时触发 | (formValue) | schema改变时（[非深度监听](https://cn.vuejs.org/v2/api/#watch)），表单会重新初始化，inited会再次调用(`inited未完成之前，用户行为事件（change、submit）暂不会触发，其它事件（input）不受影响`)
| input | 表单的值有改变时触发 | (formValue, keyPath) | -- 
| change | 表单组件改变时触发 | (formValue, keyPath, eventData) | setValue不会触发
| submit | 提交表单 | (formValue) | form.submit(); 组件事件(@enterSubmit; @submit)会触发

## 表单方法

| 属性名 | 说明 | 参数 | 备注
| -- | -- | -- | -- 
| getRef | 取元素或组件 | (name, idxChain) | 类似于ref；若项组件在表单数组中，则返回来的是一个数组[见下面详解](#getref)；<br />`注意：`隐藏的项是不会取出的
| checkAll | 检查表单是否有错 | 空 | true/false
| submit | 触发submit事件 | 空 | --
| isHidden | 判断某项是否隐藏 | ([pathKey](./explain.md#项组件路径)) | --
| getGlobal | 取表单的全局数据 | 空 | 应用表单传入来的global
| getRootData | 取表单根值 | 空 | 实时取值，表单存在的值，包括隐藏的或临时的
| getValue | 取表单值 | 空 | 实时取值，表单存在的值;也是getRootData的别名
| setValue | 设置表单值 | ([pathKey](./explain.md#项组件路径), value) | 当pathKey是Object时，值自动匹配设置；当pathKey为字符串时，则是设置某个值
| getFormValue | 取表单值 | 空 | 实时取值，用户提交所需要的值，不包括隐藏的或临时的；也就是v-model
| getTabsIndex | 取某一个tabs的索引 | ([pathKey](./explain.md#项组件路径)) | 返回当前tabs的索引，不是tabs返回false；（支持普通或数组tabs）
| setTabsIndex | 设某一个tabs的索引 | ([pathKey](./explain.md#项组件路径), index) |  设置当前tabs的索引；（支持普通或数组tabs）
| reset | 重置表单值 | 空 | -- 


### getRef
写法：form.getRef(name, idxChain)<br>
参数：
- `name` 必填；在[项组件](./component.html)中设置的ref名称
- `idxChain` 选填；项组件所在的[索引链](./explain.md#索引链)，用于`数组`; 具体作用是当取出是数组的时候，可以用idxChain指出来出是哪一个
::: warning 注意
注意：隐藏的项（也就是属性hidden为true, 包括自身或父类隐藏）是不会取出来
:::
[项组件actions的具体写法](./component.html#组件事件)
