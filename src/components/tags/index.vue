<template>
  <div class="dynamic-tags">
    <el-tag
      :key="tag + '-' + index"
      v-for="(tag, index) in value"
      :closable="!disabled"
      :disable-transitions="true"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button
      v-else-if="!inputVisible && !disabled"
      class="button-new-tag"
      size="small"
      @click="showInput"
      >{{ addText }}</el-button
    >
  </div>
</template>

<script>
/**
 * 可通过this.$emit('notify-submit')通知提交数据事件
 */
export default {
  /* ====================== 生命周期 ====================== */

  // created() {},

  /* ====================== 数据绑定 ====================== */

  data() {
    return {
      inputVisible: false,
      inputValue: ""
    };
  },

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

    value: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },

    addText: {
      type: String,
      required: false,
      default: "+ 添加"
    }
  },

  watch: {
    value(newVal) {
      if (JSON.stringify(this.value) != JSON.stringify(newVal)) {
        this.value = newVal;
      }
    }
  },

  /* ====================== 事件处理 ====================== */

  methods: {
    handleClose(tag) {
      this.value.splice(this.value.indexOf(tag), 1);
      this.$emit("close", tag);
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      inputValue = inputValue.replace(/^(\s|\n|\t)+|(\s|\n|\t)+$/g, "");
      if (inputValue) {
        if (!this.value.includes(inputValue)) {
          this.value.push(inputValue);
          this.$emit("input", this.value);
          this.$emit("change", this.value);
        } else {
          this.$message({
            message: '"' + inputValue + '" 已存在',
            type: "warning"
          });
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style lang="scss">
$marginTop: 3px;
.dynamic-tags {
  .el-tag {
    margin-top: $marginTop;
    margin-bottom: $marginTop;
    margin-right: 10px;
  }

  .button-new-tag {
    margin-top: $marginTop;
    margin-bottom: $marginTop;
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    margin-top: $marginTop;
    margin-bottom: $marginTop;
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
}
</style>
