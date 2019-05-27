<template>
  <div class="es-form-array-box">
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
          <div class="es-array-row-body">
            <component
              v-if="
                itemSchema.properties &&
                  itemSchema.layout &&
                  itemSchema.layout.name === 'tabs'
              "
              :is="'tabs'"
              :schema="itemSchema"
              :form-data="formData"
              @formClick="formClick"
            >
              <template
                v-for="(fieldSchema, fieldName) in itemSchema.properties"
                :slot="fieldName"
              >
                <slot :name="fieldName" :schema="fieldSchema"></slot>
              </template>
            </component>
            <es-object
              :schema="itemSchema"
              :form-data="formData"
              v-else-if="itemSchema.properties"
            >
              <template
                v-for="(fieldSchema, fieldName) in itemSchema.properties"
                :slot="fieldName"
              >
                <slot :name="fieldName" :schema="fieldSchema"></slot>
              </template>
            </es-object>
            <template v-else>
              <slot :schema="itemSchema"></slot>
            </template>
          </div>
          <div
            v-if="schema.array.hasDelete || schema.array.hasSort"
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
              :can-delete="schema.__propSchemaList.length > schema.array.min"
              :fixed="schema.array.fixed"
              :is-first="index == 0"
              :is-last="index == schema.__propSchemaList.length - 1"
              :index="index"
              :has-del-warn="schema.array.hasDelWarn"
              @delItem="delItem"
              @upItem="upItem"
              @downItem="downItem"
            ></edit-btns>
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
      <es-base
        :config="schema.help"
        :form-data="formData"
        :global="global"
        :idx-chain="schema.__idxChain"
        :index="schema.__index"
      ></es-base>
    </div>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
.es-form-array-box {
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

  .es-array-row-body {
    @include flex-full;
  }
  .es-btn-box {
    // @include flex-fixed;
    @include display-center;
    margin-left: 5px;
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

  methods: {
    /**
     * sourcePathKey 是哪个tab容器触发
     * index 触发哪个
     */
    formClick(type, data) {
      // console.log("formClick: ", sourcePathKey, index);
      this.$emit("formClick", type, data); // 往上派发
    }
  }
};
</script>
