# 安装/全局配置

## 安装
```js
npm install --save vue-easy-form
```

## 引入

```js
import esForm from "vue-easy-form";
```

## 注册
语法：Vue.use(esForm, extendRule, options);

如：
```js
Vue.use(esForm);
或
Vue.use(esForm, {isDomain: ()=>{}}, { boxRowSpace: 10 });
```
参数(get)：

- esForm: 必填 所引入的esForm组件
- extendRule 非必填 扩展规则
- options：非必填 全局设置

## 全局设置

表单全局配置有如下
| 属性名 | 默认值 | 说明
| -- | -- | --
| boxRowHeight | 40 | 设置每一块中每一行的高度
| boxRowSpace | 20 | 整数（px） 设置每一块中行与行的距离
| boxLabelWidth | 100 | 整数（px） 设置每一块中每一行的label的宽度
| colon | false | 是否有冒号
| direction | "h" | 竖排还是横排
| defaultCom | "input" | 当配置时，不写component.name时用这个
| defaultVal | "" | 对defaultCom的补充，当组件为defaultCom时且没有设置默认值，则取此值；<br />`注：此值对其它组件不补充`
| help | { name: "help组件", props: {} } | 设置默认的帮助组件
| trimEvent | "change" | 当组件的值是字符串时，要去掉两边的空格：触发这个事件去掉（因为有些地方可能是changed）