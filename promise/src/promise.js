import {isThenable} from './promises/util';


function needstoBeFunction(executorType) {
    throw new Error(`Promise resolver ${executorType} is not a function`);
}

/**
 * Notice：
 * 1. 每个then方法返回的是一个新的promise对象，而不是原来的this值。
 * 2. 每个then中的回调函数执行后的返回值是下一个回调函数的参数
 * 3. 一旦resolve，就会执行所有毁掉函数，并把Data传入到第一个回调函数的参数中去
 * 3. bind函数会返回一个新的函数变量
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
*/
function resolvePromise(promise2, x, resolve, reject) {
    let then;
    let thenCalledOrThrow = false;
    /* eslint-disable max-len */
    let isObject = isThenable(x); // 2.3.3

    if (promise2 === x) { // 对应标准2.3.1节
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }

    // 如果是Promise对象，直接根据其状态来决定新的promise的状态
    /* eslint-disable no-use-before-define */
    if (x instanceof Promise) { // 对应标准2.3.2节
        // 如果 x 处于等待态， promise2 需保持为等待态直至 x 被执行或拒绝
        if (x.status === 'pending') {
            // 这里为了避免value值还是一个promise状态的值，所以需要对其进行递归处理
            x.then(function(value) {
                resolvePromise(promise2, value, resolve, reject);
            }, reject)
        } else {
            // 如果 x 处于执行态，用相同的值执行 promise2
            // 如果 x 处于拒绝态，用相同的据因拒绝 promise2
            x.then(resolve, reject)
        }
        return undefined;
    }

    // 兼容其他的promise实现
    else if (isObject) {
        try {

            // 2.3.3.1 因为x.then有可能是一个getter，这种情况下多次读取
            // 即要判断它的类型，又要调用它，这就是两次读取,就有可能产生副作用,这里保存一个它的引用
            then = x.then;

            // 如果是一个thenable方法
            // ???
            if (typeof then === 'function') { // 2.3.3.3
                then.call(x, function rs(y) { // 2.3.3.3.1
                    if (thenCalledOrThrow) return undefined; // 2.3.3.3.3 即这三处谁先执行就以谁的结果为准
                    thenCalledOrThrow = true;
                    return resolvePromise(promise2, y, resolve, reject); // 2.3.3.3.1
                }, function rj(r) { // 2.3.3.3.2
                    if (thenCalledOrThrow) return undefined; // 2.3.3.3.3 即这三处谁先执行就以谁的结果为准
                    thenCalledOrThrow = true;
                    return reject(r);
                })

                // 如果没有then方法，则直接用该值resolve掉新的promise
            } else { // 2.3.3.4
                resolve(x);
            }
        } catch (e) { // 2.3.3.2
            if (thenCalledOrThrow) return undefined; // 2.3.3.3.3 即这三处谁先执行就以谁的结果为准
            thenCalledOrThrow = true;
            return reject(e);
        }


        // 如果是原始值，直接用该值resolve掉新的promise
    } else { // 2.3.4
        resolve(x)
    }
}


// 由于以Symbol值作为名称的属性，不会被常规方法遍历得到。
// 我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
const _status = Symbol('status');
const _data = Symbol('data');
const _onResolvedCb = Symbol('onResolvedCb');
const _onRejectedCb = Symbol('onRejectedCb');

class Promise {
    /**
     * promise构造函数主体
     * @param  {[type]} executor 传入的执行函数
     * @return {[type]}          [description]
     */
    constructor(executor) {
        var executorType = typeof executor;
        if (executorType !== 'function') needstoBeFunction(executorType);

        this.status = 'pending'; // promise的状态
        this.data = undefined; // promise的值
        this.onResolvedCb = []; // promise resolve时的回调函数集合
        this.onRejectedCb = []; // promise reject时的回调函数集合
        this.asynchronousTime = 0;
        /**
         * resolve函数
         * 这里不强制执行resolve函数只能执行一次，
         * 因为在promise的状态改变之后，再也无法执行这个函数了
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
                    this.onRejectedCb.forEach((cb) => cb(reason));
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
     * @return {[type]}            一个新的promise对象（not this）
     * 因为then每次返回的promise状态不是一致的.所以不是传统的链试调用
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
                // ???
                setTimeout(() => {
                    try {
                        const x = resolvedCb(self.data);

                        // 如果onResolved的返回值是一个Promise对象，
                        // 直接取它的结果做为promise2的结果
                        // 这里有点难以理解 ???
                        // if (x instanceof Promise) {
                        // x.then(resolve, reject);
                        // }
                        // 第二个promise的then的resolvedCb接受的是
                        // 第一个promise的resolvedCb执行后返回的参数
                        // resolve(x);

                        resolvePromise(promise2, x, resolve, reject);
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
                        const x = resolvedCb(　self.data);
                        resolvePromise(promise2, 　x, resolve, 　reject);
                    } catch (err) {
                        reject(err);
                    }
                });


                self.onRejectedCb.push(function() {
                    try {
                        const x = rejectedCb(　self.data);
                        resolvePromise(promise2, 　x, resolve, 　reject);
                    } catch (err) {
                        reject(err);
                    }
                });

            })
        }

        return promise2;
    }



    catch (rejected) {
        return this.then(null, rejected);
    }



    // 关于类似于angular的$q的两种用法，这里再次封装一种用法
    static deferred() {
        let dfd = {};
        dfd.promise = new Promise((resolve, reject) => {
            dfd.resolve = resolve;
            dfd.reject = reject;
        });
        return dfd;
    }

    /**
     * 返回一个新的promise对象，该promise对象会在所有promise对象数组的状态变化为resolved的时候才会resolved，
     * 如果有一个promise被reject，则以该promise被reject的原因进行reject.
     * @param  {[type]} promises promise对象数组
     * @return {[type]}          新的promise对象
     */
    static all(promises) {
        return new Promise(function(resolve, reject) {
            var resolveCounter = 0;
            var promiseNum = promises.length;
            // 由于每个promise的状态确定的结果所需的时间一样,
            // 这里不能用空数组进行push,而是将每个promise在数组中的位置进行固定。
            var resolvedValues = new Array(promiseNum);
            for (var i = 0; i < promises.length; i++) {
                // 由于promise的解析过程是异步的，所以用闭包来保存i的值，保证每个promise的值的解析正确
                /* eslint-disable */
                (function(i) {
                    // 用Promise.resolve来确定每个promise的状态
                    Promise.resolve(promises[i]).then(function(value) {
                        resolvedValues[i] = value;
                        resolveCounter++;

                        // issue: 这里return 能return 出去吗？
                        // 这里不用return,　因为当resolve或者reject执行之后，这个promise的状态和value其实就已经确定过了。
                        if (resolveCounter === promiseNum) return resolve(resolvedValues);
                    }, function(reason) {
                        // 如果有某个promise被reject掉，则直接以该被reject的reason将新的promise对象进行reject掉。
                        return reject(reason);
                    })
                }(i))
            }
        })
    }

    /**
     * race方法返回一个promise，
     * 这个promise在promises中的任意一个promise被解决或拒绝后，
     * 立刻以相同的解决值被解决或以相同的拒绝原因被拒绝。
     * @return {object} promise
     */
    static race(promises) {
        return new Promise(function(resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                // 用Promise.resolve来确定每个promise的状态
                Promise.resolve(promises[i]).then(resolve, reject);
            }
        })
    }

    /**
     * 返回一个新的promise对象，该promise对象会根据传入的value值进行解析，
     * 如果该value值是一个普通的值，则直接将新的promise对象用该值进行resolve。
     * 如果该value值是一个promise对象或者一个thenable的对象，
     * 则会根据该promise的状态来决定新的promise对象的状态。
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */

    // BUGFIX TODO...
    static resolve(value) {
        let resolvedPromise = new Promise(function(resolve, reject) {
            resolvePromise(resolvedPromise, value, resolve, reject);
            // ??? 这里不用判断value值是不是promise对象或者thenable对象吗?
            // resolve(value);
        });
        return resolvedPromise;
    }

    static reject(reason) {
        let rejectPromise = new Promise(function(resolve, reject) {
            reject(reason);
        });
        return rejectPromise;
    }
}

// AMD
// if (typeof exports === "object" && typeof module === "object") {
//     module.exports = Promise;
// } else {
//     global.adapter = Promise;
// }
/* eslint-disable no-invalid-this */
export default Promise;
