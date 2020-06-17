# 表单属性/事件/方法

### 实例
```html
<!-- 表单事件可以在元素中配置，也可以在schema中配置触发，接收的参数一样；注：两者选其一 -->
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

<script>
	export default {
		data() {
			return {
				formValue: {},
				formSchema: {
					ui: {},
					actions: {	// v1.6.0；表单事件在schema配置, 多个可写成数组
						trigger: "inited",
						handler: function(formValue) {}
					},
					properties: {
						name: "广告名称",
						author: "作者名称"
					}
				}
			};
		}
	};
</script>
```
## 表单属性

| 事件名称 | 类型 | 默认值 | 说明
| -- | -- | -- | -- 
| value/<span style="white-space:nowrap">v-model</span> | Object | {} | 绑定值(表单值)
| schema | Object | {} | 具体的表单配置
| global | Object | {} | 外部值；和rootData共同影响项隐藏等
| hasConsole | boolean | -- | 是否有调试控制台；当设置true或false时，优先级会高于全局的hasConsole,不设置则取全局的hasConsole

## 表单事件

| 事件名称 | 说明 | 回调参数 | 备注
| -- | -- | -- | -- 
| inited | <span style="white-space:nowrap">表单初始化</span>完成时触发 | (formValue) | schema改变时（[非深度监听](https://cn.vuejs.org/v2/api/#watch)），表单会重新初始化，inited会再次调用(`inited未完成之前，用户行为事件（change、submit）暂不会触发，其它事件（input）不受影响`)
| input | 表单的值有改变时触发 | (formValue, keyPath) | -- 
| change | 表单组件改变时触发 | (formValue, keyPath, eventData) | setValue不会触发
| submit | 提交表单 | (formValue) | form.submit(); 组件事件(@enterSubmit; @submit)会触发
::: warning 注意
1. 表单事件写法有两种：在`元素中直接配置`、在`schema的actions中配置`<badge text="1.6.0" />；两者选其一；
2. 若两者都存在，当事件触发时，actions存在此事件，则只会触发actions的配置，在元素中配置的事件则失效，这样避免重复触发；
3. 两种写法的所返回的参数是一样（见上面），跟[组件事件的参数](../base/component.md#actions组件事件)不同，但写法跟[组件事件的写法](../base/com-format.md#组件事件)一样；
4. actions函数的this指针是指向此表单。
> 场景：当两种写法都存在，inited事件触发，若actions存在inited事件，则触发actions中的inited事件；若actions不存在inited事件（就算actions还存在其它事件，比如change事件），则也会触发`元素中配置`的inited事件
:::

## 表单方法

| 属性名 | 说明 | 参数 | 备注
| -- | -- | -- | -- 
| getRef | 取元素或组件 | (name, idxChain) | 类似于ref；若项组件在表单数组中，则返回来的是一个数组[见下面详解](#getref)；<br />`注意：`隐藏的项是不会取出的
| checkAll | 检查表单是否有错 | 空 | 返回true/false
| submit | 触发submit事件 | 空 | --
| isHidden | 判断某项是否隐藏 | ([pathKey](./explain.md#项组件路径)) | --
| getGlobal | 取表单的全局数据 | 空 | 应用表单传入来的global
| getRootData | 取表单根值 | 空 | 实时取值，表单存在的值，包括隐藏的或临时的
| getValue | 取表单值 | 空 | 实时取值，表单存在的值;也是getRootData的别名
| setValue | 设置表单值 | ([pathKey](./explain.md#项组件路径), value) | 当pathKey是Object时，值自动匹配设置；当pathKey为字符串时，则是设置某个值
| getFormValue | 取表单值 | 空 | 实时取值，用户提交所需要的值，不包括隐藏的或临时的；也就是v-model
| getTabsIndex | 取某一个tabs的索引 | ([pathKey](./explain.md#项组件路径)) | 返回当前tabs的索引，不是tabs返回false；（支持普通或数组tabs）
| setTabsIndex | 设某一个tabs的索引 | ([pathKey](./explain.md#项组件路径), index) |  设置当前tabs的索引；（支持普通或数组tabs）
| <span style="white-space: nowrap;">clearErrMsg<badge text="1.6.2" /></span> | 清除错误信息 | ([pathKey](./explain.md#项组件路径), clearNext) |  1. 当pathKey没有值时则清除所有，clearNext无效；<br/>2. 当pathKey有值时，则是清除某一项，clearNext是对pathKey的补充，是否一起清除此项的后代
| reset | 重置表单值 | (onlySchema) | onlySchema为<badge text="1.7.5" />添加；默认为`false`<br/>`false`：重置的值为`schema配置`和`formValue`初始化时结合的值；<br/>`true`：重置的值为仅为`schema配置`初始化时的值


### getRef
写法：form.getRef(name, idxChain)<br>
参数：
- `name` 必填；在[项组件](./component.html)中设置的ref名称
- `idxChain` 选填；项组件所在的[索引链](./explain.md#索引链)，用于`数组`; 具体作用是当取出是数组的时候，可以用idxChain指出来出是哪一个
::: warning 注意
注意：隐藏的项（也就是属性hidden为true, 包括自身或父类隐藏）是不会取出来
:::
[项组件actions的具体写法](./component.html#组件事件)
