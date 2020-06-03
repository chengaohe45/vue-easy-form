// import utils from "../libs/utils";
import formUtils from "../libs/form-utils";
import utils from "../libs/utils";
import constant from "../libs/constant";

/* 这个几个不可随便更改，因为对外，用户有可能会使用 */
const ARR_OP_TYPE_DEL_ONE = "delete"; // 单个delete
const ARR_OP_TYPE_DEL_ALL = "deleteAll"; // 所有delete
const ARR_OP_TYPE_ADD = "add"; // add
const ARR_OP_TYPE_COPY = "copy"; // copy
const ARR_OP_TYPE_MOVE_UP = "up"; // up
const ARR_OP_TYPE_MOVE_DOWN = "down"; // down

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
        var oldValues = formUtils.getValue(this.schema);
        var eventData = {
          type: ARR_OP_TYPE_DEL_ONE,
          index: index,
          data: utils.deepCopy(oldValues[index])
        };

        if (this.schema.array.before) {
          var data = this.__createHookData(oldValues, eventData);
          var form = this.__getForm();
          utils.execCbHook(this.schema.array.before, form, data, result => {
            if (result !== false) {
              this.__doDelItem(index, eventData);
            } else {
              //返回false,说明什么都不用做
            }
          });
          data = null;
          form = null;
        } else {
          this.__doDelItem(index, eventData);
        }
      }
    },

    __doDelItem(index, eventData) {
      if (index >= 0 && index < this.schema.__propSchemaList.length) {
        this.schema.__propSchemaList.splice(index, 1);
        formUtils.resetIndexArr(
          this.schema,
          this.schema.__info.idxChain,
          this.schema.__info.pathKey
        );
        var newValue = formUtils.getValue(this.schema);
        this.$emit("input", newValue, eventData);
      }
    },

    delAllItems() {
      if (this.schema.__propSchemaList.length > 0) {
        var oldValues = formUtils.getValue(this.schema);
        var eventData = {
          type: ARR_OP_TYPE_DEL_ALL,
          index: -1,
          data: oldValues
        };

        if (this.schema.array.before) {
          var data = this.__createHookData(oldValues, eventData);
          var form = this.__getForm();
          utils.execCbHook(this.schema.array.before, form, data, result => {
            if (result !== false) {
              this.__doDelAllItems(eventData);
            } else {
              //返回false,说明什么都不用做
            }
          });
          data = null;
          form = null;
        } else {
          this.__doDelAllItems(eventData);
        }
      }
    },

    __doDelAllItems(eventData) {
      if (this.schema.__propSchemaList.length > 0) {
        this.schema.__propSchemaList = [];
        var newValue = formUtils.getValue(this.schema);
        this.$emit("input", newValue, eventData);
      }
    },

    upItem(index) {
      if (index > 0 && index < this.schema.__propSchemaList.length) {
        var oldValues = formUtils.getValue(this.schema);
        var eventData = { type: ARR_OP_TYPE_MOVE_UP, index: index };
        if (this.schema.array.before) {
          var data = this.__createHookData(oldValues, eventData);
          var form = this.__getForm();
          utils.execCbHook(this.schema.array.before, form, data, result => {
            if (result !== false) {
              this.__doUpItem(index, eventData);
            } else {
              //返回false,说明什么都不用做
            }
          });
          data = null;
          form = null;
        } else {
          this.__doUpItem(index, eventData);
        }
      }
    },

    __doUpItem(index, eventData) {
      if (index > 0 && index < this.schema.__propSchemaList.length) {
        this.schema.__propSchemaList.splice(
          index - 1,
          0,
          this.schema.__propSchemaList.splice(index, 1)[0]
        );
        formUtils.resetIndexArr(
          this.schema,
          this.schema.__info.idxChain,
          this.schema.__info.pathKey
        );
        var newValue = formUtils.getValue(this.schema);
        this.$emit("input", newValue, eventData);
      }
    },

    downItem(index) {
      if (index >= 0 && index < this.schema.__propSchemaList.length - 1) {
        var oldValues = formUtils.getValue(this.schema);
        var eventData = { type: ARR_OP_TYPE_MOVE_DOWN, index: index };
        if (this.schema.array.before) {
          var data = this.__createHookData(oldValues, eventData);
          var form = this.__getForm();
          utils.execCbHook(this.schema.array.before, form, data, result => {
            if (result !== false) {
              this.__doDownItem(index, eventData);
            } else {
              //返回false,说明什么都不用做
            }
          });
          data = null;
          form = null;
        } else {
          this.__doDownItem(index, eventData);
        }
      }
    },

    __doDownItem(index, eventData) {
      if (index >= 0 && index < this.schema.__propSchemaList.length - 1) {
        this.schema.__propSchemaList.splice(
          index + 1,
          0,
          this.schema.__propSchemaList.splice(index, 1)[0]
        );
        formUtils.resetIndexArr(
          this.schema,
          this.schema.__info.idxChain,
          this.schema.__info.pathKey
        );
        var newValue = formUtils.getValue(this.schema);
        this.$emit("input", newValue, eventData);
      }
    },

    __addItem(index) {
      var oldValues = formUtils.getValue(this.schema);
      var isIndex = utils.isNum(index);
      var curIndex = isIndex ? index : this.schema.__propSchemaList.length; // __propSchemaList现在还是旧的
      var eventData = {
        type: isIndex ? ARR_OP_TYPE_COPY : ARR_OP_TYPE_ADD,
        index: curIndex // 比change少了个data，因为刚开始有可能不知初始值是什么，所以统一不做
      };
      if (this.schema.array.before) {
        var data = this.__createHookData(oldValues, eventData);
        var form = this.__getForm();
        utils.execCbHook(this.schema.array.before, form, data, result => {
          if (result !== false) {
            this.__doAddItem(index);
          } else {
            //返回false,说明什么都不用做
          }
        });
        data = null;
        form = null;
      } else {
        this.__doAddItem(index);
      }
    },

    __doAddItem(index) {
      var insertInfo = false,
        oldValues,
        position;

      oldValues = formUtils.getValue(this.schema);
      var isIndex = utils.isNum(index);
      position = isIndex ? index + 1 : this.schema.__propSchemaList.length;
      var insertValue = this.schema.array.insertValue;
      if (!utils.isUndef(insertValue)) {
        if (utils.isFunc(insertValue)) {
          // 是一个函数，过滤
          var thisFrom = this.__getForm();
          var rawDefaultValue = utils.deepCopy(oldValues[index]);

          var options = {
            oldValues: oldValues,
            position: position,
            type: isIndex ? ARR_OP_TYPE_COPY : ARR_OP_TYPE_ADD
          };
          var newDefaultValue = insertValue.call(thisFrom, options);
          options = null;

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
          value: utils.deepCopy(oldValues[index]),
          position: position
        }; // 固定的值
      }

      formUtils.addArrayItem(this.schema, insertInfo);
      formUtils.resetIndexArr(
        this.schema,
        this.schema.__info.idxChain,
        this.schema.__info.pathKey
      );
      var newValue = formUtils.getValue(this.schema);
      var curIndex = isIndex ? index : this.schema.__propSchemaList.length - 1;
      var eventData = {
        type: isIndex ? ARR_OP_TYPE_COPY : ARR_OP_TYPE_ADD,
        index: curIndex,
        data: utils.deepCopy(newValue[curIndex]) // 比before多了这个
      };
      this.$emit("input", newValue, eventData); //同步更新的
    },

    __createHookData(value, eventData) {
      return {
        value: value,
        event: eventData,
        args: [eventData],
        pathKey: this.schema.__info.pathKey,
        index: this.schema.__info.index,
        idxChain: this.schema.__info.idxChain,
        target: null
      };
    },

    __getForm() {
      var formItem = this.$parent;
      while (formItem) {
        var type = formItem._getType ? formItem._getType() : "";
        if (type == constant.UI_FORM) {
          // formItem._syncFormUi(checkSchema, eventNames, targetValue, eventData); // 最外层的表单层同步所有的ui及数位
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
