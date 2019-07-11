<template>
  <div class="console-box">
    <button class="console-btn" @click="clickHandler">Console</button>
    <div class="console-panel" v-if="showPanel">
      <div class="console-header" draggable="true" @dragstart="startDragHandler" @dragend="endDragHandler">
        <h2 class="panel-title">esForm调试面版</h2>
      </div>
      <div class="console-close" @click="showPanel=false">Close</div>
      <div class="panel-body">
        <h3 class="subtitle">根数据(rootData) => getValue取出</h3>
        <div class="value-box">

        </div>
        <h3 class="subtitle">表单数据(formValue) => getFormValue取出</h3>
        <div class="value-box">
          
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
  .console-box {
    position: absolute;
    right: 5px;
    top: 5px;

    .console-btn {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #dcdfe6;
      color: #fff;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: .1s;
      font-weight: 500;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 18px;
      padding: 7px 18px 8px 18px;

      &:hover {
        background: rgba(0, 0, 0, 0.4);
        color: #409eff;
      }
    }

    .console-panel {
      position: fixed;
      right: 20px;
      top: 20px;
      border: 1px solid #b3d8ff;
      border-radius: 5px;
      background: #fff;
      text-align: left;
      overflow: hidden;
      width: 500px;

      .console-header {
        background: #ecf5ff;

        cursor: move;

        // @include display-center;

        .panel-title {

          cursor: move;
          
          margin: 0;
          padding: 0 0 0 10px;
          line-height: 40px;
          font-size: 18px;
          font-weight: 500;

          // @include flex-full;
        }
      }

      .console-close {
        position: absolute;
        top: 12px;
        right: 10px;
        color: #409eff;
        cursor: pointer;
        line-height: 18px;
        font-size: 14px;
        user-select: none;

        &:hover {
          color: #66b1ff;
        }
      }

      .panel-body {
        margin: 0;
        padding: 0px 10px 10px 10px;

        .subtitle {
          margin: 10px 0 0 5px;
          padding: 0;
          line-height: 24px;
          font-size: 15px;
          font-weight: 400;
        }

        .value-box {
          border: 1px solid #dcdfe6;
          height: 200px;
          border-radius: 3px;
        }
      }
    }
  }
</style>

<script>
export default {
  data() {
    return {
      showPanel: true
    };
  },
  props: {
    // disabled: {
    //   type: Boolean,
    //   required: false,
    //   default: false
    // }
  },

  methods: {
    clickHandler(event) {
      this.$data.showPanel = !this.$data.showPanel;
    },

    startDragHandler(event) {
      console.log("startDrag: ", event);
    },

    endDragHandler(event) {
      console.log("endDrag: ", event);
    }
  }
};
</script>
