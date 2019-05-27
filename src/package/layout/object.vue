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
              v-show="!schema.properties[fieldKeyName].hidden"
              v-if="schema.properties[fieldKeyName].label.text !== false"
              :style="[
                {
                  height: schema.properties[fieldKeyName].rowHeight + 'px',
                  lineHeight: schema.properties[fieldKeyName].rowHeight + 'px'
                },
                schema.properties[fieldKeyName].label.size
                  ? ''
                  : { width: schema.properties[fieldKeyName].labelWidth + 'px' }
              ]"
              :class="[
                'es-form-label',
                schema.properties[fieldKeyName].label.size
                  ? 'es-form-label-' +
                    schema.properties[fieldKeyName].label.size
                  : ''
              ]"
              :key="'label-' + fieldKeyName"
            >
              <!-- 必填标识 -->
              <span
                v-if="
                  schema.properties[fieldKeyName].rules &&
                    schema.properties[fieldKeyName].rules.required
                "
                class="es-required"
                >*</span
              >
              {{ schema.properties[fieldKeyName].label.text }}
              <span v-if="schema.properties[fieldKeyName].colon">:</span>
            </label>
            <div
              v-show="!schema.properties[fieldKeyName].hidden"
              class="es-form-comp-content"
              :key="'content-' + fieldKeyName"
              :style="[
                { minHeight: schema.properties[fieldKeyName].rowHeight + 'px' }
              ]"
            >
              <slot
                :schema="schema.properties[fieldKeyName]"
                :name="fieldKeyName"
              ></slot>
            </div>
            <div
              v-show="!schema.properties[fieldKeyName].hidden"
              :key="'unit-' + fieldKeyName"
              v-if="schema.properties[fieldKeyName].unit"
              class="es-form-unit"
              :style="[
                { height: schema.properties[fieldKeyName].rowHeight + 'px' }
              ]"
            >
              {{ schema.properties[fieldKeyName].unit }}
            </div>
            <div
              v-show="!schema.properties[fieldKeyName].hidden"
              :key="'help-' + fieldKeyName"
              v-if="schema.properties[fieldKeyName].help"
              class="es-form-help"
              :style="[
                { height: schema.properties[fieldKeyName].rowHeight + 'px' }
              ]"
            >
              <!-- <es-base
                :config="schema.properties[fieldKeyName].help"
                :open-smart="false"
              ></es-base> -->
              <es-base
                :config="schema.properties[fieldKeyName].help"
                :form-data="formData"
                :global="global"
                :idx-chain="schema.properties[fieldKeyName].__idxChain"
                :index="schema.properties[fieldKeyName].__index"
              ></es-base>
            </div>
          </template>
          <div
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
      <div
        v-show="!fieldSchema.hidden"
        v-else-if="
          !fieldSchema.__inGroups &&
            (!fieldSchema.layout || fieldSchema.layout.name !== 'space')
        "
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
          v-if="fieldSchema.label.text !== false"
          :class="[
            'es-form-label',
            fieldSchema.label.size
              ? 'es-form-label-' + fieldSchema.label.size
              : ''
          ]"
          :style="
            fieldSchema.direction == 'h'
              ? [
                  {
                    height: fieldSchema.rowHeight + 'px',
                    lineHeight: fieldSchema.rowHeight + 'px',
                    textAlign: fieldSchema.label.align
                  },
                  fieldSchema.label.size
                    ? { textAlign: fieldSchema.label.align }
                    : {
                        width: fieldSchema.labelWidth + 'px',
                        textAlign: fieldSchema.label.align
                      }
                ]
              : { textAlign: fieldSchema.label.align }
          "
        >
          <span
            v-if="fieldSchema.rules && fieldSchema.rules.required"
            class="es-required"
            >*</span
          >
          {{ fieldSchema.label.text }}
          <span v-if="fieldSchema.colon">:</span>
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
      <!-- 占位空间控件 -->
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
    // margin-top: 20px;

    // &:last-child {
    //   margin-bottom: 0;
    // }
  }

  .es-form-none {
    display: none;
  }

  .es-form-v {
    @include direction-v;
    align-items: stretch;
  }

  .es-form-label {
    @include flex-fixed;
    @include border-box;
    width: 115px;
    padding: 0 10px 0 4px;
    text-align: right;
    line-height: 1.2;
    white-space: nowrap;
  }

  .es-form-v > .es-form-label {
    text-align: left;
    width: auto;
    height: 26px;
    line-height: 26px;
    padding-left: 4px;
    padding-right: 4px;
    // padding-top: 6px;
    // padding-bottom: 6px;
  }

  .es-form-label-auto {
    @include flex-full;
    width: auto;
    padding: 0 10px;
    text-align: center;
    white-space: nowrap;
  }

  .es-form-label-fixed {
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

  // .es-form-group-content {
  //   align-items: flex-start;
  // }

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
