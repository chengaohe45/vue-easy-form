# 表单事件/方法

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue" @inited="initedHandler"
   @input="inputHandler" @change="changeHandler" @submit="submitHandler"></es-form>
```

## 表单事件

| 事件名称 | 说明 | 回调参数 | 备注
| -- | -- | -- | -- 
| inited | 表单初始化完成时触发 | (formValue) | -- 
| input | 表单的值有改变时触发 | (formValue, keyPath) | -- 
| change | 表单组件改变时触发 | (formValue, keyPath, eventData) | setValue不会触发
| submit | 提交表单 | (formValue) | form.submit(); 组件事件(@enterSubmit; @submit)会触发

## 表单方法

| 属性名 | 说明 | 参数 | 备注
| -- | -- | -- | -- 
| getRef | 取元素或组件 | (name) | 类似于ref
| checkAll | 检查表单是否有错 | 空 | true/false
| submit | 触发submit事件 | 空 | --
| getValue | 取表单值 | 空 | 实时取值
| setValue | 设置表单值 | (key, value) | 当key是Object时，值自动匹配设置；当key为字符串时，则是设置某个值
| getTabsIndex | 取某一个tabs的索引 | (key) | 返回当前tabs的索引，不是tabs返回false；（支持普通或数组tabs）
| setTabsIndex | 设某一个tabs的索引 | key, index |  设置当前tabs的索引；（支持普通或数组tabs）
| reset | 重置表单值 | 空 | -- 

[组件actions的具体写法](./component.html#组件事件)
