// import constant from "./constant";
import esHelp from "../components/help.vue";

let global = {
  boxRowHeight: 40,
  boxRowSpace: 20,
  boxLabelWidth: 100,
  colon: false,
  direction: "h",
  defaultCom: "input",
  defaultVal: "", // 这个是对defaultCom的补充，当组件为defaultCom时且没有设置默认值，则取此值；注：此值对其它组件不补充
  help: { name: esHelp, props: {} },
  trimEvent:
    "change" /* 这个是form的表单项改变时，此事件触发后会去掉左右两边空格；一般都是change, 因为有些类库可以喜欢写changed */
};

export default global;
