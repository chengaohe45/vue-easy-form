export default {
  props: {
    schema: {
      type: Object,
      default() {
        return {};
      }
    },

    //是否在控件的后面显示help，这个主要用于array-table,因为array-table的help是放在头部的，此值会为false
    showHelpInBody: {
      type: Boolean,
      required: false,
      default: true
    }
  }
};
