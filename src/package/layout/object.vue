<template>
  <div class="es-form-container">
    <div
      class="es-form-inner-wrap"
      :style="
        schema.__hasCustomWidth
          ? { marginTop: -schema.ui.rowSpace + 'px' }
          : null
      "
    >
      <template v-for="(fieldSchema, fieldName) in schema.properties">
        <!-- 有些元素同一组（也就是同一行, 内收藏fieldName） -->
        <div
          v-if="fieldSchema.__groups"
          v-show="!fieldSchema.__hiddenGroup"
          :style="fieldSchema.__style"
          class="es-form-object"
          :key="'groups-' + fieldName"
        >
          <template v-for="fieldKeyName in fieldSchema.__groups">
            <template v-if="schema.properties[fieldKeyName].component">
              <label
                v-if="
                  schema.properties[fieldKeyName].__creatable &&
                  mxShowComponent(schema.properties[fieldKeyName].label, schema.properties[fieldKeyName].__info)
                "
                v-show="!schema.properties[fieldKeyName].hidden"
                :style="[
                  {
                    height: schema.properties[fieldKeyName].rowHeight + 'px',
                    lineHeight:
                      schema.properties[fieldKeyName].rowHeight + 'px',
                    marginLeft:
                      schema.properties[fieldKeyName].offsetLeft + 'px'
                  },
                  schema.properties[fieldKeyName].label.flex
                    ? ''
                    : {
                        width: schema.properties[fieldKeyName].labelWidth + 'px'
                      }
                ]"
                :class="[
                  'es-form-label-col',
                  schema.properties[fieldKeyName].label.flex
                    ? 'es-form-label-' +
                      schema.properties[fieldKeyName].label.flex
                    : '',
                  schema.properties[fieldKeyName].label.align
                    ? 'es-form-label-' +
                      schema.properties[fieldKeyName].label.align
                    : ''
                ]"
                :key="'label-' + fieldKeyName"
              >
                <!-- 必填标识 -->
                <span
                  v-if="
                    (schema.properties[fieldKeyName].array &&
                      schema.properties[fieldKeyName].array.rules &&
                      mxParseBoolValue(schema.properties[fieldKeyName].array.rules.required, schema.properties[fieldKeyName].__info) &&
                      mxParseBoolValue(schema.properties[fieldKeyName].array.rules.showRequired, schema.properties[fieldKeyName].__info)) ||
                      (schema.properties[fieldKeyName].rules &&
                        !schema.properties[fieldKeyName].array &&
                        mxParseBoolValue(schema.properties[fieldKeyName].rules.required, schema.properties[fieldKeyName].__info) &&
                        mxParseBoolValue(schema.properties[fieldKeyName].rules.showRequired, schema.properties[fieldKeyName].__info))
                  "
                  class="es-required"
                  >*</span
                >
                <template v-if="!schema.properties[fieldKeyName].label.name">
                  <span>{{ schema.properties[fieldKeyName].label.text }}</span>
                </template>
                <span v-else class="es-form-label-box">
                  <es-base
                    :config="schema.properties[fieldKeyName].label"
                    :info="schema.properties[fieldKeyName].__info"
                  ></es-base>
                </span>
                <span
                  class="es-form-label-help"
                  v-if="mxShowComponent(schema.properties[fieldKeyName].label.help, schema.properties[fieldKeyName].__info)"
                >
                  <es-base
                    :config="schema.properties[fieldKeyName].label.help"
                    :info="schema.properties[fieldKeyName].__info"
                  ></es-base>
                </span>
                <span
                  v-if="schema.properties[fieldKeyName].colon"
                  class="es-form-colon"
                  >:</span
                >
              </label>
              <div
                v-if="schema.properties[fieldKeyName].__creatable"
                v-show="!schema.properties[fieldKeyName].hidden"
                :class="[
                  'es-form-comp-content',
                  schema.properties[fieldKeyName].component &&
                  schema.properties[fieldKeyName].component.flex
                    ? 'es-form-group-' +
                      schema.properties[fieldKeyName].component.flex
                    : ''
                ]"
                :key="'content-' + fieldKeyName"
                :style="[
                  {
                    minHeight: schema.properties[fieldKeyName].rowHeight + 'px',
                    marginLeft:
                      !mxShowComponent(schema.properties[fieldKeyName].label, schema.properties[fieldKeyName].__info)
                        ? schema.properties[fieldKeyName].offsetLeft + 'px'
                        : false,
                    marginRight:
                      schema.properties[fieldKeyName].offsetRight + 'px'
                  }
                ]"
              >
                <slot
                  :schema="schema.properties[fieldKeyName]"
                  :name="fieldKeyName"
                ></slot>
              </div>
              <template v-if="schema.properties[fieldKeyName].__creatable && mxShowComponent(schema.properties[fieldKeyName].unit, schema.properties[fieldKeyName].__info)">
                <div
                  :key="'unit-' + fieldKeyName"
                  class="es-form-unit"
                  :style="[
                    { height: schema.properties[fieldKeyName].rowHeight + 'px' }
                  ]"
                >
                  <es-base
                    :config="schema.properties[fieldKeyName].unit"
                    :info="schema.properties[fieldKeyName].__info"
                  ></es-base>
                </div>

                <!-- <div
                  v-if="schema.properties[fieldKeyName].unit.name"
                  v-show="!schema.properties[fieldKeyName].hidden"
                  :key="'unit-' + fieldKeyName"
                  class="es-form-unit"
                  :style="[
                    { height: schema.properties[fieldKeyName].rowHeight + 'px' }
                  ]"
                >
                  <es-base
                    :config="schema.properties[fieldKeyName].unit"
                    :info="schema.properties[fieldKeyName].__info"
                  ></es-base>
                </div>
                <div
                  v-else
                  v-show="
                    !schema.properties[fieldKeyName].hidden &&
                      schema.properties[fieldKeyName].unit.text
                  "
                  :key="'unit-' + fieldKeyName"
                  class="es-form-unit"
                  :style="[
                    { height: schema.properties[fieldKeyName].rowHeight + 'px' }
                  ]"
                >
                  {{ schema.properties[fieldKeyName].unit.text }}
                </div> -->
              </template>
              <div
                v-show="!schema.properties[fieldKeyName].hidden"
                :key="'help-' + fieldKeyName"
                v-if="schema.properties[fieldKeyName].__creatable && mxShowComponent(schema.properties[fieldKeyName].help, schema.properties[fieldKeyName].__info)"
                class="es-form-help"
                :style="[
                  { height: schema.properties[fieldKeyName].rowHeight + 'px' }
                ]"
              >
                <es-base
                  :config="schema.properties[fieldKeyName].help"
                  :info="schema.properties[fieldKeyName].__info"
                ></es-base>
              </div>
            </template>
            <!-- 占位空间控件: 不判断__creatable，因为是系统的，里面没有用户自定义的东西 -->
            <div
              v-show="!schema.properties[fieldKeyName].hidden"
              v-else
              :key="fieldKeyName"
              :style="schema.properties[fieldKeyName].__style"
              class="es-form-placeholder"
            ></div>
          </template>
        </div>
        <!-- 不是分组情况 -->
        <template
          v-else-if="
            !fieldSchema.__inGroups &&
              (!fieldSchema.layout || fieldSchema.layout.name !== 'space')
          "
        >
          <div
            v-if="fieldSchema.__creatable"
            v-show="!fieldSchema.hidden"
            :style="fieldSchema.__style"
            :class="[
              'es-form-object',
              fieldSchema.direction == 'v' ? 'es-form-v' : ''
            ]"
            :key="fieldName"
          >
            <!-- 一般的控件 -->
            <label
              v-if="mxShowComponent(fieldSchema.label, fieldSchema.__info)"
              :class="[
                'es-form-label-col',
                fieldSchema.direction == 'v' ? 'es-form-label-col-v' : '',
                fieldSchema.label.flex
                  ? 'es-form-label-' + fieldSchema.label.flex
                  : '',
                fieldSchema.label.align
                  ? 'es-form-label-' + fieldSchema.label.align
                  : ''
              ]"
              :style="
                fieldSchema.direction == 'h'
                  ? [
                      {
                        height: fieldSchema.rowHeight + 'px',
                        lineHeight: fieldSchema.rowHeight + 'px'
                      },
                      fieldSchema.label.flex
                        ? {}
                        : {
                            width: fieldSchema.labelWidth + 'px'
                          }
                    ]
                  : {}
              "
            >
              <span
                v-if="
                  (fieldSchema.array &&
                    fieldSchema.array.rules &&
                    mxParseBoolValue(fieldSchema.array.rules.required, fieldSchema.__info) &&
                    mxParseBoolValue(fieldSchema.array.rules.showRequired, fieldSchema.__info)) ||
                    (fieldSchema.rules &&
                      !fieldSchema.array &&
                      mxParseBoolValue(fieldSchema.rules.required, fieldSchema.__info) &&
                      mxParseBoolValue(fieldSchema.rules.showRequired, fieldSchema.__info))
                "
                class="es-required"
                >*</span
              >
              <template v-if="!fieldSchema.label.name">
                <span>{{
                  fieldSchema.direction != "v" || fieldSchema.label.text
                    ? fieldSchema.label.text
                    : "&nbsp;"
                }}</span>
              </template>
              <span v-else class="es-form-label-box">
                <es-base
                  :config="fieldSchema.label"
                  :info="fieldSchema.__info"
                ></es-base>
              </span>
              <span
                class="es-form-label-help"
                v-if="mxShowComponent(fieldSchema.label.help, fieldSchema.__info)"
              >
                <es-base
                  :config="fieldSchema.label.help"
                  :info="fieldSchema.__info"
                ></es-base>
              </span>
              <span v-if="fieldSchema.colon" class="es-form-colon">:</span>
            </label>
            <div
              :class="
                fieldSchema.properties
                  ? 'es-form-props-content'
                  : 'es-form-comp-content'
              "
              :style="
                fieldSchema.direction == 'h'
                  ? [{ minHeight: fieldSchema.rowHeight + 'px' }]
                  : ''
              "
            >
              <slot :name="fieldName"></slot>
            </div>
          </div>
        </template>
        <!-- 占位空间控件: 不判断__creatable，因为是系统的，里面没有用户自定义的东西 -->
        <div
          v-show="!fieldSchema.hidden"
          v-else-if="!fieldSchema.__inGroups && !fieldSchema.component"
          :style="fieldSchema.__style"
          class="es-form-object"
          :key="fieldName"
        ></div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
// $UI_MAX_COL: 24; //整修个布局分为多少列，这个值不要随便改，要跟es-constance.js的UI_MAX_COL对应
// @for $i from 1 through $UI_MAX_COL {
//   .es-col-#{$i} {
//     width: 100% * $i / $UI_MAX_COL;
//   }
// }

.es-form-container {
  overflow: hidden;
}

.es-form-inner-wrap {
  @include display-flex;
  @include direction-h;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  // margin-bottom: -20px;
  @include clear;

  .es-form-placeholder {
    @include display-flex;
    @include direction-h;
    @include flex-fixed;
    @include border-box;
    justify-content: flex-start;
    align-items: center;
  }
  .es-form-object {
    @include display-flex;
    @include direction-h;
    @include flex-fixed;
    @include border-box;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0;
  }

  .es-form-none {
    display: none;
  }

  .es-form-v {
    @include direction-v;
    align-items: stretch;
  }

  .es-form-label-col {
    @include flex-fixed;
    @include border-box;
    width: 115px;
    padding: 0 10px 0 4px;
    text-align: right;
    line-height: 1.2;
    white-space: nowrap;
    @include display-flex;
    align-items: center;
    justify-content: flex-end;
  }

  .es-form-label-col-v {
    text-align: left;
    justify-content: flex-start;
    width: auto;
    line-height: 20px;
    padding: 2px 3px;
  }

  .es-form-label-left {
    justify-content: flex-start;
  }

  .es-form-label-center {
    justify-content: center;
  }

  .es-form-label-right {
    justify-content: flex-end;
  }

  .es-form-colon {
    margin-left: 3px;
  }

  .es-form-label-full {
    @include flex-full;
    width: auto;
    padding: 0 10px;
    text-align: center;
    white-space: nowrap;
  }

  .es-form-label-self {
    @include flex-fixed;
    width: auto;
    padding: 0 10px;
    text-align: center;
    white-space: nowrap;
  }

  .es-form-comp-content {
    @include flex-full;
    @include display-flex;
    @include direction-h;
    justify-content: flex-start;
    align-items: center; /* 为什么写center, 不写flex-start, 因为有些控件确实没有一般按件高，比如（el-switch小于el-input）,所以只要把rowHeigth调至控件的高度比较好 */
    overflow: hidden;
  }

  .es-form-props-content {
    @include flex-full;
    @include display-flex;
    @include direction-h;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
  }

  .es-form-group-full {
    @include flex-full;
    width: auto;
  }

  .es-form-group-self {
    @include flex-fixed;
    width: auto;
  }

  .es-form-placeholder-txt {
    @include flex-full;
  }
}
</style>

<script>
import itemMixin from "../mixins/item-mixin";
import esBase from "../base";
import utils from '../libs/utils';

export default {
  mixins: [itemMixin],
  data() {
    return {};
  },
  components: {
    esBase
  },
  methods: {
    createPropLayout() {
      var newPropLayout = {}
      var currentProperties = this.schema.properties;
      for (var fieldName in currentProperties) {
        var propItem = currentProperties[fieldName]
        // 没有隐藏
        if (!propItem.hidden) {

        }
      }

      var newPropLayout = {}
      
      var lastGroup = false;
      var groups;
      // var colSum = 0;
      var firstGroupItem; //每一组的第一项
      for (var key in propItem.properties) {
        // 没有隐藏
        if (!propItem.hidden) {
          var newLayoutItem = {}
          var item = propItem.properties[key];
          newLayoutItem.col = item.col
          if (newPropLayout.layout) {
            newPropLayout.layout = utils.deepCopy(newPropLayout.layout)
          }
          var rawGroup = item["group"]
          var curGroup = this.mxParseNodeAttr(rawGroup, item.__info);
          if (typeof curGroup === 'string' && curGroup) {
            if (lastGroup) {
              //已经存在了
              if (lastGroup === curGroup) {
                //是前面的那一组
                groups.push(key);
                // colSum += item.col;
                firstGroupItem.__groupCol = this.__sumCol(
                  firstGroupItem.__groupCol,
                  newPropLayout.col
                );
                // colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
              } else {
                if (firstGroupItem && firstGroupItem.groups && firstGroupItem.groups.length > 0) {
                  // 判断分组是否需要显示
                  if (this.__canShowGroup(propItem, firstGroupItem.groups)) {
                    // 分组，记录下来
                    newPropLayout[firstGroupItem.groups[0]] = firstGroupItem
                  }
                }
                //不是前面的那一组，重新开组
                lastGroup = curGroup;
                firstGroupItem = newPropLayout;
                groups = [key];
                newPropLayout.__groups = groups;
                // newPropLayout.__hiddenGroup = false;
                // item.col = constant.UI_MAX_COL;
                // colSum = item.col;
                firstGroupItem.__groupCol = newPropLayout.col;
                // colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
              }
            } else {
              //前面没有组，重新开组
              lastGroup = curGroup;
              firstGroupItem = newPropLayout;
              groups = [key];
              newPropLayout.__groups = groups;
              // newPropLayout.__hiddenGroup = false;
              firstGroupItem.__groupCol = newPropLayout.col;
            }
            // newPropLayout.__inGroups = true; //记录此项在分组里面
          } else {
            lastGroup = false;
            groups = null;
            // colSum = 0;
            firstGroupItem = null;
            newPropLayout[key] = newPropLayout
          }
          // 若存在最后一个分组，记录下来
          if (firstGroupItem && firstGroupItem.groups && firstGroupItem.groups.length > 0) {
            // 判断分组是否需要显示
            if (this.__canShowGroup(propItem, firstGroupItem.groups)) {
              // 分组，记录下来
              newPropLayout[firstGroupItem.groups[0]] = firstGroupItem
            }
          }
        }
      }
      
      sum = 0;
      var newRowSpace;
      var hasCustomWidth = propItem.__hasCustomWidth;
      for (key in propItem.properties) {
        nextPropItem = propItem.properties[key];
        var hasRowSpaceChanged = false;
        var currentCol;
        if (!hasCustomWidth) {
          if (nextPropItem.__groups) {
            //是一个组
            isHidden = this.__isGroupHidden(
              propItem,
              nextPropItem.__groups,
              formVm
            );
            if (!isHidden) {
              //组不隐藏

              sum += nextPropItem.__groupCol;
              if (sum <= constant.UI_MAX_COL) {
                //还在第一行
                newRowSpace = 0;
              } else {
                newRowSpace = nextPropItem.__rawRowSpace;
              }
              if (
                !nextPropItem.__style ||
                nextPropItem.rowSpace != newRowSpace
              ) {
                //还原
                nextPropItem.rowSpace = newRowSpace;
                hasRowSpaceChanged = true;
                currentCol = nextPropItem.__groupCol;
              }
            } else {
              //不必理会
            }

            if (nextPropItem.__hiddenGroup != isHidden) {
              nextPropItem.__hiddenGroup = isHidden;
            }
          } else if (nextPropItem.__inGroups) {
            //组内成员
            if (!nextPropItem.__style || nextPropItem.rowSpace != 0) {
              nextPropItem.rowSpace = 0;
              hasRowSpaceChanged = true;
              currentCol = nextPropItem.col;
            }
          } else {
            //正常成员

            isHidden = this.__smartParseHidden(
              nextPropItem.__rawHidden,
              formVm,
              nextPropItem.__info
            );
            // console.log(nextPropItem.col, isHidden);
            if (!isHidden) {
              sum += nextPropItem.col;
              if (sum <= constant.UI_MAX_COL) {
                //还在第一行
                newRowSpace = 0;
              } else {
                newRowSpace = nextPropItem.__rawRowSpace;
              }
              if (
                !nextPropItem.__style ||
                nextPropItem.rowSpace != newRowSpace
              ) {
                //还原
                nextPropItem.rowSpace = newRowSpace;
                hasRowSpaceChanged = true;
                currentCol = nextPropItem.col;
              }
            } else {
              //不必理会
            }
          }
          if (hasRowSpaceChanged) {
            this.__updatePropStyle(
              nextPropItem,
              nextPropItem.rowSpace,
              currentCol
            );
          }
        } else {
          if (nextPropItem.__groups) {
            //是一个组
            isHidden = this.__isGroupHidden(
              propItem,
              nextPropItem.__groups,
              formVm
            );
            if (!isHidden) {
              //组不隐藏
              if (!nextPropItem.__style) {
                this.__updatePropStyle(
                  nextPropItem,
                  nextPropItem.rowSpace,
                  nextPropItem.__groupCol
                );
              }
            } else {
              //不必理会
            }

            if (nextPropItem.__hiddenGroup != isHidden) {
              nextPropItem.__hiddenGroup = isHidden;
            }
          } else if (nextPropItem.__inGroups) {
            //组内成员
            if (!nextPropItem.__style) {
              this.__updatePropStyle(nextPropItem, 0, nextPropItem.col);
            }
          } else {
            //正常成员
            if (!nextPropItem.__style) {
              this.__updatePropStyle(
                nextPropItem,
                nextPropItem.rowSpace,
                nextPropItem.col
              );
            }
          }
        }

        // 下一级
        this.analyzeUiProps(nextPropItem, formVm);
      }
    
    },

    /**
     * 合并两个长度
     * @param {*} col1
     * @param {*} col2
     */
    __sumCol(col1, col2) {
      // 都是整数
      if (utils.isNum(col1) && utils.isNum(col2)) {
        var colSum = col1 + col2;
        colSum = colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
        return colSum;
      } else {
        // 存在非整数，转化为对象相加
        var colObj1 = col1;
        var colObj2 = col2;
        if (!utils.isObj(colObj1)) {
          colObj1 = {
            width: this.__intToPercent(colObj1)
          };
        }
        if (!utils.isObj(colObj2)) {
          colObj2 = {
            width: this.__intToPercent(colObj2)
          };
        }
        var keyWidth = "width";
        var minWidth = "min-width";
        var maxWidth = "max-width";
        var keys = [keyWidth, minWidth, maxWidth];
        var newColObj = {};
        keys.forEach(key => {
          var valSum = this.__countValue(colObj1[key], colObj2[key]);
          if (!valSum) {
            if (keyWidth === key) {
              newColObj[key] = this.__intToPercent(constant.UI_MAX_COL);
            } else if (minWidth === key) {
              newColObj[key] = colObj1[key];
            } else {
              // maxWidth不要了
            }
          } else {
            newColObj[key] = valSum;
          }
        });
      }
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
     * 此分组是否要显示
     * @param {*} propItem
     * @param {*} groups
     */
    __canShowGroup(propItem, groups) {
      var result = false;
      for (var i = 0; i < groups.length; i++) {
        var fieldKeyName = groups[i];
        var propSchema = propItem.properties[fieldKeyName];
        if (
          !propSchema.layout ||
          propSchema.layout.name !== constant.LAYOUT_SPACE
        ) {
          // 非占位空间
          if(!propSchema.hidden) {
            result = true 
          }
        } else {
          //占位空间是不可见的
          result = false;
        }
        if (result) {
          return result;
        }
      }
      // 没有显示项目，或者全是占位空间
      return result;
    }
  }
};
</script>
