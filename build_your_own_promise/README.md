### about Promise


#### Issues
1. 解决的问题，实现的原理
1. 不同promise的实现之间的交互（resolvePromise函数的实现和用法）--- 不太明白
2. 原则上，promise.then(onResolved, onRejected)里的这两相函数需要异步调用,让then的参数异步执行
    （setTimeout(fn, 0)的含义和用法） --- 不太明白
3. promise标准的测试，eslint的语法错误修复
5. promise链的错误处理
6. promise.race, .all, 等其他相关方法的实现（基于then方法）
7. 和其他牛逼的实现（q, bluebird, $q, $.defer）的对比和学习
