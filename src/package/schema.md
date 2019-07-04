## easy form配置详解


###schema写法一（全写，也就是对象里面包含properties）
```
如：
{
  ...
  properties: {
    ...name: {
      ...
    },
    age: {
      ...
    }
  }
}
```
###schema写法二（简写, 只写表单属性，但不能同时出现properties属性）
```
如：
{
  name: {
    ...
  },
  age: {
    ...
  }
}
```
###schema具体配置属性
```
{
  //title: '表单名称', // 简单写法或不写，不写则标题不存在; title必须要和properties同一级，否则是无效的;properties的存在，证明它的下一级属性是一个级别，可以为这个级别起一个title
  title: {  // 标准写法
    text: "表单名称",
    type: "bg" //bg bg-block bg-border bg-block-border //设置一些样式
  }
  direction: "v", // 类型：字符串; 值：v或h label和输入框的排列方式（横排还是竖排），根节点默认为h（横排），其它的没有设置就会继承
  colon: true, // 是否有冒号，根节点默认为没有，其它的没有设置就会继承
  rowHeight: 40, // 整数（px） 每一行的高度，为什么设置这个，因为每一个的输入框是没有办法知道的，只能根据实际情况设置，这样使排版更加美观；根节点默认为40px，其它的没有设置就会继承
  boxRowHeight: 40, // 整数（px） 每一行的高度，为什么设置这个，表明子节点的高度（在子节点没有设置rowHeight时，就会取这个值），会被下一个properties继承
  rowSpace: 20, //整数（px） 与上一次行之间的间隔; 注意：是与上一行的间隔，那么第一行设置了也没有用
  boxRowSpace: 20, //整数（px）在properties中有效，表明子节点中行与行之间的间隔（在子节点没有设置rowSpace时，就会取这个值），会被下一个properties继承
  labelWidth: 120, //整数（px） label的宽度
  boxLabelWidth: 120, //整数（px）在properties中有效，表示子节点的label的宽度，原理同boxRowSpace，不过在table中无效
  offsetLeft: 0,    // 每一项左边留白的空间
  offsetRight: 0,   // 每一项右边留白的空间
  hidden: false, //支持es语法; 是否隐藏此级，默认为显示；当为false时，默认此字段的值是不取出的；若想设置隐藏后的值，见hdValue
  hdValue: '',  // 非必填。当自己的hidden或父类的hidden为true时有效；此值取出后（如properties的hidden设置为true），子节点不再遍列取值; 注：为undefined时，则此字段不会取出, null为正常遍历，其余为取此值
  properties: { // 根节点：表单字段
    name: {
      value: '', // 必填：数据的值
      hidden: false, //支持es语法; 是否隐藏此级，默认为显示
      hdValue: '', // 同上hdValue
      direction: "h", //同上，不写就继承父类
      isTrim: false, //是否去掉左右两边的空格，包括换行，默认为true
      col: 12,  //每一个属性原则上是点一行的，一行分为24列，12就代表一半
      //label: '姓名', //值false或字符串或对象，默认为false,空值代表占空间，label区域保留
      label: {  // 支持es语法; 标准写法
        text: "姓名",
        flex: "self" or "full", //full 自动，空间有多少占多少	//self 固定，看内容的长度是多少就多少 默认两都都没有直接取labelWidth, 当有些值时，labelWidth失效
      },
      rules: { 有value的地方可设置rules, 比如component和含有array的properties
        required: true, //支持es语法; 
        emptyMsg: "代号不能为空", //当requred为true时有用
        /* 
        check里的值形式如下
         注意：
         当是一个string的时候, 公共或扩展的function,传入的值第一个参数将是本身的值，后面的为自己添加的参数，没有传入formData
         当是一个function的时候，传入的值第一个参数将是本身的值，第二个为会根formData值，后面的为自己添加的参数，这样做是为了个性化检验自由度更高 
        // checks: "isMobile", //写法一
        // checks: ["isMobile", "isEmail"], //写法二
        // checks: ["isMobile", "isEmail", function(value, formData, ...)], //写法三
        // checks: { //写法四
        //  handler: "isTest", //字符串
        //  trigger: "change", //非必填；检查的时机，比如电话号码不能实时检查，再光标离开时再检人木日
        //  params: [1, 2]  //自定义需要传入的参数，数组，不然就会当做一个参数传入 这个将会变成这样：isTest(value, 1, 2)
        //}, 
        // checks: { //写法五
        //  handler: function(){}, //直接一个函数；注意：当是一个function的时候，传入的值第一个参数将是本身的值，第二个为会根formData值，后面的为自己添加的参数，这样做是为了个性化检验自由度更高
        //  params: [1, 2]  //自定义需要传入的参数 这个将会变成这样：function(value, formData, 1, 2)
        //}, 
        // checks: ["isMobile", "es: {{$root.age}}>10"], //写法六
        */
        checks: value => {
          if (value.length > 10) {
            // return "姓名不能大于10个字";
            return false;
          } else {
            return true;
          }
        },
        errMsg: "代号不能大于10"  //当check中的函数返回的值不是字符串（为false）时有效
      },
      //component: "el-input" //字符串，也就是组件名
      component: {  //标准写法
        name: "el-input",
        flex: "self" or "full", //full 自动，空间有多少占多少	//self 固定，看内容的长度是多少就多少
        props: {  //组件需要的属性配置 全部属性(如type)支持es语法; 
          type: "password",
          placeholder: "请输入代号"
        }
      },
      group: "g", //字符串（如"g"可以是任意字符串），设置此值说明相邻的"同组"节点会排成一行，不换行; 是排列component,对properties无效
      unit: "%",  //字符串，对组件进行补充; 是对component的补充,对properties无效
      desc: "1. 姓名必须这个样子<br />2. 姓名必须这个样子", //对此属性的描述，支持html
      help: {
        ...
      }
    },
    age: {
      value: '', // 必填：数据的值
      hidden: false, //是否隐藏此级，默认为显示
      hdValue: '', // 同上hdValue
      group: "g", //字符串（如"g"可以是任意字符串），设置此值说明相邻的"同组"节点会排成一行，不换行; properties（包括array中的数组）暂不支持
      ...
    },
    tmptext3: { //当没有properties和component,说明这个是占位符，此值不会取出，label也不会显示（有效值只有col, hidden, group; 其余的失效），"tmptext3"为任意属性名
      group: "g",
      value: "102",
      col: 12,
      label: {
        text: "体重体重体重体重3"
      },
      help: {} ; // properties（包括array中的数组）暂不支持
    },
    more1: {
      title: ...
      properties: {
        subname: {
          label: ...
        }
      }
    },
    more2: {
      title: ...
      //array: "array",  //简写：值有"array" or "array-table" or "array-tabs";有此值说明是一个动态数组，可添加、删除、排序
      array: {
        name: "array",
        hasSort: true,  //是否有排序按钮，默认为true
        hasDelete: true,  //是否有删除按钮，默认为true
        hasAdd: true, //是否有添加按钮，默认为true
        max: 10,  //不写或小于等于0代表不限制
        hasOrder: true,  //是否有序号，默认为true
        headRequired: false, //此值当name为array-table有效，当设置为true时，“星号”在table头部显示，而不是在内容区随组件显示，默认为true;注意：当为true时，required的值不能受properties里面的属性影响
      }
      properties: {
        subname: {
          label: ...
        }
      }
    }
  }
}
```
