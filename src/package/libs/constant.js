let constant = {
  // HELP_NAME: "es-help", //注册时用的全局名字
  UI_MAX_COL: 24, //整修个布局分为多少列，这个值不要随便改， 要跟object.vue的UI_MAX_COL对应
  ARRAY_TABLE: "array-table", // 只支持properities（非叶子）
  ARRAY_TABS: "array-tabs",
  ARRAY_LEGEND: "array-legend",
  ARRAY_ROW: "array",
  ARRAY_CARD: "array-card", // 只支持组件（叶子）

  POINT_CENTER_CENTER: "center-center", // tip框与源icon可以居中指向
  POINT_ARROW_CENTER: "arrow-center", // tip框偏移，但指向源icon中间
  POINT_ARROW_OFFSET: "arrow-offset", // tip框偏移，也不指向源icon中间

  ADJ_NATIVE: "native", // 将原生事件绑定到组件; 本身是区分大小写的；keyup.native为例：原生input.text监听不到，但组件（就只有一个input.text）可以监听到事件，

  INPUT_EVENT: "input",
  CHANGE_EVENT: "change", // 应用于数组改变
  CLICK_EVENT: "click",

  TAG_INPUT: "input",
  TYPE_RADIO: "radio",
  TYPE_CHECKBOX: "checkbox",

  KEYUP_NATIVE: "keyup.native",
  ENTER_SUBMIT: "@enterSubmit",
  ONLY_SUBMIT: "@submit",

  // TYPE_TMP: "tmp", // 表单的临时值，跟组件没有什么区别；只是不会取出；使用场景：快速做标题或编辑时，某些项需要显示但又不需要提交给后台
  LAYOUT_SPACE: "space", // 占位符; space不可以乱改，因为其它地方(.vue)有用到
  LAYOUT_TABS: "tabs", // properties的子属性是tabs布局; space不可以乱改，因为其它地方(.vue)有用到

  UI_FORM: "_es_form_qwerty_", // 说明界面属于哪种类型
  UI_ITEM: "_es_item_qwerrf_",
  UI_ARRAY: "_es_array_aadfsd_",

  ES_FUNC_NAME: "__E0S1_2F3U4NC_N4AM5E__",
  ES_OPTIONS: "__es__Options__", // 此值要是正规的命名

  PREFIX_STATIC_FUNC: ["s:"], // 对于props里面的属性，以PRE_STATIC_FUNC开头的且是函数，则说明是静态，不解析

  // 原生的表单组件，主要是用来过滤空格
  FORM_INPUTS: ["input", "textarea"],
  INPUT_CHANGE: "change",

  IDX_CHAIN_KEY: "[i]" // 数组链的代替字符，不可随便改
};

export default constant;
