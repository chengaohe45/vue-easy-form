export default {
  props: {
    schema: {
      type: Object,
      default() {
        return {};
      }
    },

    global: {
      type: Object,
      default() {
        return {};
      }
    },

    // formData: {
    //   type: Object
    // },
    //组成形式（索引,索引,索引）如：0、0,1、 1,12；“索引”用逗号隔开 通俗讲：因为array的值必须是一个数组，array里面包含array(不一定是孩子，也可能是孙子等)，每一个“索引”代表对应array的哪一项
    // 用于记录在数组中的索引
    // idxChain: {
    //   type: String,
    //   default: ""
    // },
    //是否在控件的后面显示help，这个主要用于array-table,因为array-table的help是放在头部的，此值会为false
    showHelpInBody: {
      type: Boolean,
      required: false,
      default: true
    },

    isInited: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
