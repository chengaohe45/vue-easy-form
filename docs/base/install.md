# 安装/全局配置

## npm安装
```js
// 安装
npm install --save vue-easy-form

// 引用
import esForm from "vue-easy-form";
```

## cdn安装
可以通过[unpkg.com/vue-easy-form](https://unpkg.com/browse/vue-easy-form/) 获取到最新版本的资源，在页面上引入`js`文件即可
```html
<!-- 引入组件库: 这个会自动获取最新版本 -->
<script src="https://unpkg.com/vue-easy-form/dist/es-form.umd.min.js"></script>
<!-- 
或: 带某个版本号
<script src="https://unpkg.com/vue-easy-form@1.5.1/dist/es-form.umd.min.js"></script> 
-->

// 引用
var esForm = window["esForm"];
```

## 注册
注册的作用主要是：声明一个全局的`es-form`组件和表单框的基本配置。<br/>
`语法`：Vue.use(esForm, options); 

```js
Vue.use(esForm);
或
Vue.use(esForm, 
{
  rowHeight: 40,
  rowSpace: 20,
  labelWidth: 100,
  offsetLeft: 0,
  offsetRight: 0,
  colon: false,
  direction: "h",
  defaultCom: "input",  // 如：若用element-ui, 改为el-input
  defaultVal: "",  // 对defaultCom这个组件的value设置默认值
  trimDoms: ["input", "textarea", "el-input"], // 数组，空数组会全部清空
  hasConsole: process.env.NODE_ENV != "production"  // 推荐写成动态，编译时不用修改
});
```
参数(get)：

- esForm: 必填，所引入的esForm组件
- options：非必填，全局设置

## 全局设置

表单全局配置有如下
| 属性名 | 默认值 | 说明
| -- | -- | --
| rowHeight | 40 | 设置每一项(行)的高度；主要用于项label和项组件横向对齐
| rowSpace | 20 | 整数（px） 设置项(行)与项(行)的距离
| labelWidth | 100 | 整数（px） 设置项(行)的label的宽度
| offsetLeft | 0 | 整数（px） 项的左偏移量
| offsetRight | 0 | 整数（px） 项的右偏移量
| colon | false | 是否有冒号
| direction | "h" | 竖排还是横排
| defaultCom | "input" | 当配置时，不写component.name时用这个
| defaultVal | "" | 对defaultCom的补充，当组件为defaultCom时且没有设置默认值，则取此值；<br />`注：此值对其它组件不补充`
| trimDoms | ["input", "textarea", "el-input"] | 指出哪些表单元素需要去掉左右两边空格
| hasConsole | false | 所有的表单是否有调试控制台; 若想设置`单个表单`，可在`对应的表单`中设置hasConsole