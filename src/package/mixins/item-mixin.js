import utils from "../libs/utils.js";
import constant from "../libs/constant.js";
export default {
  props: {
    schema: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    mxShowComponent(component, info) {
      if (component) {
        var hiddenScript = component.hidden;
        if (typeof hiddenScript === "function") {
          var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
          return !hiddenScript(rootInstance._fetchParseSources(info));
        } else {
          return !hiddenScript;
        }
      } else {
        return false;
      }
    }
  }
};
