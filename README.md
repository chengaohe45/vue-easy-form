# vue-easy-form

<p align="left">
  <a href="https://github.com/vuejs/vue"><img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue"></a>
  <a href="https://www.npmjs.com/package/vue-easy-form"><img src="https://img.shields.io/npm/v/vue-easy-form.svg" alt="version"></a>
</p>

vue-easy-form: referred to as esForm, is an independent vue form component that does not rely on third-party libraries. Through a json configuration, the form that the user needs is dynamically output. Rich component layout, simple logic control, flexible event linkage, seamless connection with third-party class libraries, greatly improving user development efficiency.

## Why choose esForm?
- Only need a json configuration, almost no need for html, css;
- Rich layout, including flexible layout and tabs layout;
- Seamless connection with third-party components, no need to customize components for the framework (you can freely choose `element-ui`, `fish-ui` and other libraries);
- The form is fully functional, including title, verification, event, unit, help, description, `array`, etc.;
- Flexible and convenient logic control（support [dynamic analysis](https://chengaohe45.github.io/vue-easy-form-docs/dist/base/parse.html)）

## Documentation and source code
Check out our docs at [https://chengaohe45.github.io/vue-easy-form-docs/dist/](https://chengaohe45.github.io/vue-easy-form-docs/dist/)  
Check out our source code at [https://github.com/chengaohe45/vue-easy-form](https://github.com/chengaohe45/vue-easy-form)

## Quick Start
### Install
```
npm install --save vue-easy-form
```

### import and Register
```
import esForm from "vue-easy-form";

Vue.use(esForm);
```

### Usage
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
            label: "nameLabel",
            component: "el-input",
            value: "nameText"
          },
          author: "authorLabel"
        },
        formValue: {}
      };
    }
  };
</script>
```


## References
- [ncform](https://github.com/ncform/ncform)