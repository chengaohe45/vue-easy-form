import global from "./global";

let output = {
  log: function() {
    if (global.productionTip) {
      console.log(...arguments);
    }
  },

  error: function() {
    if (global.productionTip) {
      console.error(...arguments);
    }
  },

  warn: function() {
    if (global.productionTip) {
      console.warn(...arguments);
    }
  }
};

export default output;
