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
          :tabsName="itemSchema.subLabel ? itemSchema.subLabel : index + 1 + ''"
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
          <template v-if="!itemSchema.subLabel.name"
            ><span>{{
              itemSchema.subLabel.text
                ? itemSchema.subLabel.text
                : index + 1 + ""
            }}</span></template
          >
          <span v-else class="es-form-label-box">
            <es-base
              :config="itemSchema.subLabel"
              :form-data="formData"
              :global="global"
              :idx-chain="itemSchema.__idxChain"
              :index="itemSchema.__index"
            ></es-base>
          </span>
        </es-tabs-nav-item>
      </template>

      <div
        v-if="schema.help && schema.component"
        class="es-form-help"
        slot="help"
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
    </es-tabs-nav>
    <ul
      class="es-tabs-body"
      v-if="schema.__propSchemaList.length"
      :style="{
        padding: schema.array.rowSpace + 'px',
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
      this.$emit("formClick", "tabs", {
        key: this.schema.__pathKey,
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
        this.$emit("formClick", "tabs", {
          key: this.schema.__pathKey,
          index: newIndex
        });
      }
    },

    addItemHandler() {
      this.addItem(); // 这里会对this.schema.__propSchemaList进行添加
      this.$emit("formClick", "tabs", {
        key: this.schema.__pathKey,
        index: this.schema.__propSchemaList.length - 1
      });
    },

    formClick(type, data) {
      // console.log("formClick: ", sourcePathKey, index);
      this.$emit("formClick", type, data); // 往上派发
    }
  },

  mounted() {},

  beforeDestroy() {}
};
</script>
