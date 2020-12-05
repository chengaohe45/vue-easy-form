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
              height: schema.properties
                ? schema.ui.rowHeight + 'px'
                : schema.rowHeight + 'px'
            }"
          >
            <span
              v-if="
                itemSchema.rules &&
                  itemSchema.rules.required &&
                  itemSchema.rules.showRequired
              "
              class="es-required"
              >*</span
            ><template v-if="schema.array.hasOrder !== false"
              >{{ index + 1 }}.</template
            >
          </div>
          <div
            v-else-if="
              itemSchema.rules &&
                itemSchema.rules.required &&
                itemSchema.rules.showRequired
            "
            class="es-order-box-required"
            :style="{
              height: schema.properties
                ? schema.ui.rowHeight + 'px'
                : schema.rowHeight + 'px'
            }"
          >
            <span class="es-required">*</span>
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
            >
              <template
                v-for="(fieldSchema, fieldName) in itemSchema.properties"
                :slot="fieldName"
              >
                <slot :name="fieldName" :refName="fieldName + '_' + index" :schema="fieldSchema"></slot>
              </template>
            </component>
            <es-object :schema="itemSchema" v-else-if="itemSchema.properties">
              <template
                v-for="(fieldSchema, fieldName) in itemSchema.properties"
                :slot="fieldName"
              >
                <slot :name="fieldName" :refName="fieldName + '_' + index" :schema="fieldSchema"></slot>
              </template>
            </es-object>
            <template v-else>
              <slot :refName="index + ''" :schema="itemSchema"></slot>
            </template>
          </div>
          <div
            v-if="
              schema.array.hasDelete ||
                schema.array.hasSort ||
                schema.array.hasCopy
            "
            class="es-btn-box"
            :style="{
              height: schema.properties
                ? schema.ui.rowHeight + 'px'
                : schema.rowHeight + 'px'
            }"
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
        </li>
      </ul>
      <div
        v-if="schema.array.hasDelete || schema.array.hasAdd"
        class="es-btn-footer"
        :style="{
          marginTop:
            schema.__propSchemaList.length > 0
              ? Math.round(
                  Math.min(
                    Math.max(schema.array.rowSpace / 2, 10),
                    schema.array.rowSpace
                  )
                ) + 'px'
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
          :del-msg="schema.array.delAllMsg"
          :del-warn-btns="schema.array.delWarnBtns"
          :info="schema.__info"
        ></edit-bottom-btns>
      </div>
    </div>
    <div
      v-if="schema.help && !schema.help.hidden && schema.component"
      class="es-form-help"
      :style="{
        height: schema.properties
          ? schema.ui.rowHeight + 'px'
          : schema.rowHeight + 'px'
      }"
    >
      <es-base :config="schema.help" :info="schema.__info"></es-base>
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

  .es-order-box-required {
    width: 14px;
    // line-height: 40px;
    text-align: center;
    @include display-center;
    @include flex-fixed;

    .es-required {
      margin-right: 0px;
    }
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
import editAbbrBtns from "../components/edit-abbr-btns";
import editBottomBtns from "../components/edit-bottom-btns";
import esBase from "../base";

export default {
  mixins: [itemMixin, arrayMixins],
  components: {
    esObject,
    editBtns,
    editAbbrBtns,
    editBottomBtns,
    tabs,
    esBase
  },

  methods: {}
};
</script>
