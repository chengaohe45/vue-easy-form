# 页面文件的命名规则和存在路径，虽不是固定，但力求统一

## 所有的模块都存放在modules文件夹下，modules下面的每一个文件夹代表一种模块（如news, home等），模块文件夹再分pages, modals, components, service

### 列表页（某个模块下），存放在pages文件夹
```
list.vue  rule-list.vue(比如楼层模块下存在规则列表)
```
### 编辑页（某个模块下），存放在pages文件夹
```
maker.vue rule-maker.vue(原理，同上)
```

### modal编辑内容（某个模块下），存放在modals文件夹
```
maker.vue rule-maker.vue(原理，同上)
```

### 组件（某个模块下），存放在components文件夹
```
无要求，最好根据功能自由命名
```

### 接口api和过滤（某个模块下），存放在service文件夹
```
有url.js和api.js
url.js : api基本url
api.js : 接口过滤
```
