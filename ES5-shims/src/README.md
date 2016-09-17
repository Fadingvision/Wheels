
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
5. es5-shim解决了很多各种浏览器的各种unshift, splice, join, push, slice, sort 等Bug.


#### Function

1. **封装常用的参数检测**，避免每次进行方法封装的时候都要去检测参数。
2. **将原生能力检测作为参数传入**，避免每次重写方法时用If判断，更优雅。
3. 简写常用的原生方法。
4. 所有局部参数全部定义在函数顶部，清晰美观。
5. 函数式编程。
