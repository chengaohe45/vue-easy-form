// import esBase from "./base";
import esForm from "./index.vue";
import schemaUtils from "./libs/schema-utils";

// import esRules from "./libs/rules.js";
import esUtils from "./libs/utils";
import esGlobal from "./libs/global.js";
// import esConstant from "./libs/constant";

const install = function(Vue, globalOpts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;

  // 保存外部传入来的Vue(如用来判断vnode)
  esUtils.initVue(Vue);

  if (Object.keys(globalOpts).length > 0) {
    esUtils.mergeGlobal(esGlobal, globalOpts);
    // console.log(esGlobal);
  }

  // Vue.component(esConstant.HELP_NAME, esHelp);
  // Vue.component("es-base", esBase);
  Vue.component("es-form", esForm);
};

const check = function(schema) {
  return schemaUtils.check(schema);
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: typeof process != "undefined" ? process.env.VUE_APP_VERSION : "??",
  install,
  esForm,
  check
};
