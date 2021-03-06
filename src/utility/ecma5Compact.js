/**
 * @author xuld
 * @fileOverview 为低版本浏览器提供 ECMA5 的部分常用函数。
 */

// IE6-8, FF2-4: 不支持 Function.prototype.bind
if (!Function.prototype.bind) {

    /**
     * 绑定函数作用域(**this**)。并返回一个新函数，这个函数内的 **this** 为指定的 *scope* 。
     * @param {Object} scope 要绑定的作用域的值。
     * @example
     * <pre>
     * var fn = function(){ trace(this);  };
     *
     * var fnProxy = fn.bind(0);
     *
     * fnProxy()  ; //  输出 0
     * </pre>
     */
    Function.prototype.bind = function (scope) {
        var me = this;
        return function () {
            return me.apply(scope, arguments);
        }
    };

}

// IE6-8, FF2-4: 不支持 Array.isArray
if (!Array.isArray) {

    /**
     * 判断一个变量是否是数组。
     * @param {Object} obj 要判断的变量。
     * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
     * @example
     * <pre>
     * Array.isArray([]); // true
     * Array.isArray(document.getElementsByTagName("div")); // false
     * Array.isArray(new Array); // true
     * </pre>
     */
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

}

// IE6-8: 不支持 Array.prototype.forEach
if (!Array.prototype.forEach) {

    /**
     * 遍历当前数组，并对数组的每个元素执行函数 *fn*。
     * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
     *
     * - {Object} value 当前元素的值。
     * - {Number} index 当前元素的索引。
     * - {Array} array 当前正在遍历的数组。
     *
     * 可以让函数返回 **false** 来强制中止循环。
     * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
     * @see #each
     * @see Object.each
     * @see #filter
     * @see Object.map
     * @remark
     * 在高版本浏览器中，forEach 和 each 功能大致相同，但是 forEach 不支持通过 return false 中止循环。
     * 在低版本(IE8-)浏览器中， forEach 为 each 的别名。
     *
     * 目前除了 IE8-，主流浏览器都已内置此函数。
     * @example 以下示例演示了如何遍历数组，并输出每个元素的值。
     * <pre>
     * [2, 5].forEach(function (value, key) {
     * 		trace(value);
     * });
     * // 输出 '2' '5'
     * </pre>
     */
    Array.prototype.forEach = function (fn, scope) {
        return Object.each(this, fn, scope);
    };

    Array.prototype.filter = function (fn, scope) {
        var results = [];
        for (var value, i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                value = this[i];
                if (fn.call(scope, value, i, this)) {
                    results.push(value);
                }
            }
        }
        return results;
    };

}

if (!String.prototype.trim) {

    /**
     * 去除字符串的首尾空格。
     * @return {String} 处理后的字符串。
     * @remark 目前除了 IE8-，主流浏览器都已内置此函数。
     * @example
     * <pre>
     * "   g h   ".trim(); //  返回     "g h"
     * </pre>
     */
    String.prototype.trim = function () {
        return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
    };

}

// IE6-8: 不支持 Array.prototype.indexOf
if (!Array.prototype.indexOf) {

    /**
     * 返回当前数组中某个值的第一个位置。
     * @param {Object} item 成员。
     * @param {Number} startIndex=0 开始查找的位置。
     * @return {Number} 返回 *vaue* 的索引，如果不存在指定的值， 则返回-1 。
     */
    Array.prototype.indexOf = function (value, startIndex) {
        startIndex = startIndex || 0;
        for (var len = this.length; startIndex < len; startIndex++)
            if (this[startIndex] === value)
                return startIndex;
        return -1;
    };

}

// IE6-9: 不支持 Date.now
if (!Date.now) {

    /**
     * 获取当前时间的数字表示。
     * @return {Number} 当前的时间点。
     * @static
     * @example
     * <pre>
     * Date.now(); //   相当于 new Date().getTime()
     * </pre>
     */
    Date.now = function () {
        return +new Date;
    };

}

// IE6: for in 不会遍历原生函数，所以手动拷贝这些元素函数。
(function () {
    for (var item in { toString: 1 }) {
        return;
    }

    Object._enumerables = "toString hasOwnProperty valueOf constructor isPrototypeOf".split(' ');
    Object.assign = function (target, source) {
        if (source) {
            //#assert dest != null
            for (var i = Object._enumerables.length, value; i--;)
                if (Object.prototype.hasOwnProperty.call(source, value = Object._enumerables[i]))
                    target[value] = source[value];
            for (var key in source) {
                target[value] = source[value];
            }
        }

        return target;
    };

})();

// IE6-8, FF2-4: 不支持 JSON
var JSON = JSON || {};
if (!JSON.stringify) {

    JSON.specialChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };

    JSON.replaceChars = function (chr) {
        return JSON.specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
    };

    JSON.stringify = function (obj) {
        switch (typeof obj) {
            case 'string':
                return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.replaceChars) + '"';
            case 'object':
                if (obj) {
                    var s = [];
                    if (obj instanceof Array) {
                        for (var i = 0; i < obj.length; i++) {
                            s[i] = JSON.stringify(obj[i]);
                        }
                        return '[' + s + ']';
                    }

                    for (var key in obj) {
                        s.push(JSON.stringify(key) + ':' + JSON.stringify(obj[key]));
                    }
                    return '{' + s + '}';
                }
                // 直接转到 default
            default:
                return String(obj);
        }
    };

    JSON.parse = function (str) {
        return new Function('return ' + str)();
    };

}
