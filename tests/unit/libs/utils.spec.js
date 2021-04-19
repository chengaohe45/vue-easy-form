import { expect } from "chai";
import Vue from "vue";

import utils from "@/package/libs/utils.js";

// 初始化工具组件，传这个Vue：用注册时的Vue，这样虚拟节点才能判断正确
utils.initVue(Vue);

describe("utils.js", () => {
  it("base type check", () => {
    expect(utils.isBool(true)).to.equal(true);
    expect(utils.isBool(null)).to.equal(false);

    expect(utils.isNum(1.1)).to.equal(true);
    expect(utils.isNum("1.1")).to.equal(false);

    expect(utils.isStr("true")).to.equal(true);
    expect(utils.isStr(true)).to.equal(false);

    expect(utils.isFunc(() => {})).to.equal(true);
    expect(utils.isArr(true)).to.equal(false);

    expect(utils.isDate(new Date())).to.equal(true);
    expect(utils.isDate(123)).to.equal(false);

    expect(utils.isObj({})).to.equal(true);
    expect(utils.isObj("{}")).to.equal(false);
  });

  it("deepCopy", () => {
    var obj = {
      a: 1,
      b: {
        b1: 21,
        b2: 23
      }
    };
    obj.c = obj.b; // 同一个地址

    obj.d = { d1: obj.b, d2: 42 }; // 进入循环
    obj.b.b1 = obj.d;
    expect(utils.deepCopy(obj)).to.have.property("c");
    var tmpObj = utils.deepCopy(obj);
    expect(tmpObj.b).to.equal(tmpObj.c);
    expect(tmpObj.b).to.equal(tmpObj.d.d1);
  });
});
