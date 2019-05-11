import constant from "./constant";

let popUtils = {
  getPopUiInfo: function(popRect, iconRect, popInfo, placement) {
    var uiInfo = false;
    switch (placement) {
      case "top": //优化取上边
        uiInfo =
          this.getTopCenter(popRect, iconRect, popInfo) ||
          this.getRightCenter(popRect, iconRect, popInfo) ||
          this.getBottomCenter(popRect, iconRect, popInfo) ||
          this.getLeftCenter(popRect, iconRect, popInfo);
        break;
      case "right": //优化取右边
        uiInfo =
          this.getRightCenter(popRect, iconRect, popInfo) ||
          this.getTopCenter(popRect, iconRect, popInfo) ||
          this.getBottomCenter(popRect, iconRect, popInfo) ||
          this.getLeftCenter(popRect, iconRect, popInfo);
        break;
      case "bottom": //优化取下边
        uiInfo =
          this.getBottomCenter(popRect, iconRect, popInfo) ||
          this.getTopCenter(popRect, iconRect, popInfo) ||
          this.getRightCenter(popRect, iconRect, popInfo) ||
          this.getLeftCenter(popRect, iconRect, popInfo);
        break;
      case "left": //优化取左边
        uiInfo =
          this.getLeftCenter(popRect, iconRect, popInfo) ||
          this.getTopCenter(popRect, iconRect, popInfo) ||
          this.getRightCenter(popRect, iconRect, popInfo) ||
          this.getBottomCenter(popRect, iconRect, popInfo);
        break;
      default:
        // 先取上右下左：有constant.POINT_CENTER_CENTER，再constant.POINT_ARROW_CENTER，最后constant.POINT_ARROW_OFFSET
        var topUiInfo, rightUiInfo, bottomUiInfo, leftUiInfo;
        //取出数据据，判断是否居中
        topUiInfo = this.getTopCenter(popRect, iconRect, popInfo);
        if (topUiInfo && topUiInfo.pointType == constant.POINT_CENTER_CENTER) {
          return topUiInfo; // 上边居中了
        }
        rightUiInfo = this.getRightCenter(popRect, iconRect, popInfo);
        if (
          rightUiInfo &&
          rightUiInfo.pointType == constant.POINT_CENTER_CENTER
        ) {
          return rightUiInfo; // 右边居中了
        }
        bottomUiInfo = this.getLeftCenter(popRect, iconRect, popInfo);
        if (
          bottomUiInfo &&
          bottomUiInfo.pointType == constant.POINT_CENTER_CENTER
        ) {
          return bottomUiInfo; // 左边居中了
        }
        leftUiInfo = this.getLeftCenter(popRect, iconRect, popInfo);
        if (
          leftUiInfo &&
          leftUiInfo.pointType == constant.POINT_CENTER_CENTER
        ) {
          return leftUiInfo; // 左边居中了
        }
        // 判断icon是否居中
        if (topUiInfo && topUiInfo.pointType == constant.POINT_ARROW_CENTER) {
          return topUiInfo; // icon居中了
        }
        if (
          rightUiInfo &&
          rightUiInfo.pointType == constant.POINT_ARROW_CENTER
        ) {
          return rightUiInfo; // icon居中了
        }
        if (
          bottomUiInfo &&
          bottomUiInfo.pointType == constant.POINT_ARROW_CENTER
        ) {
          return bottomUiInfo; // icon居中了
        }
        if (leftUiInfo && leftUiInfo.pointType == constant.POINT_ARROW_CENTER) {
          return leftUiInfo; // icon居中了
        }
        // 判断icon是否偏移
        if (topUiInfo && topUiInfo.pointType == constant.POINT_ARROW_OFFSET) {
          return topUiInfo; // icon偏移
        }
        if (
          rightUiInfo &&
          rightUiInfo.pointType == constant.POINT_ARROW_OFFSET
        ) {
          return rightUiInfo; // icon偏移
        }
        if (
          bottomUiInfo &&
          bottomUiInfo.pointType == constant.POINT_ARROW_OFFSET
        ) {
          return bottomUiInfo; // icon偏移
        }
        if (leftUiInfo && leftUiInfo.pointType == constant.POINT_ARROW_OFFSET) {
          return leftUiInfo; // icon偏移
        }

        break;
    }

    return uiInfo;
  },

  getWinSize: function() {
    var winWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth; //浏览器视口宽度（不包括工具栏和滚动条）
    var winHeight =
      window.inneHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight; //浏览器视口高度（不包括工具栏和滚动条）
    var scrollLeft =
      window.pageXOffset ||
      document.documentElement.scrollLeft ||
      document.body.scrollLeft ||
      0;
    var scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    return {
      width: winWidth,
      height: winHeight,
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  },

  /**
   * 顶部居中
   */
  getTopCenter: function(popRect, iconRect, popInfo) {
    var winSize = this.getWinSize();
    var arrowDirection = "bottom";
    var arrowLeft, arrowTop;
    var pointType;

    // 居中判断
    var popTop =
      iconRect.top - popInfo.betweenSpace - popInfo.popArrowWH - popRect.height;
    if (popTop < popInfo.viewSpace) {
      return false;
    }
    var popLeft = iconRect.left + iconRect.width / 2 - popRect.width / 2;
    if (
      popLeft < popInfo.viewSpace ||
      popLeft + popRect.width + popInfo.viewSpace > winSize.width
    ) {
      if (popLeft < popInfo.viewSpace) {
        // 左边不够，让pop靠左，再看看右边
        popLeft = popInfo.viewSpace;
        if (popLeft + popRect.width + popInfo.viewSpace > winSize.width) {
          // 右边不够
          return false;
        }
      } else {
        // 右边不够，让期靠右，再看看左边
        popLeft = winSize.width - popInfo.viewSpace - popRect.width;
        if (popLeft < popInfo.viewSpace) {
          // 左边不够
          return false;
        }
      }
      pointType = constant.POINT_ARROW_CENTER;
    } else {
      // 可以居中
      pointType = constant.POINT_CENTER_CENTER;
    }

    // 计算箭头的位置
    arrowLeft =
      iconRect.left + iconRect.width / 2 - popLeft - popInfo.popArrowWH;
    if (
      arrowLeft < popInfo.popBorderRadius ||
      arrowLeft >
        popRect.width - popInfo.popBorderRadius - popInfo.popArrowWH * 2
    ) {
      // 箭头在圆角区域, 调整
      if (arrowLeft < popInfo.popBorderRadius) {
        arrowLeft = popInfo.popBorderRadius;
      } else {
        arrowLeft =
          popRect.width - popInfo.popBorderRadius - popInfo.popArrowWH * 2;
      }
      var arrowPointLeft = arrowLeft + popLeft + popInfo.popArrowWH;
      if (
        arrowPointLeft < iconRect.left ||
        arrowPointLeft > iconRect.left + iconRect.width
      ) {
        // 指向不了icon
        return false;
      }
      pointType = constant.POINT_ARROW_OFFSET;
    }
    arrowTop = popRect.height;

    return {
      popLeft: popLeft + winSize.scrollLeft,
      popTop: popTop + winSize.scrollTop,
      arrowDirection,
      arrowLeft,
      arrowTop,
      pointType
    };
  },

  /**
   * 右边居中
   */
  getRightCenter: function(popRect, iconRect, popInfo) {
    var winSize = this.getWinSize();
    var arrowDirection = "left";
    var arrowLeft, arrowTop;
    var pointType;

    // 居中判断
    var popTop = iconRect.top + iconRect.height / 2 - popRect.height / 2;
    if (
      popTop < popInfo.viewSpace ||
      popTop + popRect.height + popInfo.viewSpace > winSize.height
    ) {
      if (popTop < popInfo.viewSpace) {
        // 上边不够，让pop靠上，再看看下边
        popTop = popInfo.viewSpace;
        if (popTop + popRect.height + popInfo.viewSpace > winSize.height) {
          // 下边不够
          return false;
        }
      } else {
        // 右边不够，让期靠右，再看看左边
        popTop = winSize.height - popInfo.viewSpace - popRect.height;
        if (popTop < popInfo.viewSpace) {
          // 左边不够
          return false;
        }
      }
      pointType = constant.POINT_ARROW_CENTER;
    } else {
      // 可以居中
      pointType = constant.POINT_CENTER_CENTER;
    }
    var popLeft =
      iconRect.left +
      iconRect.width +
      popInfo.betweenSpace +
      popInfo.popArrowWH;
    if (popLeft + popRect.width + popInfo.viewSpace > winSize.width) {
      return false;
    }

    // 计算箭头的位置
    arrowTop = iconRect.top + iconRect.height / 2 - popTop - popInfo.popArrowWH;
    if (
      arrowTop < popInfo.popBorderRadius ||
      arrowTop >
        popRect.height - popInfo.popBorderRadius - popInfo.popArrowWH * 2
    ) {
      // 箭头在圆角区域, 调整
      if (arrowTop < popInfo.popBorderRadius) {
        arrowTop = popInfo.popBorderRadius;
      } else {
        arrowTop =
          popRect.height - popInfo.popBorderRadius - popInfo.popArrowWH * 2;
      }
      var arrowPointTop = arrowTop + popTop + popInfo.popArrowWH;
      if (
        arrowPointTop < iconRect.top ||
        arrowPointTop > iconRect.top + iconRect.height
      ) {
        // 指向不了icon
        return false;
      }
      pointType = constant.POINT_ARROW_OFFSET;
    }
    arrowLeft = -popInfo.popArrowWH;

    return {
      popLeft: popLeft + winSize.scrollLeft,
      popTop: popTop + winSize.scrollTop,
      arrowDirection,
      arrowLeft,
      arrowTop,
      pointType
    };
  },

  /**
   * 底部居中
   */
  getBottomCenter: function(popRect, iconRect, popInfo) {
    var winSize = this.getWinSize();
    var arrowDirection = "top";
    var arrowLeft, arrowTop;
    var pointType;

    // 居中判断
    var popTop =
      iconRect.top +
      iconRect.height +
      popInfo.betweenSpace +
      popInfo.popArrowWH;
    if (popTop + popInfo.viewSpace + popRect.height > winSize.height) {
      return false;
    }
    var popLeft = iconRect.left + iconRect.width / 2 - popRect.width / 2;
    if (
      popLeft < popInfo.viewSpace ||
      popLeft + popRect.width + popInfo.viewSpace > winSize.width
    ) {
      if (popLeft < popInfo.viewSpace) {
        // 左边不够，让pop靠左，再看看右边
        popLeft = popInfo.viewSpace;
        if (popLeft + popRect.width + popInfo.viewSpace > winSize.width) {
          // 右边不够
          return false;
        }
      } else {
        // 右边不够，让期靠右，再看看左边
        popLeft = winSize.width - popInfo.viewSpace - popRect.width;
        if (popLeft < popInfo.viewSpace) {
          // 左边不够
          return false;
        }
      }
      pointType = constant.POINT_ARROW_CENTER;
    } else {
      // 可以居中
      pointType = constant.POINT_CENTER_CENTER;
    }

    // 计算箭头的位置
    arrowLeft =
      iconRect.left + iconRect.width / 2 - popLeft - popInfo.popArrowWH;
    if (
      arrowLeft < popInfo.popBorderRadius ||
      arrowLeft >
        popRect.width - popInfo.popBorderRadius - popInfo.popArrowWH * 2
    ) {
      // 箭头在圆角区域, 调整
      if (arrowLeft < popInfo.popBorderRadius) {
        arrowLeft = popInfo.popBorderRadius;
      } else {
        arrowLeft =
          popRect.width - popInfo.popBorderRadius - popInfo.popArrowWH * 2;
      }
      var arrowPointLeft = arrowLeft + popLeft + popInfo.popArrowWH;
      if (
        arrowPointLeft < iconRect.left ||
        arrowPointLeft > iconRect.left + iconRect.width
      ) {
        // 指向不了icon
        return false;
      }
      pointType = constant.POINT_ARROW_OFFSET;
    }
    arrowTop = -popInfo.popArrowWH;

    return {
      popLeft: popLeft + winSize.scrollLeft,
      popTop: popTop + winSize.scrollTop,
      arrowDirection,
      arrowLeft,
      arrowTop,
      pointType
    };
  },

  /**
   * 底部居中
   */
  getLeftCenter: function(popRect, iconRect, popInfo) {
    var winSize = this.getWinSize();
    var arrowDirection = "right";
    var arrowLeft, arrowTop;
    var pointType;

    // 居中判断
    var popTop = iconRect.top + iconRect.height / 2 - popRect.height / 2;
    if (
      popTop < popInfo.viewSpace ||
      popTop + popRect.height + popInfo.viewSpace > winSize.height
    ) {
      if (popTop < popInfo.viewSpace) {
        // 上边不够，让pop靠上，再看看下边
        popTop = popInfo.viewSpace;
        if (popTop + popRect.height + popInfo.viewSpace > winSize.height) {
          // 下边不够
          return false;
        }
      } else {
        // 右边不够，让期靠右，再看看左边
        popTop = winSize.height - popInfo.viewSpace - popRect.height;
        if (popTop < popInfo.viewSpace) {
          // 左边不够
          return false;
        }
      }
      pointType = constant.POINT_ARROW_CENTER;
    } else {
      // 可以居中
      pointType = constant.POINT_CENTER_CENTER;
    }
    var popLeft =
      iconRect.left - popInfo.betweenSpace - popInfo.popArrowWH - popRect.width;
    if (popLeft < popInfo.viewSpace) {
      return false;
    }

    // 计算箭头的位置
    arrowTop = iconRect.top + iconRect.height / 2 - popTop - popInfo.popArrowWH;
    if (
      arrowTop < popInfo.popBorderRadius ||
      arrowTop >
        popRect.height - popInfo.popBorderRadius - popInfo.popArrowWH * 2
    ) {
      // 箭头在圆角区域, 调整
      if (arrowTop < popInfo.popBorderRadius) {
        arrowTop = popInfo.popBorderRadius;
      } else {
        arrowTop =
          popRect.height - popInfo.popBorderRadius - popInfo.popArrowWH * 2;
      }
      var arrowPointTop = arrowTop + popTop + popInfo.popArrowWH;
      if (
        arrowPointTop < iconRect.top ||
        arrowPointTop > iconRect.top + iconRect.height
      ) {
        // 指向不了icon
        return false;
      }
      pointType = constant.POINT_ARROW_OFFSET;
    }
    arrowLeft = popRect.width;

    return {
      popLeft: popLeft + winSize.scrollLeft,
      popTop: popTop + winSize.scrollTop,
      arrowDirection,
      arrowLeft,
      arrowTop,
      pointType
    };
  },

  getMaxZIndex() {
    // var childNodes = document.body.childNodes;
    var childNodes = document.all || document.querySelectorAll("*");
    var maxZIndex = 0;
    childNodes.forEach(node => {
      var tmpZIndex = this.getAttrValue(node, "z-index");
      maxZIndex = Math.max(maxZIndex, tmpZIndex);
    });
    return maxZIndex;
  },

  getAttrValue(element, attrName) {
    // console.log("element", element);
    var value = 0;
    if (element.nodeType == 1) {
      var valueStr = window
        .getComputedStyle(element)
        .getPropertyValue(attrName);
      // valueStr = "px";
      // console.log("element", valueStr);
      valueStr = valueStr + "";
      var reg = /^\d+$/i;
      var txtArr = valueStr.match(reg);
      if (txtArr && txtArr[0]) {
        value = Number(txtArr[0]);
      }
    }
    // console.log(valueStr, value);
    return value;
  }
};

export default popUtils;
