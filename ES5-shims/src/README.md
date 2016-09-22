
## Code Review

### compare with ES5-shim.js (see https://github.com/es-shims/es5-shim)

#### Util

1. !== 比!(value === value)更好


#### Array

1. fix (version < IE8) 下bug: **[].unshift(0) !== 1**;
2. var self = Object(o); ???
3. array.length >>> 0 ???  ToUint32
4. forEach:　

    - 用while代替for循环，将i的自增语句用前置自增语句，写入循环判断语句。
    - 加入i in arr的判断语句，保证arr[i]存在于arr中。

```js
var i = -1;
while (++i < length) {
    if (i in self) {
        if (typeof T === 'undefined') {
            callbackfn(self[i], i, object);
        } else {
            callbackfn.call(T, self[i], i, object);
        }
    }
}
<!-- VS -->
for (var i = 0, len = arr.length; i < len; i++) {
    var cb = fn.call(context, arr[i], i, arr);
}
```

5. 能直接连写，用链式的直接连写，减少中间变量的使用，优化内存占用。

```js
for (var i = 0; i < length; i++) {
    if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
        return false;
    }
}
<!-- VS -->
for (var i = 0, len = arr.length; i < len; i++) {
    var cb = fn.call(context, arr[i], i, arr);
    if(!cb) return false;
}
===========> if(!(fn.call(context, arr[i], i, arr))) return false;
```

6. es5-shim解决了很多各种浏览器的各种unshift, splice, join, push, slice, sort 等Bug.


#### Function

1. **封装常用的参数检测**，避免每次进行方法封装的时候都要去检测参数。
2. **将原生能力检测作为参数传入**，避免每次重写方法时用If判断，更优雅。
3. 简写常用的原生方法。
4. 所有局部参数全部定义在函数顶部，清晰美观。
5. 函数式编程。


#### Object

1. 在对参数的判断上更加严格，**封装常用的参数检测**，使用isArguments和isCallable判断参数是否是可以使用的.

```javascript
<!-- 判断是否是参数对象 -->
function isArguments(value) {
    return toStr(value) === '[object Arguments]';
};

var isCallable = function isCallable(value) {
    if (!value) {
        return false;
    }
    if (typeof value !== 'function' && typeof value !== 'object') {
        return false;
    }
    if (hasToStringTag) {
        return tryFunctionObject(value);
    }
    if (isES6ClassFn(value)) {
        return false;
    }
    var strClass = to_string.call(value);
    return strClass === fnClass || strClass === genClass;
}

```

2. 很多的低级浏览器bug检测和修复。


#### Date

1. 常用字典的封装，方便使用

```js
var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```

2. 判断更加严格，准确

```js
if(typeof this !== 'Object') throw new TypeError();
<!-- VS -->
if(!this || !(this instanceOf Date)) throw new TypeError();
```