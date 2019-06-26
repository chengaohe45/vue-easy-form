<template>
  <div class="align-desc" :style="{ textAlign: align }">
    {{ txt }}
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    align: {
      type: String,
      required: false,
      default: "left"
    },
    txt: {
      type: String,
      required: false,
      default: "..."
    }
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {},
  components: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

.align-desc {
}
</style>
