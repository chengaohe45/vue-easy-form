/**
 * ps.js
 *
 *
 * 用于解析es语句
 *
 */

import utils from "../libs/utils";
import constant from "../libs/constant";

/**
 * 判断是否正确的es语句或函数
 * @param {*} scriptTxt
 * @param {*} expPrefix
 */
export function isEsOrFunc(scriptTxt, expPrefix = "es:") {
  if (utils.isFunc(scriptTxt)) {
    return true;
  } else {
    return this.isEsScript(scriptTxt, expPrefix);
  }
}

/**
 * 解析出当前的key是否静态写法（旧式写法）
 * @param {*} key
 * @returns
 */
export function getStaticKey(key) {
  var prefixs = constant.PREFIX_STATIC_FUNC;
  for (var i = 0; i < prefixs.length; i++) {
    var prefix = prefixs[i];
    if (key.indexOf(prefix) === 0) {
      return key.substr(prefix.length);
    }
  }
  return false;
}

/**
 * 判断是否正确的es语句
 * @param {*} scriptTxt
 * @param {*} expPrefix
 */
export function isEsScript(scriptTxt, expPrefix = "es:") {
  if (utils.isStr(scriptTxt)) {
    var esIndex = scriptTxt.indexOf(expPrefix);
    if (esIndex === 0) {
      var execStr = scriptTxt.substr(expPrefix.length);
      if (execStr && execStr.trim()) {
        return true;
      } else {
        return false; // 为空，也不是
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * 智能解析脚本
 * @param {*} scriptTxt
 * @param {*} parseSources
 * scriptTxt情况：
 * 1. 普通值直接返回
 * 2. 函数类型返回执行后的值
 */
export function smartEsValue(
  scriptTxt,
  // {
  //   global = {},
  //   rootData = {},
  //   index = -1,
  //   idxChain = "",
  //   pathKey = "",
  //   rootSchema = {},
  //   isHidden
  // } = {}
  parseSources
) {
  if (utils.isFunc(scriptTxt)) {
    var options;
    if (scriptTxt.__esFuncName === constant.ES_FUNC_NAME) {
      // es: 转过来的函数
      options = {
        global: parseSources.global,
        root: parseSources.rootData,
        idxChains: parseSources.idxChain
          ? parseSources.idxChain.split(",")
          : [],
        index: parseSources.index,
        // rootSchema: parseSources.rootSchema,
        isHidden: parseSources.isHidden
      };
    } else {
      // 自定义函数
      options = {
        global: parseSources.global,
        rootData: parseSources.rootData, // 兼容1.7.0以前，不包括1.7.0
        root: parseSources.rootData,
        idxChain: parseSources.idxChain,
        index: parseSources.index,
        pathKey: parseSources.pathKey,
        $hidden: parseSources.isHidden
      };
    }

    return scriptTxt(options);
  } else if (!isEsScript(scriptTxt)) {
    return scriptTxt;
  } else {
    throw "还有es: parse ....: " + scriptTxt;
  }
}

/**
 * 将es转换成为Function
 * @param {*} scriptTxt
 * @param {*} expPrefix
 */
export function newEsFuncion(scriptTxt, expPrefix = "es:") {
  let result;

  if (isEsScript(scriptTxt)) {
    // 索引链变量名，以免用户调用
    const varIdxChains = "__esIdxChains" + Math.floor(Math.random() * 99);
    var options = [
      {
        symbol: "$global",
        paramKey: "global"
      },
      {
        symbol: "$root",
        paramKey: "root"
      },
      {
        symbol: "$index",
        paramKey: "index"
      }
    ];

    scriptTxt = scriptTxt.substring(expPrefix.length);
    scriptTxt = scriptTxt.trim(); // 与isEsScript判断一致

    // 解析$hidden
    let hiddenPatt = /\{{(\s*\$hidden\()(.+?)(\)\s*}})/gi;
    let hiddenResult = null;
    let hiddenTargetPiece = "";
    let hiddenPathKey = "";
    let hiddenFunTxt = "";
    let newScriptTxt = "";
    let curSliceIndex = 0;
    // let hasHiddenFun = false;
    hiddenResult = hiddenPatt.exec(scriptTxt);
    while (hiddenResult) {
      // hasHiddenFun = true; // 有隐藏函数

      //若有值，会分成三段 如：["{{$hidden( tt[i].age )}}", "$hidden(", " tt[i].age ", ")}}"]
      hiddenTargetPiece = hiddenResult[0];
      hiddenPathKey = hiddenResult[2];
      // 去掉单双引号和$root若存在
      hiddenPathKey = hiddenPathKey.trim();
      hiddenPathKey = hiddenPathKey.replace(/^('|")|('|")$/g, "");
      hiddenPathKey = hiddenPathKey.trim();
      //去掉$root;若存在
      hiddenPathKey = hiddenPathKey.replace(/^\$root(\.)?/g, "");
      hiddenPathKey = chainPathKey(hiddenPathKey, constant.IDX_CHAIN_KEY);
      let chainPieces = hiddenPathKey.split(constant.IDX_CHAIN_KEY);
      let chainPiecesLen = chainPieces.length;
      let chainPiecesTempVal = "";
      chainPieces.forEach((piece, index) => {
        if (index < chainPiecesLen - 1) {
          chainPiecesTempVal +=
            piece + `[' + (${varIdxChains}[` + index + "]) + ']";
        } else {
          chainPiecesTempVal += piece;
        }
      });
      hiddenPathKey = chainPiecesTempVal;
      hiddenFunTxt = "$hidden('" + hiddenPathKey + "')"; // 后面会进行解析替换

      newScriptTxt +=
        scriptTxt.slice(
          curSliceIndex,
          hiddenPatt.lastIndex - hiddenTargetPiece.length
        ) + hiddenFunTxt;
      curSliceIndex = hiddenPatt.lastIndex;
      hiddenResult = hiddenPatt.exec(scriptTxt);
    }
    newScriptTxt += scriptTxt.slice(curSliceIndex); // 最后的片段

    // 假设val为：es: {{$root.persons[i].age}} > 1 && {{$root.persons[i].age}} < 18
    const matchs = newScriptTxt.match(/\{{.*?}}/g) || []; // matchs值：["{{$root.persons[i].age}}", "{{$root.persons[i].age}}"]
    matchs.forEach(mItem => {
      // mItem值："{{$root.persons[i].age}}"
      // console.log("1 mItem: ", mItem);
      let tmpItem;
      let tempVal;
      if (mItem.indexOf(constant.IDX_CHAIN_KEY) > 0) {
        // 数组的，不再转换：让用户自己控制，表达式更加强大
        tmpItem = mItem;
        tempVal = "";
        //找出[i],按顺序说明出处
        let pieces = tmpItem.split(constant.IDX_CHAIN_KEY);
        let piecesLen = pieces.length;
        pieces.forEach((piece, index) => {
          if (index < piecesLen - 1) {
            tempVal += piece + "[" + varIdxChains + "[" + index + "]]";
          } else {
            tempVal += piece;
          }
        });
        //替换数据源: 去掉左右两边的分隔符
        tempVal = tempVal.replace(/^{{|}}$/g, "");
        // console.log("tempVal1: ", tempVal);
      } else {
        // 一般表达式，旧式写法，就按旧的来,不做改动
        tempVal = chainPathKey(mItem, constant.IDX_CHAIN_KEY);
        //替换数据源
        options.forEach(item => {
          tempVal = tempVal.replace(
            new RegExp(`\\{{\\s*\\${item.symbol}(\\.\\S*)?\\s*}}`),
            `$${item.paramKey}$1`
          );
        });
        // console.log("tempVal2: ", tempVal);
      }
      newScriptTxt = newScriptTxt.replace(mItem, tempVal);
    });

    let prefixScript = "";
    options.forEach(item => {
      prefixScript += `var $${item.paramKey} = ${constant.ES_OPTIONS}.${
        item.paramKey
      }; `;
    });
    prefixScript += `var ${varIdxChains} = ${constant.ES_OPTIONS}.idxChains; `;
    prefixScript += `var $hidden = ${constant.ES_OPTIONS}.isHidden; `;
    newScriptTxt = prefixScript + " return (" + newScriptTxt + ");";

    // console.log("newScriptTxt: ", newScriptTxt);

    result = new Function(constant.ES_OPTIONS, newScriptTxt);
    result.__esFuncName = constant.ES_FUNC_NAME;
  } else {
    result = scriptTxt;
  }

  return result;
}

export function execEsValue(scriptTxt, options) {
  if (utils.isFunc(scriptTxt)) {
    return scriptTxt(options);
  } else {
    return scriptTxt;
  }
}

/**
 * rawRathKey把pathKey转化为标准的链式形式
 * 如：base["person"].name => base.person.name
 * 小括号会直接掉
 * @param {*} rawRathKey
 * @param {*} exclude 如[i]不需要解析，它有特定的含义
 */
export function chainPathKey(rawRathKey, exclude) {
  var parenthesesReg = /\(|\)/g;
  var tmpRathKey = rawRathKey.replace(parenthesesReg, "");
  var sumTxt;
  if (rawRathKey.indexOf("[") >= 0) {
    // 进行解析
    var mBracketReg = /\[('|")?(.+?)\1\]/g;
    var curExec,
      lastIndex = 0;
    sumTxt = "";
    var numReg = /^\d+$/;
    curExec = mBracketReg.exec(tmpRathKey);
    while (curExec) {
      var fullKey = curExec[0];
      var subKey = curExec[2].trim();
      sumTxt += tmpRathKey.substr(lastIndex, curExec.index - lastIndex);
      if (exclude != fullKey) {
        if (numReg.test(subKey)) {
          sumTxt += "[" + subKey + "]";
        } else {
          sumTxt += "." + subKey;
        }
      } else {
        sumTxt += fullKey;
      }
      lastIndex = curExec.index + fullKey.length;

      curExec = mBracketReg.exec(tmpRathKey);
    }

    // 补上最后的字段
    sumTxt += tmpRathKey.substr(lastIndex);
  } else {
    // 不需要转换，土又白目直接返回
    sumTxt = tmpRathKey;
  }

  return sumTxt;
}

/* 判断语句是否可以赋值。如"es:{{$item.name}} or {{$item}}.person.name" */
export function canAssign(scriptTxt, expPrefix = "es:") {
  // return false;
  if (this.isEsScript(scriptTxt, expPrefix)) {
    var tmpExpression = scriptTxt.substring(expPrefix.length);
    tmpExpression = tmpExpression.trim();
    var reg = /^\{\{\s*\$.+?\}\}(\.[\w-]+?)*$/;
    return reg.test(tmpExpression);
  } else {
    return false;
  }
}
