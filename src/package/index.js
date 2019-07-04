// import esBase from "./base";
import esForm from "./index.vue";
// import esHelp from "./components/help.vue";

// import esRules from "./libs/rules.js";
import esUtils from "./libs/utils";
import esGlobal from "./libs/global.js";
// import esConstant from "./libs/constant";

const install = function(Vue, globalOpts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;

  // if (Object.keys(extendRules).length > 0) {
  //   Object.assign(esRules, extendRules);
  // }

  if (Object.keys(globalOpts).length > 0) {
    esUtils.mergeGlobal(esGlobal, globalOpts);
    // console.log(esGlobal);
  }

  // Vue.component(esConstant.HELP_NAME, esHelp);
  // Vue.component("es-base", esBase);
  Vue.component("es-form", esForm);
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "1.1.6",
  install,
  esForm
};
