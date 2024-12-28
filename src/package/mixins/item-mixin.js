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
    },
    mxParseClass(classScript, info, mergeClassStr) {
      var classResult;
      if (classScript) {
        if (typeof classScript === "function") {
          var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
          classScript = classScript(rootInstance._fetchParseSources(info));
        } else {
          classResult = classScript;
        }
      }
      if (classResult) {
        if (mergeClassStr) {
          if (utils.isArr(classResult)) {
            classResult.unshift(mergeClassStr);
          } else {
            classResult = [mergeClassStr, classResult];
          }
        } else {
          // 无需要合并
        }
      } else {
        if (mergeClassStr) {
          classResult = mergeClassStr;
        }
      }
      return classResult;
    },
    /**
     * 包括样式的解析
     * @param {*} attrScript
     * @param {*} info
     * @returns
     */
    mxParseNodeAttr(attrScript, info) {
      if (typeof attrScript === "function") {
        var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
        return attrScript(rootInstance._fetchParseSources(info));
      } else {
        return attrScript;
      }
    },
    mxParseBoolValue(boolScript, info) {
      if (typeof boolScript === "function") {
        var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
        var result = boolScript(rootInstance._fetchParseSources(info));
        // console.log(!!result)
        return !!result;
      } else {
        return !!boolScript;
      }
    }
  }
};
