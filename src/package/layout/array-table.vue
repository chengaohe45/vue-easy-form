<template>
  <div class="es-form-array-table">
    <table class="es-table">
      <thead class="es-table-thead">
        <th
          class="es-table-th es-order-fixed"
          v-if="schema.array.hasOrder !== false"
          :style="__createTdStyle()"
        >
          序号
        </th>
        <template v-for="(layoutItem, headerFieldName) in __createPropLayout()">
        <th
          class="es-table-th"
          :key="headerFieldName"
          :style="layoutItem.headStyle"
        >
          <div
            :class="[
              'es-form-table-head',
              schema.properties[headerFieldName].label ? mxParseAlignClass(schema.properties[headerFieldName].label.align, schema.properties[headerFieldName].__info, 'es-form-component-') : ''
            ]"
          >
            <span
              v-if="
                mxParseBoolValue(schema.array.headRequired, schema.__info) &&
                schema.properties[headerFieldName].rules &&
                  mxParseBoolValue(schema.properties[headerFieldName].rules.required, schema.properties[headerFieldName].__info) &&
                  mxParseBoolValue(schema.properties[headerFieldName].rules.showRequired, schema.properties[headerFieldName].__info)
              "
              class="es-required"
              >*</span
            >
            <!-- schema.properties[headerFieldName].label.hidden为true: 也补充key -->
            <template v-if="mxShowComponent(schema.properties[headerFieldName].label, schema.properties[headerFieldName].__info)">
              <!-- <span v-if="!schema.properties[headerFieldName].label.name">
                {{
                  schema.properties[headerFieldName].label.text
                    ? schema.properties[headerFieldName].label.text
                    : headerFieldName + ""
                }}
              </span> -->
              <span class="es-form-label-box">
                <es-base
                  :config="schema.properties[headerFieldName].label"
                  :info="schema.properties[headerFieldName].__info"
                ></es-base>
              </span>
              <span
                class="es-form-label-help"
                v-if="mxShowComponent(schema.properties[headerFieldName].label.help, schema.properties[headerFieldName].__info)"
              >
                <es-base
                  :config="schema.properties[headerFieldName].label.help"
                  :info="schema.properties[headerFieldName].__info"
                ></es-base>
              </span>
            </template>
            <template v-else>
              {{ headerFieldName + "" }}
            </template>
            <!-- <span
              v-if="schema.properties[headerFieldName].help && !schema.help.hidden"
              class="es-form-help"
            >
              <es-base
                :config="schema.properties[headerFieldName].help"
                :info="schema.properties[headerFieldName].__info"
              ></es-base>
            </span> -->
          </div>
        </th>
        </template>
        <th
          class="es-table-th es-btn-fixed"
          v-if="schema.array.hasDelete || schema.array.hasSort"
          :style="__createTdStyle()"
        >
          操作
        </th>
      </thead>
      <tbody>
        <tr v-for="(itemSchema, index) in schema.__propSchemaList" :key="index">
          <td
            class="es-table-td"
            v-if="schema.array.hasOrder !== false"
            :style="__createTdStyle()"
          >
            <span
              class="es-order-txt"
              :style="mxCreateRowHeightStyle(schema.array.rowHeight, itemSchema.__info, ['lineHeight'])"
              >{{ index + 1 }}.</span
            >
          </td>
          <template v-for="fieldName in __fetchValidFeldNames()">
            <td
              class="es-table-td"
              :key="fieldName"
              :style="__createTdStyle(itemSchema.properties[fieldName], { textAlign: mxParseAlignClass(itemSchema.properties[fieldName].label.align, itemSchema.properties[fieldName].__info) })"
            >
              <es-object-table
                :schema="itemSchema.properties[fieldName]"
                :has-required="!mxParseBoolValue(schema.array.headRequired, schema.__info)"
              >
                <slot
                  :name="fieldName"
                  :schema="itemSchema.properties[fieldName]"
                  :index="index"
                  :refName="fieldName + '_' + index"
                ></slot>
              </es-object-table>
            </td>
          </template>
          <td
            class="es-table-td"
            v-if="
              schema.array.hasDelete ||
                schema.array.hasSort ||
                schema.array.hasCopy
            "
            :style="__createTdStyle()"
          >
            <div
              class="es-btn-box"
              :style="mxCreateRowHeightStyle(schema.array.rowHeight, itemSchema.__info, ['height'])"
            >
              <edit-btns
                v-if="schema.array.btnType !== 'icon'"
                :has-delete="schema.array.hasDelete"
                :has-sort="schema.array.hasSort"
                :can-delete="schema.__propSchemaList.length > schema.array.min"
                :fixed="schema.array.fixed"
                :is-first="index == 0"
                :is-last="index == schema.__propSchemaList.length - 1"
                :index="index"
                :has-del-warn="schema.array.hasDelWarn"
                :can-add="
                  schema.array.max <= 0 ||
                    schema.__propSchemaList.length < schema.array.max
                "
                :has-add="schema.array.hasCopy"
                @copyItem="copyItem"
                @delItem="delItem"
                @upItem="upItem"
                @downItem="downItem"
                :del-msg="itemSchema.delMsg"
                :del-warn-btns="itemSchema.delWarnBtns"
                :info="itemSchema.__info"
              ></edit-btns>
              <edit-abbr-btns
                v-else
                :has-delete="schema.array.hasDelete"
                :has-sort="schema.array.hasSort"
                :can-delete="schema.__propSchemaList.length > schema.array.min"
                :fixed="schema.array.fixed"
                :is-first="index == 0"
                :is-last="index == schema.__propSchemaList.length - 1"
                :index="index"
                :has-del-warn="schema.array.hasDelWarn"
                :can-add="
                  schema.array.max <= 0 ||
                    schema.__propSchemaList.length < schema.array.max
                "
                :has-add="schema.array.hasCopy"
                @copyItem="copyItem"
                @delItem="delItem"
                @upItem="upItem"
                @downItem="downItem"
                :del-msg="itemSchema.delMsg"
                :del-warn-btns="itemSchema.delWarnBtns"
                :info="itemSchema.__info"
              ></edit-abbr-btns>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot class="es-table-tfooter" v-if="schema.array.hasDelete || schema.array.hasAdd">
        <tr class="es-table-tr">
          <td
            class="es-table-td"
            colspan="100%"
            :style="__createTdStyle()"
          >
            <edit-bottom-btns
              :has-delete="
                schema.array.hasDelete &&
                  schema.array.min <= 0 &&
                  schema.array.fixed <= 0
              "
              :has-add="schema.array.hasAdd"
              :can-delete="
                schema.__propSchemaList.length > 0 &&
                  schema.array.fixed <= 0 &&
                  schema.array.min <= 0
              "
              :index="-1"
              :has-del-warn="schema.array.hasDelWarn"
              :can-add="
                schema.array.max <= 0 ||
                  schema.__propSchemaList.length < schema.array.max
              "
              @delItem="delAllItems"
              @addItem="addItem"
              :del-msg="schema.array.delAllMsg"
              :del-warn-btns="schema.array.delWarnBtns"
              :info="schema.__info"
            ></edit-bottom-btns>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
.es-form-array-table {
  .es-table {
    width: 100%;
    max-width: 100%;
    background-color: transparent;
    border-collapse: separate;
    border-spacing: 0px;
    border-radius: 4px;
    // overflow: hidden;
    border: 1px solid #e6ebf5;
    // table-layout: fixed;
    .es-table-thead {
      margin: 0;
      padding: 0;
    }
    .es-table-td,
    .es-table-th {
      text-align: center;
      padding: 10px;
      vertical-align: top;
      border-top: 1px solid #e6ebf5;
      border-right: 1px solid #e6ebf5;
      white-space: nowrap;
      &:last-child {
        border-right: none;
      }
    }
    .es-table-th {
      border-top: none;
    }

    .es-table-tfoot .es-table-tr:last-child .es-table-td {
      border-bottom: none;
    }

    .es-order-fixed {
      width: 40px;
    }
    .es-order-txt {
      // line-height: 40px;
      display: block;
    }

    .es-form-table-head {
      @include display-center;
    }

    .es-table-required {
      display: block;
      margin-right: 5px;
    }

    .es-form-table-content {
      @include display-flex;
      @include direction-h;
    }

    .es-btn-box {
      // @include flex-fixed;
      @include display-center;
    }
  }
}
</style>

<script>
import esObjectTable from "./object-table";
import itemMixin from "../mixins/item-mixin";
import arrayMixins from "../mixins/array-mixin.js";
import editBtns from "../components/edit-btns";
import editAbbrBtns from "../components/edit-abbr-btns";
import editBottomBtns from "../components/edit-bottom-btns";
import esBase from "../base";
import constant from '../libs/constant';
import utils from "../libs/utils";

export default {
  mixins: [itemMixin, arrayMixins],
  components: {
    esBase,
    esObjectTable,
    editBtns,
    editAbbrBtns,
    editBottomBtns
  },
  methods: {

    /**
     * 对table数组布局，重新计算长度，使项相加为UI_MAX_COL(24列)
     */
    __createPropLayout() {
      var schema = this.schema;
      var validFieldNames = this.__fetchValidFeldNames()
      var newLayoutProperties = {}
      if (schema.properties) {
        var curProp = schema.properties;
        var nextLayoutPropItem, key, newCol;
        var total = 0;
        // 判断是否合法
        var isValidCol = true;
        validFieldNames.forEach(function(key) {
          var nextPropItem = curProp[key];
          var newNextLayoutItem = {
            col: nextPropItem.col
          }
          if (!utils.isNum(nextPropItem.col)) {
            isValidCol = false; // 存在不合法的长度
            console.warn(
              "table数组所有项的长度col只能设置为整数，不能是对象，否则每一项将均分长度；现项(key为" +
                key +
                ")设置长度为对象"
            );
          }
          newLayoutProperties[key] = newNextLayoutItem;
        })
        if (!isValidCol) {
          for (key in newLayoutProperties) {
            newLayoutProperties[key]["col"] = constant.UI_MAX_COL; // 均分
          }
        }

        for (key in newLayoutProperties) {
          total += newLayoutProperties[key]["col"];
        }

        var newTotal = 0;
        if (total !== constant.UI_MAX_COL) {
          for (key in newLayoutProperties) {
            nextLayoutPropItem = newLayoutProperties[key];
            newCol = Math.round((nextLayoutPropItem.col * constant.UI_MAX_COL) / total);
            nextLayoutPropItem.col = newCol;
            newTotal += newCol;
          }
        }

        if (newTotal < constant.UI_MAX_COL) {
          // 不够100%， 补给后面的
          var lastFieldName = validFieldNames[validFieldNames.length - 1]
          newLayoutProperties[lastFieldName].col = newLayoutProperties[lastFieldName].col + (constant.UI_MAX_COL - newTotal);
        }

        // 计算转化为头部style
        for (key in newLayoutProperties) {
          nextLayoutPropItem = newLayoutProperties[key];
          var headStyle = this.__createTdStyle(this.schema, { width: this.__intToPercent(nextLayoutPropItem.col)});
          nextLayoutPropItem.headStyle = headStyle;
        }
      }
      // console.log('newLayoutProperties', newLayoutProperties)
      return newLayoutProperties;
    },

    __intToPercent(col) {
      if (utils.isNum(col)) {
        return Math.floor((col * 1000000) / constant.UI_MAX_COL) / 10000 + "%"; // 保留4位
      } else {
        return col;
      }
    },

    /**
     * 计算两个值之和，不能相加就返回false
     * @param {*} val1
     * @param {*} val2
     */
    __countValue(val1, val2) {
      var unit, sum;
      if (val1 === constant.WIDTH_AUTO && val2 === constant.WIDTH_AUTO) {
        return constant.WIDTH_AUTO;
      } else if (utils.isPercent(val1) && utils.isPercent(val2)) {
        unit = "%";
        sum =
          parseFloat(val1.substr(0, val1.length - unit.length)) +
          parseFloat(val2.substr(0, val2.length - unit.length));
        return (sum > 100 ? 100 : sum) + unit;
      } else if (utils.isPx(val1) && utils.isPx(val2)) {
        unit = "px";
        sum =
          parseFloat(val1.substr(0, val1.length - unit.length)) +
          parseFloat(val2.substr(0, val2.length - unit.length));
        return sum + unit;
      } else {
        return false;
      }
    },
    
    /**
     * 显示可显示的列
     */
    __fetchValidFeldNames() {
      var allFieldNames = [];
      var schema = this.schema;
      for (var fieldName in schema.properties) {
        var propItem = schema.properties[fieldName];
        if (!propItem.layout || propItem.layout.name !== constant.LAYOUT_SPACE) {
          allFieldNames.push(fieldName)
        } else {
          // 占位空间要去掉
        }
      }
      var visibleFieldNames
      if (schema.__propSchemaList) {
        var propSchemaList = schema.__propSchemaList;
        visibleFieldNames = allFieldNames.filter(function(fieldName) {
          // 行中，只要一个存在，那么此列就显示
          var target = propSchemaList.find(function(propSchemaItem) {
            var tmpProperties = propSchemaItem.properties;
            if (fieldName in tmpProperties) {
              var nextPropItem = tmpProperties[fieldName];
              return !nextPropItem.hidden;
            }
            return false;
          })
          return !!target;
        })
      } else {
        visibleFieldNames = [];
      }
      // console.log('visibleFieldNames', visibleFieldNames)
      return visibleFieldNames;
    },
    __createTdStyle(schema, mergeStyle) {
      schema = schema || this.schema;
      var newRowSpace = this.mxParseRowSpace(this.schema.array.rowSpace, schema.__info, undefined)
      // console.log('newRowSpace', newRowSpace)
      if (newRowSpace !== undefined) {
        var style = { paddingTop: Math.floor(newRowSpace/2) + 'px', paddingBottom: Math.floor(newRowSpace/2) + 'px' };
        return mergeStyle ? Object.assign(style, mergeStyle) : style
      } else {
        return mergeStyle ? mergeStyle : undefined
      }
    }

  }
};
</script>
