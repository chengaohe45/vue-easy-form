// import utils from "../libs/utils";
import formUtils from "../libs/form-utils";
import utils from "../libs/utils";
import constant from "../libs/constant";
export default {
  created() {},

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
        this.$emit("input", newValue, eventData);
      }
    },

    delAllItems() {
      if (this.schema.__propSchemaList.length > 0) {
        var oldValue = formUtils.getValue(this.schema);
        this.schema.__propSchemaList = [];
        var eventData = { type: "deleteAll", index: -1, data: oldValue };
        var newValue = formUtils.getValue(this.schema);
        this.$emit("input", newValue, eventData);
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
        this.$emit("input", newValue, eventData);
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
        this.$emit("input", newValue, eventData);
      }
    },

    __addItem(index) {
      var insertInfo = false,
        oldValue,
        position;

      oldValue = formUtils.getValue(this.schema);
      var isIndex = utils.isNum(index);
      position = isIndex ? index + 1 : this.schema.__propSchemaList.length;
      var insertValue = this.schema.array.insertValue;
      if (!utils.isUndef(insertValue)) {
        if (utils.isFunc(insertValue)) {
          // 是一个函数，过滤
          var thisFrom = this.__getForm();
          var rawDefaultValue = utils.deepCopy(oldValue[index]);
          var newDefaultValue = insertValue.call(
            thisFrom,
            oldValue,
            position,
            isIndex ? "copy" : "add"
          );
          if (utils.isUndef(newDefaultValue)) {
            if (isIndex) {
              insertInfo = {
                value: rawDefaultValue, // 没有默认值，那就取拷贝的那行
                position: position
              };
            } else {
              insertInfo = false; // 没有返回值，那就不设置
            }
          } else {
            insertInfo = {
              value: newDefaultValue,
              position: position
            };
          }
        } else {
          insertInfo = {
            value: utils.deepCopy(insertValue),
            position: position
          }; // 固定的值
        }
      } else if (isIndex) {
        insertInfo = {
          value: utils.deepCopy(oldValue[index]),
          position: position
        }; // 固定的值
      }

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
      this.$emit("input", newValue, eventData); //同步更新的
    },

    __getForm() {
      var formItem = this.$parent;
      while (formItem) {
        var type = formItem._getType ? formItem._getType() : "";
        if (type == constant.UI_FORM) {
          // formItem._syncUi(checkSchema, eventNames, targetValue, eventData); // 最外层的表单层同步所有的ui及数位
          return formItem; // 到达表单层
        } else if (type == constant.UI_ARRAY) {
          // checkSchema.push(formItem._getSchema());
        } else {
          // ... 往上派
        }
        formItem = formItem.$parent;
      }
    }
  }
};
