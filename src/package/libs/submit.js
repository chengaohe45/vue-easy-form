/* 应用于表单组件函数，不能作为其它用途：因为this代表的是表单 */
let onlySubmit = function() {
  this.submit();
};

/**
 * 应用于表单组件函数，不能作为其它用途：因为this代表的是表单, event代表的是keyup事件
 * 参数就是组件事件所对就的参数
 * @param {*} value 当前组件的值
 * @param {*} key 组件的源key
 * @param {*} event 事件所携带的事件
 */
let enterSubmit = function(options) {
  // console.log("value: ", value);
  // console.log("key: ", key);
  if (options.event && options.event.keyCode === 13) {
    this.submit();
  }
};

export { enterSubmit, onlySubmit };
