# 调试面板
若设置了调试面板，当打开页面时，左上角有一个`Console`按钮，具体见[调试面板实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/es-function)

## 全局引入设置

在引入时直接设置; 全局`hasConsole`的默认值为`false`

```js
Vue.use(esForm, 
  { 
    rowSpace: 10,
    hasConsole: process.env.NODE_ENV != "production"  // 推荐写成动态，这样编译时不用修改；
  });
```

## 表单属性设置

对表单的属性hasConsole进行设置；表单`hasConsole`的优先级高于全局`hasConsole`的优先级；当不设置表单`hasConsole`时，则会自动取全局设置

```html
<es-form ref="form" 
    v-model="formValue"
    :schema="formSchema" 
    :global="global" 
    :hasConsole="hasConsole"> <!-- hasConsole为true/false  -->
</es-form>
```
