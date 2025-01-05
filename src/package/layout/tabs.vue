<template>
  <div class="es-form-layout-tabs">
    <es-tabs-nav :type="schema.layout.type">
      <template v-for="(itemSchema, fieldName) in schema.properties">
        <!-- <es-tabs-nav-item 写成v-if跟样式有一定关系 -->
        <es-tabs-nav-item
          v-if="!itemSchema.hidden"
          :key="fieldName"
          :is-active="fieldName === schema.__tabsIndex"
          :has-error="itemSchema.__hasError"
          @clickActive="clickActiveHandler"
          :index="fieldName"
          :info="itemSchema.__info"
        >
          <!-- itemSchema.label.hidden为true: 也补充key -->
          <div class="es-tabs-item-label">
            <span
              v-if="
                (itemSchema.array &&
                  itemSchema.array.rules &&
                  mxParseBoolValue(itemSchema.array.rules.required, itemSchema.__info) &&
                  mxParseBoolValue(itemSchema.array.rules.showRequired, itemSchema.__info)) ||
                  (itemSchema.rules &&
                    !itemSchema.array &&
                    mxParseBoolValue(itemSchema.rules.required, itemSchema.__info) &&
                    mxParseBoolValue(itemSchema.rules.showRequired, itemSchema.__info))
              "
              class="es-required"
              >*</span
            >
            <template v-if="mxShowComponent(itemSchema.label, itemSchema.__info)">
              <span class="es-form-label-box">
                <es-base :config="itemSchema.label" :info="itemSchema.__info"></es-base>
              </span>
            </template>
            <!-- <template v-if="itemSchema.label && !itemSchema.label.hidden">
              <span v-if="!itemSchema.label.name">{{
                itemSchema.label.text ? itemSchema.label.text : fieldName + ""
              }}</span>
              <span v-else class="es-form-label-box">
                <es-base
                  :config="itemSchema.label"
                  :info="itemSchema.__info"
                ></es-base>
              </span>
              <span
                class="es-form-label-help"
                v-if="itemSchema.label.help && !itemSchema.label.help.hidden"
              >
                <es-base
                  :config="itemSchema.label.help"
                  :info="itemSchema.__info"
                ></es-base>
              </span>
            </template> -->
            <span v-else>{{ fieldName + "" }}</span>
          </div>
        </es-tabs-nav-item>
      </template>
    </es-tabs-nav>
    <ul
      class="es-tabs-body"
      :style="__createTabBodyStyle()"
    >
      <template v-for="(itemSchema, fieldName) in schema.properties">
        <li
          :key="fieldName"
          v-if="itemSchema.__creatable"
          v-show="fieldName === schema.__tabsIndex && !itemSchema.hidden"
          :style="itemSchema.__style"
        >
          <slot :name="fieldName"></slot>
        </li>
      </template>
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
    text-align: left;

    li {
      position: relative;
      margin: 0 auto 0 0;
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
import constant from "../libs/constant";
import utils from "../libs/utils";

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
      // var form = this.__getForm();
      var rootInstance = utils.getParent(this, constant.ES_FORM_ROOT_NAME);
      rootInstance._toggleUi("tabs", {
        key: this.schema.__info.pathKey,
        index: index
      });
    },

    __createTabBodyStyle() {
      var schema = this.schema;
      var style = {
        // padding: schema.layout.hasBorder
        //   ? schema.layout.padding
        //     ? schema.layout.padding
        //     : Math.min(schema.ui.rowSpace, 10) + 'px'
        //   : schema.layout.padding
        //   ? schema.layout.padding
        //   : Math.min(schema.ui.rowSpace, 10) + 'px 0 0 0',
        // 'border-width': schema.layout.hasBorder ? '1px' : '0px'
      }
      var padding = this.mxParsePadding(schema.layout.padding, schema.__info);
      if (padding && padding.length === 4) {
        style.padding = padding.join(" ");
      }
      if (schema.layout.hasBorder) {
        style.borderWidth = "1px";
        if(!style.padding) {
          style.padding = Math.min((utils.isNum(this.schema.rowSpace) ? this.schema.rowSpace : 10), 10) + "px"
        }
      } else {
        style.borderWidth = "0px";
        if(!style.padding) {
          style.padding = Math.min((utils.isNum(this.schema.rowSpace) ? this.schema.rowSpace : 10), 10) + "px 0 0 0"
        }
      }
      return style;
    }

    // __getForm() {
    //   var formItem = this.$parent;
    //   while (formItem) {
    //     var type = formItem._getType ? formItem._getType() : "";
    //     if (type == constant.UI_FORM) {
    //       // formItem._syncFormUi(checkSchema, eventNames, targetValue, eventData); // 最外层的表单层同步所有的ui及数位
    //       return formItem; // 到达表单层
    //     } else if (type == constant.UI_ARRAY) {
    //       // checkSchema.push(formItem._getSchema());
    //     } else {
    //       // ... 往上派
    //     }
    //     formItem = formItem.$parent;
    //   }
    // }
  },

  created() {},

  mounted() {},

  beforeDestroy() {}
};
</script>
