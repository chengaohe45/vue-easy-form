// import utils from "../libs/utils";
import formUtils from "../libs/form-utils";
import utils from "../libs/utils";
import constant from "../libs/constant";
export default {
  created() {},

  // props: {
  //   schema: {
  //     type: Object,
  //     default() {
  //       return {};
  //     }
  //   }
  // },

  data() {
    return {};
  },

  methods: {
    addItem() {
      this.__addItem();
    },

    copyItem(index) {
      this.__addItem(index);
    },

    delItem(index) {
      if (index >= 0 && index < this.schema.__propSchemaList.length) {
        var oldValue = formUtils.getValue(this.schema);
        this.schema.__propSchemaList.splice(index, 1);
        formUtils.resetIndexArr(
          this.schema,
          this.schema.__idxChain,
          this.schema.__pathKey
        );
        var eventData = {
          type: "delete",
          index: index,
          data: utils.deepCopy(oldValue[index])
        };
        var newValue = formUtils.getValue(this.schema);
        this.$emit(
          "input",
          this.schema.__pathKey,
          this.getHandlers(),
          newValue,
          eventData
        );
      }
    },

    delAllItems() {
      if (this.schema.__propSchemaList.length > 0) {
        var oldValue = formUtils.getValue(this.schema);
        this.schema.__propSchemaList = [];
        var eventData = { type: "deleteAll", index: -1, data: oldValue };
        var newValue = formUtils.getValue(this.schema);
        this.$emit(
          "input",
          this.schema.__pathKey,
          this.getHandlers(),
          newValue,
          eventData
        );
      }
    },

    upItem(index) {
      if (index > 0 && index < this.schema.__propSchemaList.length) {
        this.schema.__propSchemaList.splice(
          index - 1,
          0,
          this.schema.__propSchemaList.splice(index, 1)[0]
        );
        formUtils.resetIndexArr(
          this.schema,
          this.schema.__idxChain,
          this.schema.__pathKey
        );
        var eventData = { type: "up", index: index };
        var newValue = formUtils.getValue(this.schema);
        this.$emit(
          "input",
          this.schema.__pathKey,
          this.getHandlers(),
          newValue,
          eventData
        );
      }
    },

    downItem(index) {
      if (index >= 0 && index < this.schema.__propSchemaList.length - 1) {
        this.schema.__propSchemaList.splice(
          index + 1,
          0,
          this.schema.__propSchemaList.splice(index, 1)[0]
        );
        formUtils.resetIndexArr(
          this.schema,
          this.schema.__idxChain,
          this.schema.__pathKey
        );
        var eventData = { type: "down", index: index };
        var newValue = formUtils.getValue(this.schema);
        this.$emit(
          "input",
          this.schema.__pathKey,
          this.getHandlers(),
          newValue,
          eventData
        );
      }
    },

    getHandlers() {
      var inputHandlers = formUtils.getHandlers(
        constant.INPUT_EVENT,
        this.schema.array.actions
      );
      var changeHandlers = formUtils.getHandlers(
        constant.CHANGE_EVENT,
        this.schema.array.actions
      );
      if (inputHandlers || changeHandlers) {
        inputHandlers = inputHandlers ? inputHandlers : [];
        changeHandlers = changeHandlers ? changeHandlers : [];
        return inputHandlers.concat(changeHandlers); // input先执行，change后执行
      } else {
        return null;
      }
    },

    __addItem(index) {
      var insertInfo = false,
        oldValue;

      var isIndex = utils.isNum(index);
      if (isIndex) {
        // 拷贝某一项
        oldValue = formUtils.getValue(this.schema);
        insertInfo = {
          value: utils.deepCopy(oldValue[index]),
          position: index + 1
        }; // 固定的值
      } else {
        // 加入最后
        var insertValue = this.schema.array.insertValue;
        if (!utils.isUndef(insertValue)) {
          if (utils.isFunc(insertValue)) {
            // 是一个函数，过滤
            oldValue = formUtils.getValue(this.schema);
            var insertIndex = this.schema.__propSchemaList.length;
            var thisFrom = formUtils.getThisForm(this);
            // console.log("thisFrom", thisFrom);
            var defaultValue = insertValue.call(
              thisFrom,
              oldValue,
              insertIndex
            );
            insertInfo = {
              value: defaultValue,
              position: this.schema.__propSchemaList.length
            };
          } else {
            insertInfo = {
              value: utils.deepCopy(insertValue),
              position: this.schema.__propSchemaList.length
            }; // 固定的值
          }
        }
      }

      // console.log(
      //   "this.schema.__idxChain, this.schema.__pathKey",
      //   this.schema.__idxChain,
      //   this.schema.__pathKey
      // );
      formUtils.addArrayItem(this.schema, insertInfo);
      formUtils.resetIndexArr(
        this.schema,
        this.schema.__idxChain,
        this.schema.__pathKey
      );
      var newValue = formUtils.getValue(this.schema);
      var curIndex = isIndex ? index : this.schema.__propSchemaList.length - 1;
      var eventData = {
        type: isIndex ? "copy" : "add",
        index: curIndex,
        data: utils.deepCopy(newValue[curIndex])
      };
      this.$emit(
        "input",
        this.schema.__pathKey,
        this.getHandlers(),
        newValue,
        eventData
      ); //同步更新的
    }
  }
};
