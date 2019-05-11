function __trim(value) {
  if (typeof value == "string") {
    return value.replace("^s+|s+$", "");
  } else {
    return "";
  }
}

function __inArray(value, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (value == arr[i]) {
      return i;
    }
  }
  return -1;
}

function __extend(destObj, sourceObj) {
  for (var key in sourceObj) {
    destObj[key] = sourceObj[key];
  }
  return destObj;
}

function __isFunction(obj) {
  return typeof obj === "function";
}

/* 主题事件监听 */
/*
 * 主题类
 * @param {String} eventStr 这个主题所需要触发的全部事件,当是多个事件的时候，用空格隔开 如:"J_eventName", "J_eventName1 J_eventName2"
 * @param {function} cb 所需要的事件全部触发，所需执行的回调函数
 * @param context       上下文对象
 * @param {Object} data     所携带的信息
 */
function Subject(eventStr, cb, context, data) {
  eventStr = __trim(eventStr); /* 去年左右两边的空格 */
  if (!eventStr) {
    throw "主题不能没有触发事件...";
    // return false;
  }

  if (!__isFunction(cb)) {
    throw "主题不能没有回调函数...";
    // return false;
  }

  var sysEvents = eventStr.split(/\s+/g);
  /* 按字符串从小到大排列 */
  sysEvents.sort();
  /* 去重复 */
  var uSysEvents = [sysEvents[0]];
  for (var i = 1, len = sysEvents.length; i < len; i++) {
    if (sysEvents[i] !== uSysEvents[i - 1]) {
      uSysEvents.push(sysEvents[i]);
    }
  }

  this.sysEvents = uSysEvents;
  this.curEvents = [];

  this.context = context;
  this.cb = cb;
  this.data = data || {};
}

Subject.prototype = {
  /*
            添加触发的事件
            @param eventName 需要添加已触发的事件
            @param data 这个事件所携带的信息
            @return true/false  true--添加成功; false---添加失败
         */
  addEvent: function(eventName, data) {
    if (this._hasEvent(eventName)) {
      var curEvents = this.curEvents;
      var hasInsert = false;
      for (var i = 0, len = curEvents.length; i < len; i++) {
        if (curEvents[i] === eventName) {
          /* 该事件已经触发存在，不需要记录 */
          hasInsert = true;
          break;
        } else if (curEvents[i] > eventName) {
          /* 因为sysEvents是从小到大排列，那么curEvents也应从小到大排列，以便更好比较 */
          if (i == 0) {
            curEvents.unshift(eventName);
          } else {
            curEvents.splice(i - 1, 0, eventName);
          }
          hasInsert = true;
          break;
        }
      }

      /* 没有插入数组，放进最后 */
      if (!hasInsert) {
        curEvents.push(eventName);
      }

      if (data) {
        __extend(this.data, data);
      }

      return true;
    } else {
      return false;
    }
  },

  /* 
            若触发主题的条件符合了，则触发；触发后，原触发的事件清空 
            @return true/false
        */
  exec: function() {
    /* 判断条件是否符合，符合就执行 */
    if (this.sysEvents.length === this.curEvents.length) {
      /* 只要长度OK就行了，不是因为前面加入事件时已经做了限制 */
      this.cb.call(this.context, this.data);
      this.clear();
      return true;
    }
    return false;
  },

  /* 清除所有触发的事件 */
  clear: function() {
    this.curEvents = [];
    this.data = {};
  },

  /* 
        这个主题类是否登记这个事件 
        @param eventName 这个主题需要这个事件
        */
  _hasEvent: function(eventName) {
    var sysEvents = this.sysEvents;
    for (var i = 0, len = sysEvents.length; i < len; i++) {
      if (sysEvents[i] === eventName) {
        return true;
      }
    }
    return false;
  },

  /**
            判断主题是否包含某组事件
            @param {String} eventStr 所需要判断的事件;当是多个事件的时候，用空格隔开 如:"J_eventName", "J_eventName1 J_eventName2"
            @param {Function} func 绑定的回调函数,为null则只判断eventStr的匹配
            @isAll 是否完成匹配，默认为true
        */
  hasInclude: function(eventStr, func, isAll) {
    if (func && this.cb != func) {
      return false;
    }
    if (eventStr) {
      var i, len;
      isAll = isAll !== false ? true : false;
      var sysEvents = this.sysEvents;
      var tmpEvents = eventStr.split(/\s+/g);
      if (isAll) {
        /* 完全区配 */
        if (sysEvents.length == tmpEvents.length) {
          /* 按字符串从小到大排列 */
          tmpEvents.sort();
          i = 0;
          len = sysEvents.length;
          for (; i < len; i++) {
            if (sysEvents[i] !== tmpEvents[i]) {
              return false;
            }
          }
        } else {
          return false;
        }
      } else {
        /* 子集就可以了 */
        i = 0;
        len = tmpEvents.length;
        for (; i < len; i++) {
          while (__inArray(tmpEvents[i], sysEvents) == -1) {
            return false;
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }
};

var Listeners = {
  _subjList: [] /* 记录所有的主题 */,

  /*
   * 订阅主题
   * @param {String} eventStr 主题所需要触发的全部事件,当是多个事件的时候，用空格隔开 如:"J_eventName", "J_eventName1 J_eventName2"
   * @param {function} cb 所需要的事件全部触发，所需执行的回调函数
   * @param context       上下文对象
   * @param {Object} data     所携带的信息
   */
  sub: function(eventStr, cb, context, data) {
    /* 判断条件合法性 */
    eventStr = __trim(eventStr);
    if (!eventStr) {
      throw "监听时不能没有触发事件...";
      // return false;
    }

    if (!__isFunction(cb)) {
      throw "监听时不能没有回调函数...";
      // return false;
    }

    if (!this.hasEvent(eventStr, cb, true)) {
      this._subjList.push(new Subject(eventStr, cb, context, data));
    } else {
      //已经存在，不理会
    }
  },

  /*
   * 取消订阅主题
   * @param {String} eventStr 主题所需要触发的全部事件,当是多个事件的时候，用空格隔开 如:"J_eventName", "J_eventName1 J_eventName2"
   * @param {Function} func 绑定的回调函数
   * @isAll 是否完成匹配，默认为true
   */
  unsub: function(eventStr, func, isAll) {
    eventStr = __trim(eventStr);
    var subjList = this._subjList;
    for (var i = 0, len = subjList.length; i < len; i++) {
      var subject = subjList[i];
      if (subject.hasInclude(eventStr, func, isAll)) {
        subjList.splice(i, 1);
        i--;
        len = subjList.length;
      }
    }
  },

  /*
   * 重置订阅主题
   * @param {String} eventStr 主题所需要触发的全部事件,当是多个事件的时候，用空格隔开 如:"J_eventName", "J_eventName1 J_eventName2"
   * @param {Function} func 绑定的回调函数
   * @isAll 是否完成匹配，默认为true
   */
  reset: function(eventStr, func, isAll) {
    eventStr = __trim(eventStr);
    var subjList = this._subjList;
    for (var i = 0, len = subjList.length; i < len; i++) {
      var subject = subjList[i];
      if (subject.hasInclude(eventStr, func, isAll)) {
        subject.clear();
      }
    }
  },

  /*
   * 派发事件
   * @param {String} eventName 单一事件名 如:"J_eventName"
   * @data {Object} 所携带的数据
   */
  pub: function(eventName, data) {
    var subjList = this._subjList;
    for (var i = 0, len = subjList.length; i < len; i++) {
      var subject = subjList[i];
      if (subject.addEvent(eventName, data)) {
        subject.exec();
      }
    }
  },

  /*
   * 判断该事件的主题是否存在
   * @param {String} eventStr 主题所需要触发的全部事件,当是多个事件的时候，用空格隔开 如:"J_eventName", "J_eventName1 J_eventName2"
   * @param {Function} func 绑定的回调函数
   * @isAll 是否完成匹配，默认为true
   */
  hasEvent: function(eventStr, func, isAll) {
    var subjList = this._subjList;
    for (var i = 0, len = subjList.length; i < len; i++) {
      var subject = subjList[i];
      if (subject.hasInclude(eventStr, func, isAll)) {
        return true;
      }
    }
    return false;
  }
};

export default Listeners;
