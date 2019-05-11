// import whBase from "./base";
import esForm from "./index.vue";
import whHelp from "./components/help.vue";

import whRules from "./libs/rules.js";
import whUtils from "./libs/utils";
import whGlobal from "./libs/global.js";
import whConstant from "./libs/constant";

const install = function(Vue, extendRules = {}, globalOpts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;

  if (Object.keys(extendRules).length > 0) {
    Object.assign(whRules, extendRules);
  }

  if (Object.keys(globalOpts).length > 0) {
    whUtils.mergeGlobal(whGlobal, globalOpts);
    // console.log(whGlobal);
  }

  Vue.component(whConstant.HELP_NAME, whHelp);
  // Vue.component("es-base", whBase);
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
