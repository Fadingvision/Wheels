## about Promise

#### Issues
1. 解决的问题，实现的原理
1. 不同promise的实现之间的交互（resolvePromise函数的实现和用法）--- 不太明白
2. 原则上，promise.then(onResolved, onRejected)里的这两相函数需要异步调用,让then的参数异步执行
    （setTimeout(fn, 0)的含义和用法） --- 不太明白
3. promise标准的测试，eslint的语法错误修复
5. promise链的错误处理
6. promise.race, .all, 等其他相关方法的实现（基于then方法）
7. 和其他牛逼的实现（q, bluebird, $q, $.defer）的对比和学习

#### 一、解决的问题，实现的原理




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
