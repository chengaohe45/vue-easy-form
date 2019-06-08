<template>
  <div class="es-form-layout-tabs">
    <es-tabs-nav :type="schema.layout.type">
      <template v-for="(itemSchema, fieldName) in schema.properties">
        <!-- <es-tabs-nav-item 写成v-if跟样式有一定关系 -->
        <es-tabs-nav-item
          v-if="!itemSchema.hidden"
          :key="fieldName"
          :required="itemSchema.rules && itemSchema.rules.required"
          :is-active="fieldName === schema.__tabsIndex"
          :has-error="itemSchema.__hasError"
          @clickActive="clickActiveHandler"
          :index="fieldName"
        >
          <template v-if="!itemSchema.label.name"
            ><span>{{
              itemSchema.label.text ? itemSchema.label.text : fieldName + ""
            }}</span></template
          >
          <span v-else class="es-form-label-box">
            <es-base
              :config="itemSchema.label"
              :form-data="formData"
              :global="global"
              :idx-chain="itemSchema.__idxChain"
              :index="itemSchema.__index"
            ></es-base>
          </span>
        </es-tabs-nav-item>
      </template>
    </es-tabs-nav>
    <ul
      class="es-tabs-body"
      :style="{
        padding: schema.boxRowSpace + 'px',
        'border-width': schema.layout.hasBorder ? '1px' : '0px'
      }"
    >
      <li
        v-for="(itemSchema, fieldName) in schema.properties"
        :key="fieldName"
        v-show="fieldName === schema.__tabsIndex && !itemSchema.hidden"
      >
        <slot :name="fieldName"></slot>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";

$styleColor: #e4e7ed;

.es-form-layout-tabs {
  overflow: hidden;

  .es-tabs-body {
    margin: 0;
    padding: 0;
    list-style: none;
    // border: 1px solid $styleColor;
    border-style: solid;
    border-color: $styleColor;
    border-top: none;
    border-radius: 0 0 4px 4px;

    li {
      position: relative;
      margin: 0;
      padding: 0;
      left: 0;
      top: 0;
    }
  }
}
</style>

<script>
import itemMixin from "../mixins/item-mixin";
import esTabsNav from "../components/tabs-nav";
import esTabsNavItem from "../components/tabs-nav-item";
import esBase from "../base";

export default {
  mixins: [itemMixin],
  components: {
    esTabsNav,
    esTabsNavItem,
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
    }
  },

  created() {},

  mounted() {},

  beforeDestroy() {}
};
</script>
