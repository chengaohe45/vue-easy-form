import utils from "./utils";
import parse from "./parse";

let schemaRules = {
  isEs: function(value) {
    return parse.isEsScript(value);
  },

  isStr: function(value) {
    return utils.isStr(value);
  },

  /**
   * [数值范围]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  // range: function(value, min, max, isInt) {
  //   if (utils.isNum(value)) {
  //     if (isInt) {
  //       return schemaRules.isInt(value, min, max);
  //     } else {
  //       var tmpMin = min;
  //       var tmpMax = max;
  //       if (utils.isNum(min) && utils.isNum(min) && min > max) {
  //         tmpMin = max;
  //         tmpMax = min;
  //       }

  //       if (utils.isNum(tmpMin) && value < tmpMin) {
  //         return false;
  //       } else if (utils.isNum(tmpMax) && value > tmpMax) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   } else {
  //     return false;
  //   }
  // },

  /**
   * [isInt 是否整数]
   * @param  {[Number or String]}  value [description]
   * @param  {[Number]}  min [最小值(包含此值)，因为这个很常用, 不写就不比较]
   * @return {Boolean}       [description]
   */
  isInt: function(value, min, max) {
    var tmpMin = min;
    var tmpMax = max;
    if (utils.isNum(min) && utils.isNum(min) && min > max) {
      tmpMin = max;
      tmpMax = min;
    }
    if (utils.isNum(value) && /^\d+$/.test(value + "")) {
      if (utils.isNum(tmpMin) && value < tmpMin) {
        return false;
      } else if (utils.isNum(tmpMax) && value > tmpMax) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
};

export default schemaRules;
