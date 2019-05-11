let esRules = {
  /**
   * [isMobile 是否手机格式]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  isMobile: function(value) {
    // console.log("isMobile: ", arguments);
    var reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value)) {
      return false;
    }
    return true;
  },

  /**
   * [isEmail 是否邮件格式]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  isEmail: function(value) {
    var reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!reg.test(value)) {
      return false;
    }
    return true;
  },

  /**
   * [isInt 是否是正数字]
   * @param  {[Number or String]}  value [description]
   * @param  {[Number]}  minNum [最小值，因为这个很常用, 不写就不比较]
   * @return {Boolean}       [description]
   */
  isInt: function(value, minNum) {
    let tmpValue = value + "";
    var reg = /^(-)?\d+$/;
    if (reg.test(tmpValue + "")) {
      if (minNum == null) {
        return true;
      } else {
        tmpValue = parseInt(tmpValue);
        if (tmpValue >= minNum) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  },

  // /**
  //  * [isFloat 是否是浮点数]
  //  * @param  {[Number or String]}  value [description]
  //  * @param  {[Number]}  minNum [最小值，因为这个很常用, 不写就不比较]
  //  * @return {Boolean}       [description]
  //  */
  isFloat: function(value, minNum) {
    let tmpValue = value + "";
    if (!esRules.isInt(tmpValue, minNum)) {
      var reg = /^-?(0|[1-9]\d*)\.\d+$/;
      if (reg.test(tmpValue)) {
        if (minNum == null) {
          return true;
        } else {
          tmpValue = parseInt(tmpValue);
          if (tmpValue >= minNum) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  },

  /**
   * [isDateTime 是否是时间格式]
   * @param  {[String]}  value [description]
   * * @param  {[type]}  connector  [连接符，只接受 - or /; 不写时两都可以]
   * @param  {[type]}  type  [data time 不写时就是整个标准的写法：如：2019/12/19 12:00:00]
   * @return {Boolean}       [description]
   */
  isDateTime: function(value, type, connector) {
    if (value && typeof value === "string") {
      var connectorTxt = "\\-|\\/";
      if (connector == "-" || connector == "/") {
        connectorTxt = "\\" + connector;
      }
      var dateRegStr =
        "\\d{4}(" + connectorTxt + ")(0?\\d|1[012])\\1(0?\\d|[12]\\d|3[01])";
      var timeRegStr =
        "(0?\\d|1\\d|2[0123]):(0?\\d|[12345]\\d):(0?\\d|[12345]\\d)";

      var reg;
      if (type == "date") {
        reg = RegExp(dateRegStr);
      } else if (type == "time") {
        reg = RegExp(timeRegStr);
      } else {
        reg = RegExp("^" + dateRegStr + "\\s+" + timeRegStr + "$");
      }
      // var reg = /^20\d{2}(\-|\/)(0?\d|1[012])\1(0?\d|[12]\d|3[01])\s+(0?\d|1\d|2[0123]):(0?\d|[12345]\d):(0?\d|[12345]\d)$/;
      if (reg.test(value)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  /**
   * [isUri 是否是一条网络地址]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  isUri: function(value) {
    var reg = /^(http|https|ftp)?:\/\/[\w\W]+$/;
    if (typeof value == "string" && value && reg.test(value)) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 是否IP地址
   * @param {*} value
   * @param {*} type [v4, v6], 不写为两者中的一种类型就可
   */
  isIp(value, type) {
    var reg4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    var reg6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    if (type == "v4") {
      return reg4.test(value);
    } else if (type == "v6") {
      return reg6.test(value);
    } else {
      return reg4.test(value) || reg6.test(value);
    }
  },

  /**
   * [isUri 是否是mac地址]
   * @param  {[String]}  value [description]
   * @return {Boolean}       [description]
   */
  isMacAddr: function(value, connector) {
    var connectorTxt = "\\-|\\:";
    if (connector == "-" || connector == ":") {
      connectorTxt = "\\" + connector;
    }
    var regStr = "^([A-Fa-f0-9]{2}(" + connectorTxt + ")){5}[A-Fa-f0-9]{2}$";
    var reg = RegExp(regStr);
    if (reg.test(value)) {
      return true;
    } else {
      return false;
    }
  }
};

export default esRules;
