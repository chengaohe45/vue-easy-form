# 调试面板
若设置了调试面板为打开时，表单的左上角有一个`C`按钮；在面版里面可以`实时`看到表单的[根值](.explain.md#根值)和[表单值](.explain.md#表单值)；常用于开发调试用。
### 实例
以下用的是`全局引入设置`，设置了hasConsole为true

<ClientOnly>
  <demo-block>

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            name: {
              label: "广告名称",
              component: "el-input",
              value: "首页位置"
            },
            author: "作者名称"
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

### 全局引入设置

在引入时直接设置; 全局`hasConsole`的默认值为`false`

```js
Vue.use(esForm, 
  { 
    rowSpace: 10,
    hasConsole: process.env.NODE_ENV != "production"  // 推荐写成动态，这样编译时不用修改；
  });
```

### 表单属性设置

对表单的属性hasConsole进行设置；表单`hasConsole`的优先级高于全局`hasConsole`的优先级；当不设置表单`hasConsole`时，则会自动取全局设置

```html
<es-form ref="form" 
    v-model="formValue"
    :schema="formSchema" 
    :global="global" 
    :hasConsole="hasConsole"> <!-- hasConsole为true/false  -->
</es-form>
```
