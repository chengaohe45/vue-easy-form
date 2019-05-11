var uri = {
  query(name, fromHash) {
    var search = fromHash ? window.location.hash : location.search;
    if (search) {
      var regStr = "(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)";
      var reg = new RegExp(regStr, "i");
      if (reg.test(search)) {
        return window.decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
      }
    }
    return "";
  },

  get(name) {
    var val = this.query(name);
    if (!val) {
      val = this.query(name, true);
    }
    return val;
  },

  has(name, fromHash) {
    var search = fromHash ? window.location.hash : location.search;
    if (search) {
      var regStr = "(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)";
      var reg = new RegExp(regStr, "i");
      if (reg.test(search)) {
        return true;
      }
    }
    return false;
  }
};

export default uri;
