<template>
  <button :class="[disabled ? 'disabled' : '']" @click="clickHandler">
    <slot></slot>
  </button>
</template>

<style lang="scss"></style>

<script>
export default {
  data() {
    return {};
  },
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    clickHandler(event) {
      if (!this.disabled) {
        this.$emit("click", event);
      } else {
        // do nothing
      }
    }
  }
};
</script>
