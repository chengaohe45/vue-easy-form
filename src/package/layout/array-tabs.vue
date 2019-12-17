<template>
  <div class="es-form-array-tabs">
    <es-tabs-nav
      :hasAdd="schema.array.hasAdd"
      :canAdd="
        schema.array.max > 0 &&
          schema.__propSchemaList.length >= schema.array.max
      "
      @addItem="addItemHandler"
      :type="schema.array.type"
    >
      <template v-for="(itemSchema, index) in schema.__propSchemaList">
        <es-tabs-nav-item
          :key="index"
          :is-active="index === schema.__tabsIndex"
          :has-error="itemSchema.__hasError"
          :has-delete="schema.array.hasDelete"
          :has-sort="schema.array.hasSort"
          :can-delete="schema.__propSchemaList.length > schema.array.min"
          :fixed="schema.array.fixed"
          :is-first="index == 0"
          :is-last="index == schema.__propSchemaList.length - 1"
          :index="index"
          :has-del-warn="schema.array.hasDelWarn"
          @delItem="delItemHandler"
          @upItem="upItem"
          @downItem="downItem"
          @clickActive="clickActiveHandler"
        >
          <span class="order-txt" v-if="schema.array.hasOrder"
            >{{ index + 1 }}.</span
          >
          <!-- itemSchema.subLabel一定为一个对象-->
          <template
            v-if="!itemSchema.subLabel.name || itemSchema.subLabel.hidden"
          >
            <span
              v-if="
                !(
                  schema.array.hasOrder &&
                  (!itemSchema.subLabel.text || itemSchema.subLabel.hidden)
                )
              "
            >
              {{
                itemSchema.subLabel.text && !itemSchema.subLabel.hidden
                  ? itemSchema.subLabel.text
                  : schema.array.hasOrder
                  ? ""
                  : index + 1 + ""
              }}
            </span>
          </template>
          <span v-else class="es-form-label-box">
            <es-base
              :config="itemSchema.subLabel"
              :info="itemSchema.__info"
            ></es-base>
          </span>
        </es-tabs-nav-item>
      </template>

      <div
        v-if="schema.help && !schema.help.hidden && schema.component"
        class="es-form-help"
        slot="help"
      >
        <es-base :config="schema.help" :info="schema.__info"></es-base>
      </div>
    </es-tabs-nav>
    <ul
      class="es-tabs-body"
      v-if="schema.__propSchemaList.length"
      :style="{
        padding: schema.array.hasBorder
          ? schema.array.padding
            ? schema.array.padding
            : Math.min(schema.array.rowSpace, 10) + 'px'
          : schema.array.padding
          ? schema.array.padding
          : Math.min(schema.array.rowSpace, 10) + 'px 0 0 0',
        'border-width': schema.array.hasBorder ? '1px' : '0px'
      }"
    >
      <li
        v-for="(itemSchema, index) in schema.__propSchemaList"
        :key="index"
        v-show="index === schema.__tabsIndex"
      >
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
            <slot :name="fieldName" :schema="fieldSchema"></slot>
          </template>
        </component>
        <es-object :schema="itemSchema" v-else-if="itemSchema.properties">
          <template
            v-for="(fieldSchema, fieldName) in itemSchema.properties"
            :slot="fieldName"
          >
            <slot :name="fieldName" :schema="fieldSchema" :index="index"></slot>
          </template>
        </es-object>
        <template v-else>
          <slot :schema="itemSchema"></slot>
        </template>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";

$styleColor: #e4e7ed;

.es-form-array-tabs {
  overflow: hidden;

  .es-tabs-body {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid $styleColor;
    border-top: none;
    border-radius: 0 0 4px 4px;

    li {
      position: relative;
      margin: 0;
      padding: 0;
      left: 0;
      top: 0;
    }

    .empty-body-item {
      line-height: 40px;
      font-size: 13px;
      text-align: center;
      color: #b3b5b9;
    }
  }
}
</style>

<script>
import esObject from "./object";
import tabs from "./tabs";
import itemMixin from "../mixins/item-mixin";
import arrayMixins from "../mixins/array-mixin.js";
import esTabsNav from "../components/tabs-nav";
import esTabsNavItem from "../components/tabs-nav-item";
import esBase from "../base";
// import constant from "../libs/constant";

export default {
  mixins: [itemMixin, arrayMixins],
  components: {
    esObject,
    esTabsNav,
    esTabsNavItem,
    tabs,
    esBase
  },

  data() {
    return {};
  },
  methods: {
    clickActiveHandler(index) {
      var form = this.__getForm();
      form._toggleUi("tabs", {
        key: this.schema.__info.pathKey,
        index: index
      });
    },

    delItemHandler(index) {
      var newIndex = false;
      if (index < this.schema.__tabsIndex) {
        // 删除的tab在当前高亮之前
        newIndex = this.schema.__tabsIndex - 1;
      }
      // console.log("newIndex: ", newIndex, index, this.schema.__tabsIndex);
      this.delItem(index); // 这里会对this.schema.__propSchemaList进行减少
      if (newIndex !== false) {
        var form = this.__getForm();
        form._toggleUi("tabs", {
          key: this.schema.__info.pathKey,
          index: newIndex
        });
      }
    },

    addItemHandler() {
      this.addItem(); // 这里会对this.schema.__propSchemaList进行添加

      var form = this.__getForm();
      form._toggleUi("tabs", {
        key: this.schema.__info.pathKey,
        index: this.schema.__propSchemaList.length - 1
      });
    }
  },

  mounted() {},

  beforeDestroy() {}
};
</script>
