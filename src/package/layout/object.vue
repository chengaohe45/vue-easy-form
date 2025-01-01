<template>
  <div v-if="tmpLayoutSchema = createPropLayout()" class="es-form-container">
    <div
      class="es-form-inner-wrap"
      :style="
        tmpLayoutSchema.firstRowSpace
          ? { marginTop: -tmpLayoutSchema.firstRowSpace + 'px' }
          : null
      "
    >
      <template v-for="(fieldSchema, fieldName) in tmpLayoutSchema.properties">
        <!-- 有些元素同一组（也就是同一行, 内收藏fieldName） -->
        <div
          v-if="fieldSchema.groupProperties"
          :style="fieldSchema.__style"
          class="es-form-object"
          :key="'groups-' + fieldName"
        >
          <template v-for="(groupFieldSchema, groupFieldName) in fieldSchema.groupProperties">
            <template v-if="schema.properties[groupFieldName].component">
              <label
                v-if="
                  schema.properties[groupFieldName].__creatable &&
                  mxShowComponent(schema.properties[groupFieldName].label, schema.properties[groupFieldName].__info)
                "
                v-show="!schema.properties[groupFieldName].hidden"
                :style="[
                  {
                    height: schema.properties[groupFieldName].rowHeight + 'px',
                    lineHeight:
                      schema.properties[groupFieldName].rowHeight + 'px',
                    marginLeft:
                      schema.properties[groupFieldName].offsetLeft + 'px'
                  },
                  schema.properties[groupFieldName].label.flex
                    ? ''
                    : {
                        width: schema.properties[groupFieldName].labelWidth + 'px'
                      }
                ]"
                :class="[
                  'es-form-label-col',
                  schema.properties[groupFieldName].label.flex
                    ? 'es-form-label-' +
                      schema.properties[groupFieldName].label.flex
                    : '',
                  schema.properties[groupFieldName].label.align
                    ? 'es-form-label-' +
                      schema.properties[groupFieldName].label.align
                    : ''
                ]"
                :key="'label-' + groupFieldName"
              >
                <!-- 必填标识 -->
                <span
                  v-if="
                    (schema.properties[groupFieldName].array &&
                      schema.properties[groupFieldName].array.rules &&
                      mxParseBoolValue(schema.properties[groupFieldName].array.rules.required, schema.properties[groupFieldName].__info) &&
                      mxParseBoolValue(schema.properties[groupFieldName].array.rules.showRequired, schema.properties[groupFieldName].__info)) ||
                      (schema.properties[groupFieldName].rules &&
                        !schema.properties[groupFieldName].array &&
                        mxParseBoolValue(schema.properties[groupFieldName].rules.required, schema.properties[groupFieldName].__info) &&
                        mxParseBoolValue(schema.properties[groupFieldName].rules.showRequired, schema.properties[groupFieldName].__info))
                  "
                  class="es-required"
                  >*</span
                >
                <template v-if="!schema.properties[groupFieldName].label.name">
                  <span>{{ schema.properties[groupFieldName].label.text }}</span>
                </template>
                <span v-else class="es-form-label-box">
                  <es-base
                    :config="schema.properties[groupFieldName].label"
                    :info="schema.properties[groupFieldName].__info"
                  ></es-base>
                </span>
                <span
                  class="es-form-label-help"
                  v-if="mxShowComponent(schema.properties[groupFieldName].label.help, schema.properties[groupFieldName].__info)"
                >
                  <es-base
                    :config="schema.properties[groupFieldName].label.help"
                    :info="schema.properties[groupFieldName].__info"
                  ></es-base>
                </span>
                <span
                  v-if="groupFieldSchema.colon"
                  class="es-form-colon"
                  >:</span
                >
              </label>
              <div
                v-if="schema.properties[groupFieldName].__creatable"
                v-show="!schema.properties[groupFieldName].hidden"
                :class="[
                  'es-form-comp-content',
                  schema.properties[groupFieldName].component &&
                  schema.properties[groupFieldName].component.flex
                    ? 'es-form-group-' +
                      schema.properties[groupFieldName].component.flex
                    : ''
                ]"
                :key="'content-' + groupFieldName"
                :style="[
                  {
                    minHeight: schema.properties[groupFieldName].rowHeight + 'px',
                    marginLeft:
                      !mxShowComponent(schema.properties[groupFieldName].label, schema.properties[groupFieldName].__info)
                        ? schema.properties[groupFieldName].offsetLeft + 'px'
                        : false,
                    marginRight:
                      schema.properties[groupFieldName].offsetRight + 'px'
                  }
                ]"
              >
                <slot
                  :schema="schema.properties[groupFieldName]"
                  :name="groupFieldName"
                ></slot>
              </div>
              <template v-if="schema.properties[groupFieldName].__creatable && mxShowComponent(schema.properties[groupFieldName].unit, schema.properties[groupFieldName].__info)">
                <div
                  :key="'unit-' + groupFieldName"
                  class="es-form-unit"
                  :style="[
                    { height: schema.properties[groupFieldName].rowHeight + 'px' }
                  ]"
                >
                  <es-base
                    :config="schema.properties[groupFieldName].unit"
                    :info="schema.properties[groupFieldName].__info"
                  ></es-base>
                </div>

                <!-- <div
                  v-if="schema.properties[groupFieldName].unit.name"
                  v-show="!schema.properties[groupFieldName].hidden"
                  :key="'unit-' + groupFieldName"
                  class="es-form-unit"
                  :style="[
                    { height: schema.properties[groupFieldName].rowHeight + 'px' }
                  ]"
                >
                  <es-base
                    :config="schema.properties[groupFieldName].unit"
                    :info="schema.properties[groupFieldName].__info"
                  ></es-base>
                </div>
                <div
                  v-else
                  v-show="
                    !schema.properties[groupFieldName].hidden &&
                      schema.properties[groupFieldName].unit.text
                  "
                  :key="'unit-' + groupFieldName"
                  class="es-form-unit"
                  :style="[
                    { height: schema.properties[groupFieldName].rowHeight + 'px' }
                  ]"
                >
                  {{ schema.properties[groupFieldName].unit.text }}
                </div> -->
              </template>
              <div
                v-show="!schema.properties[groupFieldName].hidden"
                :key="'help-' + groupFieldName"
                v-if="schema.properties[groupFieldName].__creatable && mxShowComponent(schema.properties[groupFieldName].help, schema.properties[groupFieldName].__info)"
                class="es-form-help"
                :style="[
                  { height: schema.properties[groupFieldName].rowHeight + 'px' }
                ]"
              >
                <es-base
                  :config="schema.properties[groupFieldName].help"
                  :info="schema.properties[groupFieldName].__info"
                ></es-base>
              </div>
            </template>
            <!-- 占位空间控件: 不判断__creatable，因为是系统的，里面没有用户自定义的东西 -->
            <div
              v-else
              :key="groupFieldName"
              :style="groupFieldSchema.__style"
              class="es-form-placeholder"
            ></div>
          </template>
        </div>
        <!-- 不是分组情况 -->
        <template
          v-else-if="(!schema.properties[fieldName].layout || schema.properties[fieldName].layout.name !== 'space')"
        >
          <div
            v-if="schema.properties[fieldName].__creatable"
            v-show="!schema.properties[fieldName].hidden"
            :style="fieldSchema.__style"
            :class="[
              'es-form-object',
              fieldSchema.direction == 'v' ? 'es-form-v' : ''
            ]"
            :key="fieldName"
          >
            <!-- 一般的控件 -->
            <label
              v-if="mxShowComponent(schema.properties[fieldName].label, schema.properties[fieldName].__info)"
              :class="[
                'es-form-label-col',
                fieldSchema.direction == 'v' ? 'es-form-label-col-v' : '',
                schema.properties[fieldName].label.flex
                  ? 'es-form-label-' + schema.properties[fieldName].label.flex
                  : '',
                  schema.properties[fieldName].label.align
                  ? 'es-form-label-' + schema.properties[fieldName].label.align
                  : ''
              ]"
              :style="
                fieldSchema.direction == 'h'
                  ? [
                      {
                        height: fieldSchema.rowHeight + 'px',
                        lineHeight: fieldSchema.rowHeight + 'px'
                      },
                      schema.properties[fieldName].label.flex
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
                  (schema.properties[fieldName].array &&
                  schema.properties[fieldName].array.rules &&
                    mxParseBoolValue(schema.properties[fieldName].array.rules.required, schema.properties[fieldName].__info) &&
                    mxParseBoolValue(schema.properties[fieldName].array.rules.showRequired, schema.properties[fieldName].__info)) ||
                    (schema.properties[fieldName].rules &&
                      !schema.properties[fieldName].array &&
                      mxParseBoolValue(schema.properties[fieldName].rules.required, schema.properties[fieldName].__info) &&
                      mxParseBoolValue(schema.properties[fieldName].rules.showRequired, schema.properties[fieldName].__info))
                "
                class="es-required"
                >*</span
              >
              <template v-if="!schema.properties[fieldName].label.name">
                <span>{{
                  fieldSchema.direction != "v" || schema.properties[fieldName].label.text
                    ? schema.properties[fieldName].label.text
                    : "&nbsp;"
                }}</span>
              </template>
              <span v-else class="es-form-label-box">
                <es-base
                  :config="schema.properties[fieldName].label"
                  :info="schema.properties[fieldName].__info"
                ></es-base>
              </span>
              <span
                class="es-form-label-help"
                v-if="mxShowComponent(schema.properties[fieldName].label.help, schema.properties[fieldName].__info)"
              >
                <es-base
                  :config="schema.properties[fieldName].label.help"
                  :info="schema.properties[fieldName].__info"
                ></es-base>
              </span>
              <span v-if="fieldSchema.colon" class="es-form-colon">:</span>
            </label>
            <div
              :class="
                schema.properties[fieldName].properties
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
          v-else-if="!schema.properties[fieldName].component"
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
import global from '../libs/global';
import constant from '../libs/constant';
import schemaUtils from '../libs/schema-utils';

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
      // console.log('createPropLayout...')
      var newPropLayout = {}
      
      var lastGroup = false;
      var groups, groupProperties;
      // var colSum = 0;
      var newGroupItem, firstGroupFieldName, firstGroupLayoutItem; //每一组的第一项
      var propSchema = this.schema.properties
      for (var fieldName in propSchema) {
        var item = propSchema[fieldName];
        // 没有隐藏
        if (!item.hidden) {
          var newLayoutItem = {}
          if ('__creatable' in item) {
            newLayoutItem.__creatable = item.__creatable;
          }
          if (item.layout) {
            newLayoutItem.layout = item.layout;
          }
          var directionEnums = ["h", "v"];
          var newDireciton = this.mxParseNodeAttr(item.direction, item.__info)
          newLayoutItem.direction = directionEnums.includes(newDireciton) ? newDireciton : directionEnums[0];
          newLayoutItem.bodyPadding = this.mxParsePadding(item.bodyPadding, item.__info);
          var inheritKeys = [
            "offsetLeft",
            "offsetRight",
            "direction",
            "colon",
            "rowSpace",
            "labelWidth",
            "rowHeight"
          ];
          inheritKeys.forEach((inheritKey) => {
            newLayoutItem[inheritKey] = this.__parseInheritableKey(inheritKey, item)
          })
          newLayoutItem.col = this.mxParseCol(item, item.__info)
          
          // style必须放在各项配置解析之后
          newLayoutItem.__style = this.__createPropItemStyle(newLayoutItem, newLayoutItem.col);

          var rawGroup = item["group"]
          var curGroup = this.mxParseNodeAttr(rawGroup, item.__info);
          if (typeof curGroup === 'string' && curGroup) {
            if (lastGroup) {
              //已经存在了
              if (lastGroup === curGroup) {
                //是前面的那一组
                // groups.push(fieldName);
                groupProperties[fieldName] = newLayoutItem;
                // colSum += item.col;
                newGroupItem.groupCol = this.__sumCol(
                  newGroupItem.groupCol,
                  newLayoutItem.col
                );
                // colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
              } else {
                // 前一个分组统计
                if (newGroupItem && newGroupItem.groupProperties) {
                  // 判断分组是否需要显示
                  if (this.__canShowGroup(propSchema, newGroupItem.groupProperties)) {
                    // 分组，记录下来
                    firstGroupFieldName = this.__getFristGroupItemName(newGroupItem.groupProperties);
                    firstGroupLayoutItem = newGroupItem.groupProperties[firstGroupFieldName]
                    newLayoutItem.__style = this.__createPropItemStyle(firstGroupLayoutItem, newGroupItem.groupCol);
                    newPropLayout[firstGroupFieldName] = newGroupItem
                  }
                }
                //不是前面的那一组，重新开组
                lastGroup = curGroup;
                newGroupItem = Object.assign({}, newLayoutItem);
                groups = [fieldName];
                groupProperties = {
                  [fieldName]: newLayoutItem
                }
                // newLayoutItem.__groups = groups;
                newLayoutItem.groupProperties = groupProperties;
                // newPropLayout.__hiddenGroup = false;
                // item.col = constant.UI_MAX_COL;
                // colSum = item.col;
                newGroupItem.groupCol = newLayoutItem.col;
                // colSum > constant.UI_MAX_COL ? constant.UI_MAX_COL : colSum;
              }
            } else {
              //前面没有组，重新开组
              lastGroup = curGroup;
              newGroupItem = Object.assign({}, newLayoutItem);
              // groups = [fieldName];
              groupProperties = {
                [fieldName]: newLayoutItem
              }
              // newLayoutItem.__groups = groups;
              newGroupItem.groupProperties = groupProperties;
              // newPropLayout.__hiddenGroup = false;
              newGroupItem.groupCol = newLayoutItem.col;
            }
            // newPropLayout.__inGroups = true; //记录此项在分组里面
          } else {
            lastGroup = false;
            // groups = null;
            // colSum = 0;
            newGroupItem = null;
            groupProperties = null;
            newPropLayout[fieldName] = newLayoutItem
          }
          // 若存在最后一个分组，记录下来
          if (newGroupItem && newGroupItem.groupProperties) {
            // 判断分组是否需要显示
            if (this.__canShowGroup(propSchema, newGroupItem.groupProperties)) {
              // 分组，记录下来
              firstGroupFieldName = this.__getFristGroupItemName(newGroupItem.groupProperties);
              firstGroupLayoutItem = newGroupItem.groupProperties[firstGroupFieldName]
              newLayoutItem.__style = this.__createPropItemStyle(firstGroupLayoutItem, newGroupItem.groupCol);
              newPropLayout[firstGroupFieldName] = newGroupItem
            }
          }
        }
      }

      var layoutSchema
      // 判断是否存在显示的项目（非空或非全是占位空间）
      if (!this.__canShowGroup(propSchema, newPropLayout)) {
        layoutSchema = null;
      } else {
        layoutSchema = {}
        layoutSchema.firstRowSpace = this.__getFristLayoutRowSpace(newPropLayout);
        layoutSchema.properties = newPropLayout;
      }
      
      // console.log('layoutSchema', layoutSchema)
      return layoutSchema;
    },

    __parseInheritableKey(key, itemSchema) {
      var rootInstance;
      var keyValueScript = itemSchema[key];
      var currentKeyValue = this.__execInheritableKey(key, keyValueScript, itemSchema.__info);
      // console.log('>>>>>>>>>>>>>>>>>>', key, currentKeyValue)
      if (currentKeyValue === undefined || currentKeyValue === null) {
        // 需要取父级的
        if (this.schema.ui) {
          var currentUi = this.schema.ui
          // console.log('1 ----currentKeyValue', currentUi[key])
          currentKeyValue = this.__execInheritableKey(key, currentUi[key], this.schema.__info);
        }
        // console.log('2 ----currentKeyValue', currentKeyValue)
        if (currentKeyValue === undefined || currentKeyValue === null) {
          // console.log('this.schema', this.schema)
          // 再向上取父级的
          var pathKeyStr = this.schema.__info.pathKey;
          var pathKeys = utils.parsePathKeys(pathKeyStr)
          var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME)
          var rootSchema = rootInstance._getSchema()

          var allUiSchemaList = []
          var curSchema = rootSchema
          // 取出父类的UI
          if (pathKeys.length > 0) {
            for (var i = 0; i < pathKeys.length; i++) {
              if (!curSchema) {
                // 正常是不会理入这里的
                throw new Error("数据不匹配")
              }
              var curProperties = curSchema.properties;
              if (curProperties) {
                if (!curSchema.array) {
                  // 非数组
                  if (curSchema.ui && curSchema.ui !== this.schema.ui) {
                    allUiSchemaList.push(curSchema)
                  }
                  curSchema = curProperties[pathKeys[i]]  // 下一个
                } else {
                  // 数组
                  var curPropSchemaList = curSchema.__propSchemaList;
                  ++i;
                  curSchema = curPropSchemaList[i];
                }
              } else {
                // 组件是没有ui的，也没有下一级
              }
            }
          } else {
            //
          }
          // console.log('1 allUiSchemaList', allUiSchemaList)
          if (allUiSchemaList.length > 0) {
            allUiSchemaList = allUiSchemaList.reverse()
            // console.log('2 allUiSchemaList', allUiSchemaList)
            rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
            for (var uiIndex = 0; uiIndex < allUiSchemaList.length; uiIndex++) {
              var uiSchemaItem = allUiSchemaList[uiIndex]
              var ui = uiSchemaItem.ui; // 只有存在UI的才进入这里
              currentKeyValue = this.__execInheritableKey(key, ui[key], uiSchemaItem.__info, rootInstance);
              if (currentKeyValue !== undefined && currentKeyValue !== null) {
                break;
              }
            }
          }
        }
      }

      if (currentKeyValue === undefined || currentKeyValue === null) {
        // 还是为空，全局配置
        currentKeyValue = global[key]
      }
      // console.log('>>>>>>>>>>>>>>>>>> ----currentKeyValue', currentKeyValue)
      return currentKeyValue;
    },

    __execInheritableKey(key, currentKeyScript, info, rootInstance) {
      // console.log('__execInheritableKey-currentKeyScript', key, currentKeyScript)
      var currentKeyValue
      if (typeof currentKeyScript === "function") {
        rootInstance = rootInstance || utils.getParent(this, constant.ES_FORM_ROOT_NAME);
        currentKeyValue = currentKeyScript(rootInstance._fetchParseSources(info))
      } else {
        currentKeyValue = currentKeyScript;
      }
      // console.log('1 currentKeyValue = ', currentKeyValue)
      currentKeyValue = schemaUtils.parseNormalKey(currentKeyValue,  schemaUtils.getNormalInfo(key), {[key]: undefined}, true);
      if (currentKeyValue === undefined || currentKeyValue === null && (typeof currentKeyValue === "function")) {
        currentKeyValue = undefined
      }
      // console.log('2 currentKeyValue = ', currentKeyValue)
      return currentKeyValue;
    },

    __getFristGroupItemName(groupProperties) {
      for (var fieldName in groupProperties) {
        var propItem = groupProperties[fieldName]
        if (!propItem.layout || propItem.layout.name !== constant.LAYOUT_SPACE) {
          // 非占位空间
          return fieldName;
        }
      }
    },

    __getFristLayoutRowSpace(layoutSchema) {
      // console.log('layoutSchema', layoutSchema)
      for (var fieldName in layoutSchema) {
        var propItem = layoutSchema[fieldName];
        if (!propItem.layout || propItem.layout.name !== constant.LAYOUT_SPACE) {
          // 非占位空间
          return propItem.rowSpace;
        }
      }
    },

    __createPropItemStyle(layoutItem, col) {
      var style = {};
      if (!layoutItem.layout || layoutItem.layout.name !== constant.LAYOUT_SPACE) {
        var bodyPadding = layoutItem.bodyPadding
        if (bodyPadding && bodyPadding.length === 4) {
          style.padding = bodyPadding.join(" ");
        } else {
          if (layoutItem.offsetLeft) {
            style.paddingLeft = layoutItem.offsetLeft + "px";
          }
          if (layoutItem.offsetRight) {
            style.paddingRight = layoutItem.offsetRight + "px";
          }
          if (layoutItem.rowSpace) {
            style.marginTop = layoutItem.rowSpace + "px";
          }
        }
      }
      
      if (utils.isNum(col)) {
        var width = Math.floor((col * 1000000) / constant.UI_MAX_COL) / 10000;
        width += "%";
        style.width = width;
      } else {
        style = Object.assign(style, col);
      }
      return style;
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
     * @param {*} propSchema
     * @param {*} groups
     */
    __canShowGroup(propSchema, groupProperties) {
      var groups = groupProperties ? Object.keys(groupProperties) : []
      var result = false;
      for (var i = 0; i < groups.length; i++) {
        var groupFieldName = groups[i];
        var propItem = propSchema[groupFieldName];
        if (
          !propItem.layout ||
          propItem.layout.name !== constant.LAYOUT_SPACE
        ) {
          // 非占位空间
          if (!propItem.hidden) {
            result = true;
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
