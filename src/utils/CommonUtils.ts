export default {
  isEleEditable,
  isNullOrEmpty,
  isNullObject,
  isBase64,
  isNumber,
  isJSON,
  isArray,
  mergeJSON,
  mergeJsonArray,
  clone,
  cloneValue,
  cloneValueForce,
  cloneValueIfUndefined,
  getViewport,
  getPageArea,
  getElementWindowLeft,
  getElementWindowTop,
  getTimeStringSec,
  deleteSpaceInStringArray,
  pad,
  genNonDuplicateID,
  getBetterDate,
}

/**
 * 判断指定对象是否为空或是只有 __ob__ 的对象
 * @param {*} object 指定对象
 * @returns {boolean} 对象是否为空
 */
function isNullObject(object) {
  return !object || Object.keys(object).length == 0
}
/**
 * 转数字为指定位数字符串
 * @param {number} num 数字
 * @param {number} n 位数，不足补 0
 * @return {string} 返回字符串
 */
function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}
/**
 * 克隆对象
 * @param {Object} obj 要克隆对象
 */
function clone(obj) {
  let temp = null;
  if (obj instanceof Array) {
    temp = obj.concat();
  } else if (obj instanceof Function) {
    //函数是共享的是无所谓的，js也没有什么办法可以在定义后再修改函数内容
    temp = obj;
  } else {
    temp = new Object();
    for (let item in obj) {
      let val = obj[item];
      temp[item] = typeof val == 'object' ? clone(val) : val; //这里也没有判断是否为函数，因为对于函数，我们将它和一般值一样处理
    }
  }
  return temp;
}
/**
 * 将源对象每个属性都复制到目标对象
 * @param {*} setObj 
 * @param {*} sourceObj 
 */
function cloneValue(setObj, sourceObj) {
  if (!setObj || !sourceObj) return;
  Object.keys(setObj).forEach(function (key) {
    if (typeof sourceObj[key] != 'undefined') {
      if (isJSON(setObj[key])) cloneValue(setObj[key], sourceObj[key]);
      else setObj[key] = sourceObj[key];
    }
  });
}
/**
 * 强制将源对象每个属性都复制到目标对象，不管属性是否存在
 * @param {*} setObj 
 * @param {*} sourceObj 
 */
function cloneValueForce(setObj, sourceObj) {
  if (!setObj || !sourceObj) return;
  Object.keys(sourceObj).forEach(function (key) {
    if (isJSON(setObj[key])) cloneValueForce(setObj[key], sourceObj[key]);
    else setObj[key] = sourceObj[key];
  });
}
/**
 * 目标对象不存在的属性从源对象复制
 * @param {*} setObj 
 * @param {*} sourceObj 
 */
function cloneValueIfUndefined(setObj, sourceObj) {
  if (!setObj || !sourceObj) return;
  Object.keys(sourceObj).forEach(function (key) {
    if(typeof setObj[key] == 'undefined')
      setObj[key] = sourceObj[key];
  });
}

function mergeJSON(minor, main) {
  for (var key in minor) {
    if (main[key] === undefined) { // 不冲突的，直接赋值 
      main[key] = minor[key];
      continue;
    }
    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以（minor）为准为主，
    if (isJSON(minor[key]) || isArray(minor[key])) { // arguments.callee 递归调用，并且与函数名解耦 
      main[key] = mergeJSON(minor[key], main[key]);
    } else {
      main[key] = minor[key];
    }
  }
  return main;
}
function isJSON(target) {
  if (!target) return false;
  return target && typeof target == "object" && target.constructor && target.constructor == Object;
}
function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
/**
 * 混合两个 JsonArray
 * @param {*} a 
 * @param {*} b 
 */
function mergeJsonArray(a, b) {
  var r = {};
  var i = 0;
  for (var key in a) {
    r[i] = a[key];
    i++;
  }
  for (var key in b) {
    r[i] = b[key];
    i++;
  }
  return r;
}
function getElementWindowLeft(element) {
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft);
    current = current.offsetParent;
  }
  return actualLeft;
}
function getElementWindowTop(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += (current.offsetTop + current.clientTop);
    current = current.offsetParent;
  }
  return actualTop;
}
/**
 * 去除字符串数组的空值
 * @param {Array<String>} array 字符串数组
 * @return {Array<String>} 返回新的字符串数组
 */
function deleteSpaceInStringArray(array) {
  var newArray = [], i = 0;
  for(;i<array.length;i++){
    if(array[i] != '')
      newArray.push(array[i]);
  }
  return newArray;
}

/**
 * 获取网页大小
 * @returns {{width: number, height: number}} 返回网页大小
 */
function getViewport() {
  if (document.compatMode == "BackCompat") {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  }
}
/**
 * 取 scrollHeight 和 clientHeight 的最大值
 * @returns {{width: number, height: number}} 返回网页大小
 */
function getPageArea() {
  if (document.compatMode == "BackCompat") {
    return {
      width: Math.max(document.body.scrollWidth,
        document.body.clientWidth),
      height: Math.max(document.body.scrollHeight,
        document.body.clientHeight)
    }
  } else {
    return {
      width: Math.max(document.documentElement.scrollWidth,
        document.documentElement.clientWidth),
      height: Math.max(document.documentElement.scrollHeight,
        document.documentElement.clientHeight)
    }
  }
}
/**
 * 将秒转换为 分:秒
 * s int 秒数
*/
function getTimeStringSec(s : number){
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  var h = Math.floor(s / 60)
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = Math.floor(s % 60);
  //将变量转换为字符串
  var hs = h.toString();
  var ss = s.toString();
  //如果只有一位数，前面增加一个0
  hs = (hs.length==1) ? '0' + hs : hs;
  ss = (ss.length==1) ? '0' + ss : ss;
  return hs + ':' + ss;
}


/**
 * 判断点击区域可编辑
 * @param {*} e 
 */
function isEleEditable(e) {
  if (!e) {
    return false;
  }
  if (e.tagName == 'INPUT' || e.contentEditable == 'true') {
    return true;
  } else {
    //递归查询父节点
    return isEleEditable(e.parentNode)
  }
}

/**
 * 判断一个字符串是否为空
 * @param {*} str 要判断的字符串
 */
function isNullOrEmpty(str) {
  if (typeof str == 'undefined') return true;
  if (str == null || str == '') return true;
  return false;
}
/**
* 判断字符串是否是 Base64 编码
* @param {String} str 
*/
function isBase64(str) {
  return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(str);
}
/**
 * 检测字符串是否是一串数字
 * @param {String} val 
 */
function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 生成不重复 UID
 * @param randomLen 随机数位数
 */
function genNonDuplicateID(randomLen) {
  return Number(Math.random().toString().substr(3,randomLen) + Date.now()).toString(36)
}

function getBetterDate(date : Date) {
  var str = '';
  var now = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if(year != now.getFullYear()) str += year + '年';
  if(year != now.getFullYear() || month != now.getMonth() + 1) str += year + '月';
  if(date.getDate() == now.getDate()) str += '今天';
  else str += date.getDate() + '日';
  str += ' ' + date.format('HH:mm') ;
  return str
}