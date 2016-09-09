;
// 使用;避免连续代码


// UMD通用模块加载方式
(function(global, factory) {
    'use strict';
    if (typeof module !== 'undefined' && typeof module.exports === 'function') module.exports = factory();
    else if (typeof define !== 'undefined' && (define.amd || define.cmd)) define(factory);
    else global.ES5 = factory({});

})(this, function(ES5) {

    // 常用方法简写
    var ArrayPrototype = Array.prototype;
    var ObjectPrototype = Object.prototype;
    var FunctionPrototype = Function.prototype;
    var StringPrototype = String.prototype;
    var NumberPrototype = Number.prototype;

    var array_slice = ArrayPrototype.slice;
    var array_splice = ArrayPrototype.splice;
    var array_push = ArrayPrototype.push;
    var array_unshift = ArrayPrototype.unshift;
    var array_concat = ArrayPrototype.concat;
    var array_join = ArrayPrototype.join;

    var call = FunctionPrototype.call;
    var apply = FunctionPrototype.apply;

    var to_string = ObjectPrototype.toString; 

    var max = Math.max;
    var min = Math.min;


    /**********************************/
    /*           Global               */
    /**********************************/

    // 检测是否支持对象描述符
    var isSupportDescriptors = Object.defineProperty && (function() {
        try {
            var obj = {};
            Object.defineProperty(obj, 'o', {
                enumerable: false, // 不可枚举的
                value: obj
            })

            for (var key in obj) {
                return false; // 如果进入循环，说明描述符不起作用，则是ES3
            }
            return obj.o === obj;
        } catch (e) {
            return false;
        }
    })();

    // 定义defineProperties方法，用此方法进行原型扩展
    var defineProperties = (function() {
        // 如果支持defineProperty
        var defineProperty = isSupportDescriptors ? function(obj, key, value){
            if(key in obj) return;
            Object.defineProperty(obj, key, {
                value: value,
                configurable: true,
                enumerable: false,
                writable: true,
            })
        // else
        } : function(obj, key, value) {
            if(key in obj) return;
            obj[key] = value;
        }
        
        return function(obj, map) {
            for(var key in map) {
                if(Object.hasOwnProperty.call(map, key)) defineProperty(obj, key, map[key]);
            }
        }

    })();



    /**********************************/
    /*           Util                 */
    /**********************************/




    
    /**********************************/
    /*           Array                */
    /**********************************/

    ES5.Array = {};
    defineProperties(ES5.Array, {

        isArray: function(obj) {
            return to_string.call(object) === '[object Array]';
        },

        indexOf: function (arr, value, fromIndex) {
            // 用+号将字符串转为数字
            var i = +fromIndex || 0,
                len = arr.length;
            if(i > arr.length - 1) throw new TypeError('fromIndex must less than arr.length');
            if(!arr || arr.length === 0) return -1;

            // 用while循环代替部分for循环,提升代码可读性
            while(i < len) {
                if(value === arr[i]) return i;
                i++;
            }
        },

        lastIndexOf: function(arr, value) {
            for (var i = arr.length - 1; i >= 0; i--) {
                if(value === arr[i]) return i;
            }
        }, 

        every: function(arr, fn/*, context*/) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof fn !== 'function') throw new TypeError();

            var context = arguments.length >= 3 ? arguments[2] : void 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                var cb = fn.call(context, arr[i], i, arr);
                // 利用!让所有不为真的返回值全部返回false
                if(!cb) return false;
            }
            return ture;
        },

        some: function(arr, fn/*, context*/) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof fn !== 'function') throw new TypeError();

            var context = arguments.length >= 3 ? arguments[2] : void 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                var cb = fn.call(context, arr[i], i, arr);
                // 只要能被转为ture的返回值，都返回ture;
                if(cb) return ture;
            }
            return false;
        },

        forEach: function(arr, fn/*, context*/) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof fn !== 'function') throw new TypeError();

            var context = arguments.length >= 3 ? arguments[2] : void 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                var cb = fn.call(context, arr[i], i, arr);
            }
        },

        map: function(arr, fn/*, context*/ ) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof fn !== 'function') throw new TypeError(fn.name + 'is not a function');


            var arr = new Array(arr.length);
            var context = arguments.length >= 3 ? arguments[2] : void 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                var cb = fn.call(context, arr[i], i, arr);
                arr[i] = cb;
            }
            return arr;
        },
        filter: function(arr, fn/*, context*/) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof fn !== 'function') throw new TypeError();

            var arr = [];
            var context = arguments.length >= 3 ? arguments[2] : void 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                var cb = fn.call(context, arr[i], i, arr);
                if(cb) arr.push(arr[i]);
            }
            return arrrr;
        },
        reduce: function(arr, fn ,initialValue) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof fn !== 'function') throw new TypeError();

            
            var previousValue;
            var initialSet = initialValue ? true : false;

            previousValue = initialValue;
            for (var i = 0, len = arr.length; i < len; i++) {
                if(initialSet) {
                    previousValue = fn.call(undefined, previousValue, arr[i], i, arr);
                }else {
                    previousValue = arr[0];
                    initialSet = true;  
                }
            }

            if (!initialSet) throw new TypeError('Reduce of empty array with no initial value');
            return previousValue;
        },
        /**
         * * * * * * * * * * * * * * * * * * * * *
         * ES6-Array-shim
         * * * * * * * * * * * * * * * * * * * * * 
         */

        /**
         * Array.from() 方法可以将一个类数组对象或可遍历对象转换成真正的数组。
         * @param  {[type]} arrlike [description]
         * @return {[type]}         [description]
         */
        // 不能直接传入参数，因为要保证from函数的length为1.
        from: function(arrlike/*[, mapFn[, thisArg]]*/) {
            if (arrlike === void 0 || arrlike === null) throw new TypeError();
            // 不直接判断参数主要为了避免传入的undefined等值时，无法判断是否传了参数
            var mapFn = arguments.length > 1 ? arguments[1] : void 0;
            if (typeof mapFn !== 'function') throw new TypeError();

            var thisArg = arguments.length > 2 ? arguments[2] : void 0;

            var newArr = array_slice.call(arrlike);
            return mapFn ? newArr : this.map(newArr, mapFn, thisArg);
        },
        
        of: function() {
            return array_slice.call(arguments);
        },

        /**
         * 浅拷贝数组的部分元素到同一数组的不同位置，且不改变数组的大小，返回该数组。
         * @param  {[type]} arr    [description]
         * @param  {[type]} target [description]
         * @param  {[type]} start  [description]
         * @param  {[type]} end    [description]
         * @return {[type]}        [description]
         */
        copyWithin: function(arr, target, start/*, end*/) {
            if (arr === void 0 || arr === null) throw new TypeError();
            var len = arr.length;

            if (typeof target !== 'number') throw new TypeError();
            // 不直接判断参数主要为了避免传入的undefined等值时，无法判断是否传了参数
            var end = arguments.length > 3 ? arguments[3] : void 0;
            if (typeof start !== 'undefined' && typeof start !== 'number') throw new TypeError();
            if (typeof end !== 'undefined' && typeof end !== 'number') throw new TypeError();

            if(target > len) return;
            var to = target < 0 ? Math.max(target + len, 0) : Math.min(target, len);

            !start && (start = 0);
            // start小于0时，不能超过数组第一位；start大于0时，不能超过数组长度
            var from = start < 0 ? Math.max(start + len, 0) : Math.min(start, len);
            
            !end && (end = arr.length -1);
            // end小于0时，不能超过数组第一位；end大于0时，不能超过数组长度
            var final = end < 0 ? Math.max(end + len, 0) : Math.min(end, len);

            /**
             * start => 三个参数可能性太多，it's confusing me a lot.
             */

            /************************************************/
            // !!!  计算复制的总位数
            var count = Math.min(final - from, len - to);

            var direction = 1;

            // 
            if(from < count && to < (from + count)) {
                direction = -1;
                from += count - 1;
                to += count - 1;
            }
            /***********************************************/

            // 开始复制
            var O = Object(arr);
            while (count > 0) {
                if (from in O) {
                    O[to] = O[from];
                } else {
                    delete O[to];
                }
                from += direction;
                to += direction;
                count--;
            }

            return O;
        },

        /**
         * 如果数组中某个元素满足测试条件，返回那个元素的值
         * @param  {[type]} arr  [description]
         * @param  {[type]} cbFn [description]
         * @return {[type]}      [description]
         */
        find: function(arr, cbFn/*, thisArg*/) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof cbFn !== 'function') throw new TypeError();

            var thisArg = arguments.length > 2 ? arguments[2] : void 0;

            var list = Object(arr),
                len = arr.length >>> 0,
                k = 0;

            while(k < len) {
                if(cbFn.call(thisArg, list[k], k, list)) return list[k];
                K++;
            }
            return undefined;
        },

        /**
         * 如果数组中某个元素满足测试条件，返回那个元素的索引
         * @param  {[type]} arr  [description]
         * @param  {[type]} cbFn [description]
         * @return {[type]}      [description]
         */
        findIndex: function(arr, cbFn/*, thisArg*/) {
            // 用void 0代替arr
            if (arr === void 0 || arr === null) throw new TypeError();
            if (typeof cbFn !== 'function') throw new TypeError();

            var thisArg = arguments.length > 2 ? arguments[2] : void 0;

            var list = Object(arr),
                len = arr.length >>> 0,
                k = 0;

            while(k < len) {
                if(cbFn.call(thisArg, list[k], k, list)) return k;
                K++;
            }
            return undefined;
        },

        /**
         * fill方法使用给定值，填充一个数组。
         * @param  {[type]} value [description]
         * @param  {[type]} start [description]
         * @param  {[type]} end   [description]
         * @return {[type]}       [description]
         */
        fill: function(arr, value/* ,start, end*/) {
            if (arr === void 0 || arr === null) throw new TypeError();
            var start = arguments.length > 2 ? arguments[2] : void 0;
            var end = arguments.length > 3 ? arguments[3] : void 0;

            var list = Object(arr),
                len = arr.length >>> 0,
                k = 0;

            !start && (start = 0);
            !end && (end = len);
            var from = start < 0 ? Math.max(start + len, 0) : Math.min(start, len);
            var final = end < 0 ? Math.max(end + len, 0) : Math.min(end, len);

            while(start < end) {
                list[start] = value;
                start++;
            }

            return list;


        }
    })


    /**********************************/
    /*           Function             */
    /**********************************/
    ES5.Function = {};

    defineProperties(FunctionPrototype, {
        bind: function() {

        }
    })





    /**********************************/
    /*           Object               */
    /**********************************/

    defineProperties(ObjectPrototype, {

        getPrototypeOf: function() {

        },

        getOwnPropertyDescriptor: function () {

        },

        getOwnPropertyNames: function() {

        }, 

        // !important
        create: function() {

        },

        defineProperty: function() {

        },

        // !important
        defineProperties: function() {

        },

        seal: function() {

        },

        freeze: function() {

        },

        isSealed: function() {

        },

        isFrozen: function() {
            
        },


        // !important
        keys: function() {
            
        },

        isExtensible: function() {
            
        }
    })


    /**********************************/
    /*           Date                 */
    /**********************************/



    /**********************************/
    /*           Number               */
    /**********************************/



    /**********************************/
    /*           String               */
    /**********************************/

    ES5.String = {};
    defineProperties(StringPrototype, {

        trim: function() {

        }
    })




    /**********************************/
    /*           JSON               */
    /**********************************/
    ES5.JSON = {};
    defineProperties(ES5.JSON, {
        parse: function() {

        },

        stringify: function() {

        }
    })

    return ES5;
});