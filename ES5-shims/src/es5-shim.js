;
// 使用,避免连续代码


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
    var defineProperties　＝　(function() {
        var defineProperty;

        // 如果支持defineProperty
        defineProperty = isSupportDescriptors ? function(obj, key, value){
            if(key in obj) return;
            Object.defineProperty(obj, key, {
                key: value,
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




    
    // important!! 由于这里只是模仿，所以就不将方法挂在原生对象的原型上了，直接挂在我们的自定义对象上，这样方便测试

    /**********************************/
    /*           Array                */
    /**********************************/

    ES5.Array = {};

    defineProperties(ES5.Array, {

        isArray: function(obj) {
            return to_string(obj) === '[object Array]';
        },

        indexOf: function (arr, value) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if(value === arr[i]) return i;
            }
        },

        lastIndexOf: function(arr, value) {
            for (var i = arr.length - 1; i >= 0; i--) {
                if(value === arr[i]) return i;
            }
        }, 

        every: function() {

        },

        some: function() {

        },

        forEach: function() {

        },

        map: function() {

        },

        filter: function() {

        },

        reduce: function() {

        },

        reduceRight: function() {
            
        }
    })


    /**********************************/
    /*           Function             */
    /**********************************/
    ES5.Function = {};

    defineProperties(ES5.Function, {
        bind: function() {

        }
    })





    /**********************************/
    /*           Object               */
    /**********************************/
    ES5.Object = {};

    defineProperties(ES5.Object, {

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
    defineProperties(ES5.String, {

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