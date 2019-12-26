import Vue from "vue";
import help from "./help/index";
import unit from "./units/unit";
import desc from "./units/desc";
import label from "./units/label";

let all = {
  register() {
    Vue.component("g-help", help);
    Vue.component("g-unit", unit);
    Vue.component("g-desc", desc);
    Vue.component("g-label", label);
  }
};

export default all;
