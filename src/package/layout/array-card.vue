<template>
  <div class="es-form-array-card">
    <ul
      class="es-order-list-box"
      :style="{
        marginBottom:
          schema.__propSchemaList.length > 0
            ? -Math.floor(schema.array.rowSpace) + 'px'
            : 0
      }"
    >
      <li
        v-for="(itemSchema, index) in schema.__propSchemaList"
        :key="index"
        class="list-item"
        :style="{
          marginRight: schema.array.rowSpace + 'px',
          marginBottom: Math.floor(schema.array.rowSpace) + 'px'
        }"
      >
        <div
          v-if="
            schema.array.hasDelete ||
              schema.array.hasSort ||
              schema.array.hasCopy
          "
          class="es-btn-box"
        >
          <div
            class="es-array-row-head"
            v-if="
              schema.array.hasOrder ||
                schema.array.hasDelete ||
                schema.array.hasSort ||
                schema.array.hasCopy
            "
          >
            <span class="order-txt" v-if="schema.array.hasOrder"
              >{{ index + 1 }}.</span
            >
            <span class="order-full"></span>
            <span class="head-edit-wrap">
              <edit-btns
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
              ></edit-btns>
              <!-- <span class="edit-selected-box"></span> -->
            </span>
          </div>
        </div>
        <div class="es-array-row-body">
          <slot :schema="itemSchema"></slot>
        </div>
      </li>
    </ul>

    <div
      v-if="schema.array.hasAdd"
      class="es-card-add-box"
      :style="{
        height: schema.properties
          ? schema.ui.rowHeight + 'px'
          : schema.rowHeight + 'px'
      }"
    >
      <!-- <span @click="addItem" class="es-btn es-plus-btn"></span> -->
      <es-btn
        class="es-btn es-plus-btn"
        :disabled="
          schema.array.max > 0 &&
            schema.__propSchemaList.length >= schema.array.max
        "
        @click="addItem"
        v-if="schema.array.hasAdd"
      ></es-btn>
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

$editBoxWidth: 20px;
.es-form-array-card {
  // margin-bottom: -20px;
  @include clear;
  @include display-flex;
  overflow: hidden;

  .es-order-list-box {
    margin: 0 0 0 0;
    padding: 0;
    list-style: none;
    @include display-flex;
    @include flex-full;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
  }

  .list-item {
    margin: 0 0 0 0;
    padding: 0;
    @include display-flex;
    @include direction-v;
  }

  .es-array-row-head {
    // width: 40px;
    // line-height: 40px;
    margin: 0 5px 2px 5px;
    line-height: 1.6;
    text-align: left;
    @include display-center;
    @include flex-fixed;

    .order-txt {
      @include flex-fixed;
    }

    .order-full {
      @include flex-full;
    }

    .head-edit-wrap {
      @include display-center;
      .edit-selected-box {
        margin: 0 0 0 5px;
        @include flex-fixed;
        display: block;
        border-radius: 50%;
        border: 1px solid #dcdfe6;
        width: $editBoxWidth;
        height: $editBoxWidth;
        // line-height: 1px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        @include display-center;
        overflow: hidden;

        &:hover {
          background-color: #ecf5ff;
        }

        &::before {
          content: "···";
          display: block;
          text-align: center;
          width: $editBoxWidth;
          height: 16px;
          line-height: 16px;
          @include flex-fixed;
          color: #606266;
        }
      }
    }
  }

  .es-array-row-body {
    @include flex-full;
  }

  .es-card-add-box {
    margin: 0 0 0 10px;
    @include display-center;
    @include flex-fixed;
    user-select: none;
    cursor: pointer;
  }
}
</style>

<script>
import esObject from "./object";
import tabs from "./tabs";
import itemMixin from "../mixins/item-mixin";
import arrayMixins from "../mixins/array-mixin.js";
import editBtns from "../components/edit-abbr-btns";
import editBottomBtns from "../components/edit-bottom-btns";
import esBase from "../base";
import esBtn from "../components/btn.vue";

export default {
  mixins: [itemMixin, arrayMixins],
  components: {
    esObject,
    editBtns,
    editBottomBtns,
    tabs,
    esBase,
    esBtn
  },

  methods: {}
};
</script>
