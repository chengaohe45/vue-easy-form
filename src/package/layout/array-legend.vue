<template>
  <div class="es-form-array-legend">
    <div class="es-form-array-wrap">
      <ul class="es-order-list-box">
        <li
          v-for="(itemSchema, index) in schema.__propSchemaList"
          :key="index"
          class="list-item"
          :style="{
            marginTop: (index > 0 ? schema.array.rowSpace : 0) + 'px'
          }"
        >
          <div
            class="es-order-box"
            v-if="schema.array.hasOrder !== false"
            :style="{
              height:
                typeof schema.boxRowHeight == 'number'
                  ? schema.boxRowHeight + 'px'
                  : schema.rowHeight + 'px'
            }"
          >
            {{ index + 1 }}.
          </div>
          <div class="es-array-fieldset-box">
            <div class="es-array-fieldset">
              <div class="es-legend">
                <!-- {{ itemSchema.subLabel ? itemSchema.subLabel : index + 1 + "" }} -->
                <template v-if="!itemSchema.subLabel.name"
                  ><span>{{
                    itemSchema.subLabel.text
                      ? itemSchema.subLabel.text
                      : index + 1 + ""
                  }}</span></template
                >
                <span v-else class="es-form-label-box">
                  <es-base :config="itemSchema.subLabel"></es-base>
                </span>
              </div>
              <template v-if="itemSchema.properties">
                <component
                  v-if="itemSchema.layout && itemSchema.layout.name === 'tabs'"
                  :is="'tabs'"
                  :schema="itemSchema"
                >
                  <template
                    v-for="(fieldSchema, fieldName) in itemSchema.properties"
                    :slot="fieldName"
                  >
                    <slot :name="fieldName" :schema="fieldSchema"></slot>
                  </template>
                </component>
                <es-object :schema="itemSchema" v-else>
                  <template
                    v-for="(fieldSchema, fieldName) in itemSchema.properties"
                    :slot="fieldName"
                  >
                    <slot :name="fieldName" :schema="fieldSchema"></slot>
                  </template>
                </es-object>

                <div
                  class="es-btn-panel"
                  v-if="
                    schema.array.hasDelete ||
                      schema.array.hasSort ||
                      schema.array.hasCopy
                  "
                >
                  <div
                    class="es-btn-box"
                    :style="{
                      height:
                        typeof schema.boxRowHeight == 'number'
                          ? schema.boxRowHeight + 'px'
                          : schema.rowHeight + 'px'
                    }"
                  >
                    <edit-btns
                      :has-delete="schema.array.hasDelete"
                      :has-sort="schema.array.hasSort"
                      :can-delete="
                        schema.__propSchemaList.length > schema.array.min
                      "
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
                    ></edit-btns>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="es-single-pannel">
                  <div class="es-single-box">
                    <slot :schema="itemSchema"></slot>
                  </div>
                  <div
                    v-if="
                      schema.array.hasDelete ||
                        schema.array.hasSort ||
                        schema.array.hasCopy
                    "
                    class="es-btn-box es-single-btn-box"
                    :style="{
                      height:
                        typeof schema.boxRowHeight == 'number'
                          ? schema.boxRowHeight + 'px'
                          : schema.rowHeight + 'px'
                    }"
                  >
                    <edit-btns
                      :has-delete="schema.array.hasDelete"
                      :has-sort="schema.array.hasSort"
                      :can-delete="
                        schema.__propSchemaList.length > schema.array.min
                      "
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
                    ></edit-btns>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </li>
      </ul>
      <div
        v-if="schema.array.hasDelete || schema.array.hasAdd"
        class="es-btn-footer"
        :style="{
          marginTop:
            schema.__propSchemaList.length > 0
              ? schema.array.rowSpace + 'px'
              : '0px'
        }"
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
          :can-add="
            schema.array.max <= 0 ||
              schema.__propSchemaList.length < schema.array.max
          "
          :index="-1"
          :has-del-warn="schema.array.hasDelWarn"
          @delItem="delAllItems"
          @addItem="addItem"
        ></edit-bottom-btns>
      </div>
    </div>
    <div
      v-if="schema.help && schema.component"
      class="es-form-help"
      :style="{
        height:
          typeof schema.boxRowHeight == 'number'
            ? schema.boxRowHeight + 'px'
            : schema.rowHeight + 'px'
      }"
    >
      <!-- <es-base :config="schema.help" :open-smart="false"> </es-base> -->
      <es-base :config="schema.help"></es-base>
    </div>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";

.es-form-array-legend {
  // margin-bottom: -20px;
  @include clear;
  @include display-flex;

  .es-form-array-wrap {
    @include flex-full;
  }

  .es-order-list-box {
    margin: 0 0 0 0;
    padding: 0;
    list-style: none;
  }

  .list-item {
    @include display-flex;
    @include direction-h;
    margin: 20px 0 0 0;
    padding: 0;
  }

  .es-order-box {
    width: 40px;
    // line-height: 40px;
    text-align: center;
    @include display-center;
    @include flex-fixed;
  }

  .es-array-fieldset-box {
    padding-top: 15px;
    @include flex-full;
  }

  .es-array-fieldset {
    position: relative;
    padding: 20px 20px 15px 20px;
    border: 1px solid $g_borderColor;
    border-radius: $g_borderRadius;

    .es-legend {
      position: absolute;
      left: 10px;
      top: -12px;
      background: #fff;
      line-height: 24px;
      font-size: 16px;
      font-weight: 500;
      padding: 0 10px;
      border-radius: 10px;
    }

    .es-single-pannel {
      @include display-center;
    }

    .es-single-box {
      @include flex-full;
    }
  }

  .es-btn-panel {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .es-btn-box {
    // @include flex-fixed;
    @include display-center;
    // margin-left: 5px;
  }

  .es-single-btn-box {
    margin-left: 10px;
    @include flex-fixed;
  }

  .es-btn-footer {
    // margin-left: 135px; margin-left: 135px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<script>
import esObject from "./object";
import tabs from "./tabs";
import itemMixin from "../mixins/item-mixin";
import arrayMixins from "../mixins/array-mixin.js";
import editBtns from "../components/edit-btns";
import editBottomBtns from "../components/edit-bottom-btns";
import esBase from "../base";

export default {
  mixins: [itemMixin, arrayMixins],
  components: {
    esObject,
    editBtns,
    editBottomBtns,
    tabs,
    esBase
  },

  methods: {}
};
</script>
