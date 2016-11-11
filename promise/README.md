## about Promise

test: 'npm run test_promise';

#### Issues
1. 解决的问题，实现的原理
2. 不同promise的实现之间的交互（resolvePromise函数的实现和用法）--- 不太明白
3. 原则上，promise.then(onResolved, onRejected)里的这两相函数需要异步调用,让then的参数异步执行
    （setTimeout(fn, 0)的含义和用法） --- 不太明白
4. promise标准的测试，eslint的语法错误修复
5. promise链的错误处理
6. promise.race, .all, 等其他相关方法的实现（基于then方法）
7. 和其他牛逼的实现（q, bluebird, $q, $.defer）的对比和学习
8. promise 的反模式
----------------


#### 一、解决的问题，实现的原理

假设你正在编写一个函数，但是你不能马上返回值，最明显的方法就是将返回的值传入一个回调函数作为参数，而不是将其return回来。

```javascript
var oneOneSecondLater = function (callback) {
    setTimeout(function () {
        callback(1);
    }, 1000);
};
```
这是一个很简单的解决方案，但是存在很多问题。

一个更普通的办法是传入一个回调函数以及一个错误处理函数来对返回的值以及可能出现的错误进行处理。
```js
var maybeOneOneSecondLater = function (callback, errback) {
    setTimeout(function () {
        if (Math.random() < .5) {
            callback(1);
        } else {
            errback(new Error("Can't provide one."));
        }
    }, 1000);
};
```

然而,这些方法实际模型抛出异常。异常和try / catch块的目的是推迟显式处理的异常,直到程序返回一个值，试图恢复是有意义的。需要有一些隐式传播异常的机制来出传播没有被处理的异常，这就是Pormise.


```javascript
var maybeOneOneSecondLater = function () {
    var callback;
    setTimeout(function () {
        callback(1);
    }, 1000);
    return {
        then: function (_callback) {
            callback = _callback;
        }
    };
};

maybeOneOneSecondLater().then(callback);
```
我们模拟一个有then方法的对象来模拟promise,目的是为了推迟回调函数的注册，但是这里存在两个问题：

1、 只能最后有一个callback去接受返回的value, 如果有更多的callback可以去接受这个值，那么这个对象将会更有用。
2、如果这个回调函数的注册时间超过了1秒，那么这个Promise将是失败的，因为callback将不会执行。

一个更普遍的解决办法会接受任何数量的回调并允许他们注册之前或之后超时,或者一般来说,解决事件。我们可以通过将Promise变成一个拥有两个状态的对象来实现这一点。

```js
var maybeOneOneSecondLater = function () {
    var pending = [], value;
    setTimeout(function () {
        value = 1;
        for (var i = 0, ii = pending.length; i < ii; i++) {
            var callback = pending[i];
            callback(value);
        }
        pending = undefined;
    }, 1000);
    return {
        then: function (callback) {
            if (pending) {
                pending.push(callback);
            } else {
                callback(value);
            }
        }
    };
};

```
将上面的函数稍作改变，把promise的逻辑和真正的异步处理函数的逻辑分开，从而逻辑可以划分的更清晰，同时defer对象也可以进行复用，得到下面的一个通用的defer对象，可以用then来添加回调函数，用resolve方法来将保存的回调函数执行，并传入相应的我们需要回调函数接受的参数value值。

```js
var defer = function () {
    var pending = [], value;
    return {
        resolve: function (_value) {
            value = _value;
            for (var i = 0, ii = pending.length; i < ii; i++) {
                var callback = pending[i];
                callback(value);
            }
            pending = undefined;
        },
        then: function (callback) {
            if (pending) {
                pending.push(callback);
            } else {
                callback(value);
            }
        }
    }
};
// 如何使用defer对象
var oneOneSecondLater = function () {
    var result = defer();
    setTimeout(function () {
        result.resolve(1);
    }, 1000);
    return result;
};

oneOneSecondLater().then(callback);

```
这里的resolve函数有点缺陷，在于其可以执行多次并改变promise的状态。修复一下, 当第二次调用resolve的时候抛出一个错误。

```js
if (pending) {
    value = _value;
    for (var i = 0, ii = pending.length; i < ii; i++) {
        var callback = pending[i];
        callback(value);
    }
    pending = undefined;
} else {
    throw new Error("A promise can only be resolved once.");
}
```

将promise从resolve中分离出来有助于我们遵循单一职责的编程原则，promise只负责监控结果的状态，而resolve函数负责真正的执行。
这种分离必然会加重垃圾回收机制的负担。

```js
var Promise = function () {
};

var isPromise = function (value) {
    return value instanceof Promise;
};

var defer = function () {
    var pending = [], value;
    var promise = new Promise();
    promise.then = function (callback) {
        if (pending) {
            pending.push(callback);
        } else {
            callback(value);
        }
    };
    return {
        resolve: function (_value) {
            if (pending) {
                value = _value;
                for (var i = 0, ii = pending.length; i < ii; i++) {
                    var callback = pending[i];
                    callback(value);
                }
                pending = undefined;
            }
        },
        promise: promise
    };
};
```
下一步是解决连续promise调用的问题，假设一下，有个函数的执行依赖另外两个异步函数的返回值，用回调函数是这样的实现：

```js
var twoOneSecondLater = function (callback) {
    var a, b;
    var consider = function () {
        if (a === undefined || b === undefined)
            return;
        callback(a + b);
    };
    oneOneSecondLater(function (_a) {
        a = _a;
        consider();
    });
    oneOneSecondLater(function (_b) {
        b = _b;
        consider();
    });
};

twoOneSecondLater(function (c) {
    // c === 2
});
```
这种方式有明显的缺点：consider函数需要在其被使用之前显式的声明。

而在promise的实现下，我们只需要几行代码就可以轻松的实现这个效果：

```js

var a = oneOneSecondLater();
var b = oneOneSecondLater();
var c = a.then(function (a) {
    return b.then(function (b) {
        var c = a + b;
        return c;
    });
});
```
为了上面的代码能够正常的工作，我们需要做一下几件事：
1. then方法必须返回一个Promise，
2. 返回的promise必须能够被回调函数的返回值resolve
3. 回调函数的返回值必须是一个解决的常量值或者是一个pormise对象。

#### 二、不同promise之间的解决过程（为了兼容不同的promise标准实现或者兼容一些非promise的错误用法。）





Promise 解决过程

Promise 解决过程是一个抽象的操作，其需输入一个 promise 和一个值，我们表示为 [[Resolve]](promise, x)，如果 x 有 then 方法且看上去像一个 Promise ，解决程序即尝试使 promise 接受 x 的状态；否则其用 x 的值来执行 promise 。

这种 thenable 的特性使得 Promise 的实现更具有通用性：只要其暴露出一个遵循 Promise/A+ 协议的 then 方法即可；这同时也使遵循 Promise/A+ 规范的实现可以与那些不太规范但可用的实现能良好共存。

运行 [[Resolve]](promise, x) 需遵循以下步骤：

x 与 promise 相等

如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise

x 为 Promise

如果 x 为 Promise ，则使 promise 接受 x 的状态 注4：

如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
如果 x 处于执行态，用相同的值执行 promise
如果 x 处于拒绝态，用相同的据因拒绝 promise
x 为对象或函数

如果 x 为对象或者函数：

把 x.then 赋值给 then 注5
如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise

如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise:

如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)

如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise

如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用

如果调用 then 方法抛出了异常 e：

如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
否则以 e 为据因拒绝 promise

如果 then 不是函数，以 x 为参数执行 promise
如果 x 不为对象或者函数，以 x 为参数执行 promise

如果一个 promise 被一个循环的 thenable 链中的对象解决，而 [[Resolve]](promise, thenable) 的递归性质又使得其被再次调用，根据上述的算法将会陷入无限递归之中。算法虽不强制要求，但也鼓励施者检测这样的递归是否存在，若检测到存在则以一个可识别的 TypeError 为据因来拒绝 promise 注6。


**reference：**

[Promises/A+规范(中文)](http://example.com/)

[Promises/A+规范(英文)](https://promisesaplus.com/)


#### setTimeout(fn, 0)的作用

确保回调函数按照他们注册的时间顺序去执行，这大大减少了控制流异步编程的固有危险数量。考虑一个简单的例子:

```js
var blah = function () {
    var result = foob().then(function () {
        return barf();
    });
    var barf = function () {
        return 10;
    };
    return result;
};
```

该函数将抛出一个异常或返回一个被10解决的promise, 它取决于foob()解决在同一的事件循环(发行其立即回调在同一堆栈)或在未来。如果回调是推迟到未来,它会一直成功。

#### 关于setTimeout(fn, 0);

js运行是基于单线程的，意味着一段代码执行时，其他代码将进入队列等待，一旦线程有空闲就执行后续代码。如果代码中设定了一个setTimeout，那么浏览器便会在合适的时间，将代码插入任务队列，如果这个时间设为 0，就代表立即插入队列，但并不是立即执行，仍然要等待前面代码执行完毕（其实有个延时，具体是16ms还是4ms取决于浏览器）。所以setTimeout 并不能保证执行的时间，是否及时执行取决于 JavaScript 线程是拥挤还是空闲。


```html
<input type="text" ng-model="name" ng-keydown="showName()">
<span ng-bind="name"></span>
```

```js
var app = angular.module('App', []);
app.controller('myContrl', function($scope, $window) {
    $scope.name = '123';
    $scope.showName = function() {
        $window.setTimeout(function() {
            console.log($scope.name);
        }, 0);
    };
})
```
例如在keydown事件中，js引擎需要先去执行keydown的事件，然后再去更新input中的value值，
这就导致我们无法及时的取到输入框中“准确”的value值，所以利用setTimeout(fn, 0)将取值的操作加入到当前执行队列的最后，等待value的值更新之后我们再去进行取值的操作，就可以取到准确的值了。
