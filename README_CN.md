# vue-easy-form

<p align="left">
  <a href="https://github.com/vuejs/vue"><img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue"></a>
  <a href="https://www.npmjs.com/package/vue-easy-form"><img src="https://img.shields.io/npm/v/vue-easy-form.svg" alt="version"></a>
</p>

vue-easy-form：简称esForm，是一个独立、不依赖第三方类库的vue表单组件。通过一份json配置，动态输出用户所需要的表单。组件布局丰富、逻辑控制简洁、事件联动灵活、`无缝对接第三方类库`, 极大地提高用户开发效率。

## 为什么选择esForm?
- 只需要一个json配置，几乎无需html, css；
- 布局丰富，包含弹性布局和tabs布局；
- 无缝对接第三方组件，无需为框架定制化组件（可自由选择`element-ui`、`fish-ui`等类库）；
- 表单功能齐全，包含标题、验证、事件、单位、帮助、描述、`数组`等；
- 逻辑控制灵活方便（支持[动态解析](https://chengaohe45.github.io/vue-easy-form-docs/dist/base/parse.html)）

## 文档/源代码
文档见[https://chengaohe45.github.io/vue-easy-form-docs/dist/](https://chengaohe45.github.io/vue-easy-form-docs/dist/)  
源代码[https://github.com/chengaohe45/vue-easy-form](https://github.com/chengaohe45/vue-easy-form)

## 快速入门
### 安装
```
npm install --save vue-easy-form
```

### 引入和注册
```
import esForm from "vue-easy-form";

Vue.use(esForm);
```

### 用法
```html
<template>
  <es-form :schema="formSchema" v-model="formValue"></es-form>
</template>
<script>
  export default {
    data() {
      return {
        formSchema: {
          name: {
            label: "name",
            component: "el-input",
            value: "mark"
          },
          isLeader: {
            label: "is leader",
            component: "el-switch",
            value: true
          }
        },
        formValue: {}
      };
    }
  };
</script>
```


## 相关文档
- [ncform](https://github.com/ncform/ncform)
