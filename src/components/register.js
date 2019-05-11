import Vue from "vue";
import help from "./help/index";

let all = {
  register() {
    Vue.component("g-help", help);
  }
};

export default all;
