<template>
  <div class="es-form-container">
    <template v-for="(fieldSchema, fieldName) in schema.properties">
      <!-- 有些元素同一组（也就是同一行, 内收藏fieldName） -->
      <div
        v-show="!fieldSchema.__hiddenGroup"
        :style="{
          marginTop: fieldSchema.rowSpace + 'px',
          paddingLeft: fieldSchema.offsetLeft + 'px',
          paddingRight: fieldSchema.offsetRight + 'px'
        }"
        :class="['es-form-object', 'es-col-' + fieldSchema.__groupCol]"
        v-if="fieldSchema.__groups"
        :key="'groups-' + fieldName"
      >
        <template v-for="fieldKeyName in fieldSchema.__groups">
          <template v-if="schema.properties[fieldKeyName].component">
            <label
              v-if="
                schema.properties[fieldKeyName].__creatable &&
                  schema.properties[fieldKeyName].label &&
                  !schema.properties[fieldKeyName].label.hidden
              "
              v-show="!schema.properties[fieldKeyName].hidden"
              :style="[
                {
                  height: schema.properties[fieldKeyName].rowHeight + 'px',
                  lineHeight: schema.properties[fieldKeyName].rowHeight + 'px',
                  marginLeft: schema.properties[fieldKeyName].offsetLeft + 'px'
                },
                schema.properties[fieldKeyName].label.flex
                  ? ''
                  : { width: schema.properties[fieldKeyName].labelWidth + 'px' }
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
                    schema.properties[fieldKeyName].array.rules.required &&
                    schema.properties[fieldKeyName].array.rules.showRequired) ||
                    (schema.properties[fieldKeyName].rules &&
                      !schema.properties[fieldKeyName].array &&
                      schema.properties[fieldKeyName].rules.required &&
                      schema.properties[fieldKeyName].rules.showRequired)
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
                v-if="
                  schema.properties[fieldKeyName].label.help &&
                    !schema.properties[fieldKeyName].label.help.hidden
                "
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
              :class="['es-form-comp-content', schema.properties[fieldKeyName].component && schema.properties[fieldKeyName].component.flex
                  ? 'es-form-group-' + schema.properties[fieldKeyName].component.flex
                  : '']"
              :key="'content-' + fieldKeyName"
              :style="[
                {
                  minHeight: schema.properties[fieldKeyName].rowHeight + 'px',
                  marginLeft:
                    !schema.properties[fieldKeyName].label ||
                    schema.properties[fieldKeyName].label.hidden
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
            <template
              v-if="
                schema.properties[fieldKeyName].unit &&
                  !schema.properties[fieldKeyName].unit.hidden &&
                  schema.properties[fieldKeyName].__creatable
              "
            >
              <div
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
              </div>
            </template>
            <div
              v-show="!schema.properties[fieldKeyName].hidden"
              :key="'help-' + fieldKeyName"
              v-if="
                schema.properties[fieldKeyName].help &&
                  !schema.properties[fieldKeyName].help.hidden &&
                  schema.properties[fieldKeyName].__creatable
              "
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
            :class="[
              'es-form-placeholder',
              'es-col-' + schema.properties[fieldKeyName].col
            ]"
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
          :style="{
            marginTop: fieldSchema.rowSpace + 'px',
            paddingLeft: fieldSchema.offsetLeft + 'px',
            paddingRight: fieldSchema.offsetRight + 'px'
          }"
          :class="[
            'es-form-object',
            'es-col-' + fieldSchema.col,
            fieldSchema.direction == 'v' ? 'es-form-v' : ''
          ]"
          :key="fieldName"
        >
          <!-- 一般的控件 -->
          <label
            v-if="fieldSchema.label && !fieldSchema.label.hidden"
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
                  fieldSchema.array.rules.required &&
                  fieldSchema.array.rules.showRequired) ||
                  (fieldSchema.rules &&
                    !fieldSchema.array &&
                    fieldSchema.rules.required &&
                    fieldSchema.rules.showRequired)
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
              v-if="fieldSchema.label.help && !fieldSchema.label.help.hidden"
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
        :style="{ marginTop: fieldSchema.rowSpace + 'px' }"
        :class="['es-form-object', 'es-col-' + fieldSchema.col]"
        :key="fieldName"
      ></div>
    </template>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
$UI_MAX_COL: 24; //整修个布局分为多少列，这个值不要随便改，要跟es-constance.js的UI_MAX_COL对应
@for $i from 1 through $UI_MAX_COL {
  .es-col-#{$i} {
    width: 100% * $i / $UI_MAX_COL;
  }
}
.es-form-container {
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

export default {
  mixins: [itemMixin],
  data() {
    return {};
  },
  components: {
    esBase
  },
  methods: {}
};
</script>
