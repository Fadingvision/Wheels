(function(global) {
    /**
     * 注意细节：
     * 1. 每个then方法返回的是一个新的promise对象，而不是原来的this值。
     * 2. 每个then中的回调函数执行后的返回值是下一个回调函数的参数
     * 3. 一旦resolve，就会执行所有毁掉函数，并把Data传入到第一个回调函数的参数中去
     * 3. bind函数会返回一个新的函数变量
     */


    /**
     * #Issues
     * 1. 不同promise的实现之间的交互（resolvePromise函数的实现和用法）--- 不太明白
     * 2. 原则上，promise.then(onResolved, onRejected)里的这两相函数需要异步调用,让then的参数异步执行
     *     （setTimeout(fn, 0)的含义和用法） --- 不太明白
     * 3. promise标准的测试，eslint的语法错误修复
     * 5. promise链的错误处理
     * 6. promise.race, .all, 等其他相关方法的实现（基于then方法）
     * 7. 和其他牛逼的实现（q, bluebird, $q, $.defer）的对比和学习
     */
    // 8. what's diffrence bettwen these usages?
    /*
        doSomething().then(function() {
            return doSomethingElse();
        })；

        doSomethin().then(functiuoin() {
            doSomethingElse();
        });

        doSomething().then(doSomethingElse());

        doSomething().then(doSomethingElse);
    */



    /*
    关于不同Promise间的交互，
    其实标准里是有说明的，其中详细指定了如何通过then的实参返回的值来决定promise2的状态，
    我们只需要按照标准把标准的内容转成代码即可。
     */

    /*
    resolvePromise函数即为根据x的值来决定promise2的状态的函数
    也即标准中的[Promise Resolution Procedure](https://promisesaplus.com/#point-47)
    x为`promise2 = promise1.then(onResolved, onRejected)`里`onResolved/onRejected`的返回值
    `resolve`和`reject`实际上是`promise2`的`executor`的两个实参，因为很难挂在其它的地方，所以一并传进来。
    相信各位一定可以对照标准把标准转换成代码，这里就只标出代码在标准中对应的位置，只在必要的地方做一些解释
    */
    function resolvePromise(promise2, x, resolve, reject) {
        var then
        var thenCalledOrThrow = false

        if (promise2 === x) { // 对应标准2.3.1节
            return reject(new TypeError(
                'Chaining cycle detected for promise!'))
        }

        /* eslint-disable no-use-before-define*/
        if (x instanceof Promise) { // 对应标准2.3.2节
            // 如果x的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值的
            // 所以这里需要做一下处理，而不能一概的以为它会被一个“正常”的值resolve
            if (x.status === 'pending') {
                x.then(function(value) {
                    resolvePromise(promise2, value, resolve,
                        reject)
                }, reject)
            } else { // 但如果这个Promise的状态已经确定了，那么它肯定有一个“正常”的值，而不是一个thenable，所以这里直接取它的状态
                x.then(resolve, reject)
            }
            return undefined;
        }

        // 兼容其他的promise实现
        /* eslint-disable max-len */
        let isObject = (x !== null) && ((typeof x === 'object') || (
            typeof x === 'function')); // 2.3.3
        if (isObject) {
            try {

                // 2.3.3.1 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用
                // 即要判断它的类型，又要调用它，这就是两次读取
                then = x.then;
                if (typeof then === 'function') { // 2.3.3.3
                    then.call(x, function rs(y) { // 2.3.3.3.1
                        if (thenCalledOrThrow) return undefined; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
                        thenCalledOrThrow = true;
                        return resolvePromise(promise2, y,
                            resolve, reject); // 2.3.3.3.1
                    }, function rj(r) { // 2.3.3.3.2
                        if (thenCalledOrThrow) return undefined; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
                        thenCalledOrThrow = true;
                        return reject(r);
                    })
                } else { // 2.3.3.4
                    resolve(x);
                }
            } catch (e) { // 2.3.3.2
                if (thenCalledOrThrow) return undefined; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
                thenCalledOrThrow = true;
                return reject(e);
            }
        } else { // 2.3.4
            resolve(x)
        }
    }



    class Promise {
        /**
         * promise构造函数主体
         * @param  {[type]} executor 传入的执行函数
         * @return {[type]}          [description]
         */
        constructor(executor) {
            this.status = 'pending'; // promise的状态
            this.data = undefined; // promise的值
            this.onResolvedCb = []; // promise resolve时的回调函数集合
            this.onRejectedCb = []; // promise reject时的回调函数集合
            this.asynchronousTime = 0;
            /**
             * resolve函数
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            const resolve = (data) => {
                // 改变promise的状态，将外部的数据保存到promise实例上
                setTimeout(() => {
                    if (this.status === 'pending') {
                        this.status = 'resolved';
                        this.data = data;

                        this.onResolvedCb.forEach((cb) => {
                            // 这里每个函数都是传入的data
                            // 不是应该传入上一个回调函数的返回值？？？
                            // --- 错啦，这里是一个promise里面的then,他们用的都是resolve里面的data;
                            cb(data);
                        })
                    }
                }, this.asynchronousTime);
            }

            /**
             * reject
             * @param  {[type]} reason [description]
             * @return {[type]}      [description]
             */
            const reject = (reason) => {
                setTimeout(() => {
                    if (this.status === 'pending') {
                        this.status = 'rejected';
                        this.data = reason;

                        this.onRejectedCb.forEach((cb) => {
                            cb(reason);
                        })
                    }
                }, this.asynchronousTime);
            }

            // 考虑到执行executor的过程中有可能出错，所以我们用try/catch块给包起来，并且在出错后以catch到的值reject掉这个Promise
            try {
                // executor立即执行
                executor(resolve, reject);
            } catch (err) {
                reject(err);
            }
        }


        /**
         * 注册promise改变之后的回调函数
         * @param  {[type]} resolvedCb [description]
         * @param  {[type]} rejectedCb [description]
         * @return {[type]}            一个新的promise对象
         * 因为then每次返回的promise状态不是一致的。
         */
        then(resolvedCb, rejectedCb) {
            let promise2;
            let self = this;

            /**
             * promise坠落现象
             * 1. 当前一个then接受的参数不是函数，或者接收到的是一个没有return的函数的时候，
             * 下一个promise的resolve方法必然是接收不到值得。
             * 2. 所以给的默认函数需要把接收到的参数return 回去给下一个promise的resolve函数接受
             */
            resolvedCb = typeof resolvedCb === 'function' ?
                resolvedCb : function(value) {
                    return value
                };
            rejectedCb = typeof rejectedCb === 'function' ?
                rejectedCb : function(reason) {
                    throw reason
                };


            /**
             * 根据当前Promise的状态不同，返回不同的新的promise实例。
             * promise2的值取决于then里面函数的返回值。
             * @param  {[type]} this.status 当前Promise的状态
             * @return {[type]}             [description]
             */
            if (this.status === 'resolved') {
                // 第一个promise的resolve和reject是我们手动判断执行的。
                // 第二个promise的resolve和reject何时执行？？
                // 其实就是跟上一个promise的状态保持一致。。。
                // 如果第一个promise的状态已经是resolved了，
                // 那么第二个promise的立即执行resolve
                promise2 = new Promise(function(resolve, reject) {
                    setTimeout(() => {
                        try {
                            const x = resolvedCb(
                                self.data);

                            // 如果onResolved的返回值是一个Promise对象，
                            // 直接取它的结果做为promise2的结果
                            // 这里有点难以理解 ???
                            // if (x instanceof Promise) {
                            // x.then(resolve, reject);
                            // }
                            // 第二个promise的then的resolvedCb接受的是
                            // 第一个promise的resolvedCb执行后返回的参数
                            // resolve(x);

                            resolvePromise(promise2,
                                x, resolve,
                                reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, self.asynchronousTime);

                })
            }

            if (this.status === 'rejected') {
                promise2 = new Promise(function(resolve, reject) {
                    setTimeout(() => {
                        try {
                            const x = rejectedCb(
                                self.data);

                            resolvePromise(promise2,
                                x, resolve,
                                reject);
                        } catch (err) {
                            reject(err);
                        }

                    }, self.asynchronousTime);
                })
            }

            // 如果第一个promise的状态任然没有改变，
            // 那么就将上面的函数放入对应的回调函数数组中，
            // 待reject或者resolve执行后，执行对应的回调函数
            if (this.status === 'pending') {
                promise2 = new Promise(function(resolve, reject) {

                    self.onResolvedCb.push(function() {
                        try {
                            const x = resolvedCb(
                                self.data);
                            resolvePromise(promise2,
                                x, resolve,
                                reject);
                        } catch (err) {
                            reject(err);
                        }
                    });


                    self.onRejectedCb.push(function() {
                        try {
                            const x = rejectedCb(
                                self.data);
                            resolvePromise(promise2,
                                x, resolve,
                                reject);
                        } catch (err) {
                            reject(err);
                        }
                    });

                })
            }

            return promise2;
        } catch (rejected) {
            return this.then(null, rejected);
        }



        // 关于类似于angular的$q的两种用法，这里再次封装一种用法
        static deferred() {
            let defer = {};
            defer.promise = new Promise(function(resolve, reject) {
                defer.resolve = resolve;
                defer.reject = reject;
            });
            return defer;
        }

        static all() {

        }

        static race() {

        }

        static resolve() {

        }

        static reject() {

        }
    }

    // if(typeof export !== 'undefined') {
    // export default Promise;
    // }else
    if (typeof module === 'object' && typeof module.exports ===
        'function') {
        module.exports = Promise;
    } else {
        global.Promise = Promise;
    }
}(this));
