<template>
  <div class="content-box" v-html="text"></div>
</template>

<style lang="scss">
@import "@/static/css/mixins.scss";

.content-box {
  line-height: 20px;
}
</style>

<script>
// import unitMixin from "../../mixins/unit-mixin";

export default {
  // mixins: [unitMixin],
  props: {
    // filter: {
    //   type: Function,
    //   required: false,
    //   default: null
    // },

    text: {
      type: String,
      required: false,
      default: null
      // validator: function (value) {
      //   if (value) {

      //   } else {
      //     return false;
      //   }
      // }
    }

    // isHtml: {
    //   type: Boolean,
    //   required: false,
    //   default: true
    // }
  },

  data() {
    return {
      // showBody: true,
      // isChanged: false,
      // changedMode: ""
    };
  },

  components: {
    // esObject,
    // esArray,
    // esArrayTable
  },

  created() {},

  methods: {
    // clickHandler() {}
  },

  watch: {
    // formData: {
    //   handler: function() {
    //     if (this.$data.isChanged) {
    //       this.$data.isChanged = false;
    //       this.checkValue(this.schema.value, this.$data.changedMode);
    //       this.$data.changedMode = "";
    //     }
    //   },
    //   deep: false
    // }
  }
};
</script>
