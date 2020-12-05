<template>
  <div class="es-form-table-container" v-show="!schema.hidden">
    <span
      v-if="
        hasRequired &&
          schema.rules &&
          schema.rules.required &&
          schema.rules.showRequired
      "
      class="es-table-required es-required"
      :style="{
        height: schema.rowHeight + 'px',
        lineHeight: schema.rowHeight + 'px'
      }"
      >*</span
    >
    <div class="es-form-comp-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";

// @for $i from 1 through 24 {
//   .es-col-#{$i} {
//     width: 100% * $i / 24;
//   }
// }
.es-form-table-container {
  @include display-flex;
  @include direction-h;

  .es-table-required {
    display: block;
    margin-right: 5px;
  }
}
</style>

<script>
import itemMixin from "../mixins/item-mixin";

export default {
  mixins: [itemMixin],
  data() {
    return {};
  },
  props: {
    hasRequired: true
  },
  methods: {}
};
</script>
