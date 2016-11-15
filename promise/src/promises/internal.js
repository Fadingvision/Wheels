import {assp} from './util';


/**
 * resolve函数
 * 这里不强制执行resolve函数只能执行一次，
 * 因为在promise的状态改变之后，再也无法执行这个函数了
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function resolve(promise, data){
    assp(() => {
        if (promise.status === 'pending') {
            promise.status = 'resolved';
            promise.data = data;

            promise.onResolvedCb.forEach((cb) => {
                // 这里每个函数都是传入的data
                // 不是应该传入上一个回调函数的返回值？？？
                // --- 错啦，这里是一个promise里面的then,他们用的都是resolve里面的data;
                cb(data);
            });
        }
    });
}


function reject(promise, reason){
    assp(() => {
        if (promise.status === 'pending') {
            promise.status = 'rejected';
            promise.data = reason;
            promise.onRejectedCb.forEach((cb) => cb(reason));
        }
    });
}

export {
    resolve,
    reject
};