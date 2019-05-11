<template>
  <el-select v-bind="$attrs" v-on="$listeners" v-model="comVal">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.text"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<style lang="scss"></style>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },

    value: {}
  },

  data() {
    return {
      comVal: null
    };
  },

  components: {},

  created() {
    this.$data.comVal = this.value;
  },

  methods: {
    change() {
      // if (this.$data.comVal != this.value) {
      //   this.$emit("input", this.$data.comVal);
      // }
    }
  },

  watch: {
    value: {
      handler(newVal) {
        if (this.$data.comVal != newVal) {
          this.$data.comVal = newVal;
        }
      },
      deep: false
    }
  }
};
</script>
