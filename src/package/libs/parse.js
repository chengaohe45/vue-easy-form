// import formUtils from "./form-utils";
import utils from "./utils";
import constant from "./constant";

let parse = {
  isEsScript(scriptTxt, expPrefix = "es:") {
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
  },

  /**
   * 智能分析值
   * @param {*} val
   * @param {*}
   *   idxChain: 该值的索引链，即所在的路径中的所有数组中的索引，比如 persons[0].name[1].firstname，即该值为"0,1"
   *   data: {rootData: 代表$root的值, globalData: 代表$global的值}
   * 规则：
   * 1. 普通值直接返回
   * 2. 函数类型返回执行后的值
   * 3. 字符串且以dx:开头的，则会进行处理成可执行的脚本并执行返回结果（其中表达式中$root代表rootData, $const代表constData）
   */
  smartEsValue(
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
          rootData: parseSources.rootData,
          idxChains: parseSources.idxChain
            ? parseSources.idxChain.split(",")
            : [],
          index: parseSources.index,
          rootSchema: parseSources.rootSchema,
          isHidden: parseSources.isHidden
        };
      } else {
        // 自定义函数
        options = {
          global: parseSources.global,
          rootData: parseSources.rootData,
          idxChain: parseSources.idxChain,
          index: parseSources.index,
          pathKey: parseSources.pathKey,
          $hidden: parseSources.isHidden
        };
      }

      return scriptTxt(options);
    } else if (!parse.isEsScript(scriptTxt)) {
      return scriptTxt;
    } else {
      throw "还有es: parse ....: " + scriptTxt;
    }
  },

  /* 将es转换成为Function */
  newEsFuncion(scriptTxt, expPrefix = "es:") {
    let result;

    if (parse.isEsScript(scriptTxt)) {
      var options = [
        {
          symbol: "$global",
          paramKey: "global"
        },
        {
          symbol: "$root",
          paramKey: "rootData"
        },
        {
          symbol: "$index",
          paramKey: "index"
        }

        /* other paramKey */
        // isHidden
        // rootSchema
        // idxChains
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
        let chainPieces = hiddenPathKey.split("[i]");
        let chainPiecesLen = chainPieces.length;
        let chainPiecesTempVal = "";
        chainPieces.forEach((piece, index) => {
          if (index < chainPiecesLen - 1) {
            chainPiecesTempVal +=
              piece + `[(${constant.ES_OPTIONS}.idxChains[` + index + "])]";
          } else {
            chainPiecesTempVal += piece;
          }
        });
        hiddenPathKey = chainPiecesTempVal;

        hiddenFunTxt =
          `${constant.ES_OPTIONS}` + ".isHidden('" + hiddenPathKey + "')"; // 后面会进行解析替换

        newScriptTxt +=
          scriptTxt.slice(
            curSliceIndex,
            hiddenPatt.lastIndex - hiddenTargetPiece.length
          ) + hiddenFunTxt;
        curSliceIndex = hiddenPatt.lastIndex;
        hiddenResult = hiddenPatt.exec(scriptTxt);
      }
      newScriptTxt += scriptTxt.slice(curSliceIndex); // 最后的片段

      // 假设val为：dx: {{$root.persons[i].age}} > 1 && {{$root.persons[i].age}} < 18
      const matchs = newScriptTxt.match(/\{{.*?}}/g) || []; // matchs值：["{{$root.persons[i].age}}", "{{$root.persons[i].age}}"]
      matchs.forEach(mItem => {
        // mItem值："{{$root.persons[i].age}}"
        let tempVal = "";
        //找出[i],按顺序说明出处
        let pieces = mItem.split("[i]");
        let piecesLen = pieces.length;
        pieces.forEach((piece, index) => {
          if (index < piecesLen - 1) {
            tempVal +=
              piece + `[(${constant.ES_OPTIONS}.idxChains[` + index + "])]";
          } else {
            tempVal += piece;
          }
        });
        //替换数据源
        options.forEach(item => {
          tempVal = tempVal.replace(
            new RegExp(`\\{{\\s*\\${item.symbol}(\\.?.*)}}`),
            `${constant.ES_OPTIONS}['${item.paramKey}']$1`
          );
        });
        newScriptTxt = newScriptTxt.replace(mItem, tempVal);
      });
      newScriptTxt = "return (" + newScriptTxt + ");";

      result = new Function(constant.ES_OPTIONS, newScriptTxt);
      result.__esFuncName = constant.ES_FUNC_NAME;
    } else {
      result = scriptTxt;
    }

    return result;
  }
};

export default parse;
