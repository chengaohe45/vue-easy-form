import Vue from "vue";
import help from "./help/index";
import unit from "./units/unit";
import desc from "./units/desc";
import label from "./units/label";
import title from "./units/title";
import select from "./units/select";

import slot from "./units/slot";
let all = {
  register() {
    Vue.component("g-help", help);
    Vue.component("g-unit", unit);
    Vue.component("g-desc", desc);
    Vue.component("g-label", label);
    Vue.component("g-title", title);
    Vue.component("g-select", select);
    Vue.component("g-slot", slot);
  }
};

export default all;
