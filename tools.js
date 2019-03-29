
// 区分参数的类型
function type(target) {
    var ret = typeof (target);
    var template = {
        "[object Array]": "array",
        "[object Object]": "object",
        "[object Number]": "number",
        "[object Boolean]": "boolean - object",
        "[object String]": "string - object"
    }
    if (target === null) {
        return "null";
    }
    if (ret == "object") {
        var str = Object.prototype.toString.call(target);
        return template[str];
    }
    else {
        return ret;
    }
}


// 深度克隆


// 数组去重 ------>  写进去数组原型里面 
Array.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = 'abc';
            arr.push(this[i]);
        }
    }
    return arr;
}


// 字符串去重
function strUnique(str) {
    var temp = {},
        str1 = "";
    for (var i = 0; i < str.length; i++) {
        if (!temp[str[i]]) {
            temp[str[i]] = 'abc';
            str1 += str[i];
        }
    }
    return str1;
}


// 可视化窗口尺寸
function getViewportOffset() {
    if (window.innerWidth) {
        return {
            W: window.innerWidth,
            H: window.innerHeighr
        }
    } else {
        if (document.compatMode === "BackCompat") {
            return {
                W: document.body.clientWidth,
                H: document.body.clientheight
            }
        } else {
            return {
                W: document.documentElement.clientWidth,
                H: document.documentElement.clientHeight
            }
        }
    }
}


// 获取DOM元素的属性
function getStyle(elem, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null)[prop]; // 获取的元素属性是变量所以必须用中括号
    } else {
        return elem.currentStyle[prop];  // 获取的元素属性是变量所以必须用中括号
    }
}


// 绑定事件
function addEvent(elem, type, handle) {
    if (elem.addEventListenner) {        // 常用方式--->一种事件可绑定多个函数，但是同一个处理函数只能绑定一次
        elem.addEventListenner(type, handle, false);
    } else if (elem, attachEvent) {        // IE独有方式--->一种事件可绑定多个函数，即使同一个处理函数也可绑定多次
        ele['temp' + type + handle] = handle;
        ele[type + handle] = function () {
            ele['temp' + type + handle].call(ele);
        };
        elem.attachEvent('on' + type, ele[type + handle]);
    } else {
        elem['on' + type] = handle;        // 句柄方式绑定--->一种事件只能绑定一个函数
    }
}


// 解除事件
function removeEvent(ele, type, handle) {
    if (ele.removeEventListener) {  // 最常用的
        ele.removeEventListener(type, handle.false);
    } else if (ele.detachEvent) {    // IE浏览器独有的
        ele.detachEvent('on' + type + handle);
    } else {
        ele['on' + type] = null;   // 句柄方式解除，相当于写在了行间样式里面
    }
}


// 冒泡：在结构上（非视觉上）嵌套关系的元素，会存在事件冒泡的功能;
// 即同一事件，子元素冒泡向父元素，结构上的自底向上。（这里的底是结构上的底，视觉上是自顶向下）
// 大部分事件都有事件冒泡现象，并且所有的浏览器都有事件冒泡。
// 结构上的冒泡，和视觉的位置没有关系， 

// 捕获：结构上（非视觉上）嵌套关系的元素，会存在事件捕获功能;
// 即同一事件，自父元素捕获至子元素（事件源元素），结构上的自顶向下。
// addEventListener 最后一个参数就是是否开始事件捕获，当我们填true的时候，就代表开启了事件捕获。只要开启了事件捕获，就不会冒泡了，如果不捕获的话，就遵循事件冒泡。
// 因为addEventListener只有chrome有，因此事件捕获也只有chrome浏览器有。

// 冒泡和捕获的触发顺序是先执行捕获，再冒泡


// 解除冒泡
function stopBubble(event) {
    if (event.stopPropagation) {
        event.stopPropagation();      // w3c 的标准取消冒泡方法
    } else {
        event.cancelBubble = true;    // 支持IE9以下的版本，有一些高版本的浏览器也有这个属性
    }
}


// 阻止默认
function cancelHandler(event) {
    if (event.preventDefault) {       // w3c 的标准，IE9以下不兼容
        event.preventDefault();
    } else {
        event.returnValue = false;   // 兼容IE
    }
}


// 多物体多值链式运动框架
// 第一个参数是需要改变的对象，第二个参数是对象将被改变的目标状态
function startMove(obj, json, callback) {
    clearInterval(obj, timer);
    var iSpeed, iCur;
    obj.timer = setInterval(function () {
        var bStop = true;
        for (var attr in json) {
            if (attr == 'opacity') {
                iCur = parseFloat(getSytle(obj, attr)) * 100;
            } else {
                iCur = parseInt(getStyle(obj, attr));
            }
            iSpeed = (json[attr] - iCur) / 7;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (attr == 'opacity') {
                obj.style.opacity = (iCur + iSpeed) / 100;
            } else {
                obj.style[attr] = iCur + iSpeed + 'px';
            }
            if (iCur != json[attr]) {
                bStop = false;
            }
        }
        if (bStop) {
            clearInterval(obj.timer);
            typeof callback == 'function' ? callback() : "";
        }
    }, 30);
}


// 碰撞反弹运动
function startMoveP(obj) {
    clearInterval(obj.timer);
    var iSpeedX = 6,
        iSpeedY = 8;
    obj.timer = setInterval(function() {
        var newLeft = obj.offsetLeft + iSpeedX;
        var newTop = obj.offsetTop + iSpeedY;
        if(newLeft >= document.documentElement.clientWidth - obj.offsetWidth) {
            iSpeedX *= -1;
            newLeft = document.documentElement.clientWidth - obj.offsetWidth;
        }
        if(newLeft < 0) {
            iSpeedX *= -1;
            newLeft = 0;
        }
        if(newTop >= document.documentElement.clientHeight - obj.offsetHeight){
            iSpeedY *= -1;
            newTop = document.documentElement.clientHeight - obj.offsetHeight;
        }
        if(newTop < 0) {
            iSpeedY *= -1;
            newTop = 0;
        }
        obj.style.left = newLeft + 'px';
        obj.style.top = newTop + 'px';
    }, 30)
}