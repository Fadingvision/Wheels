export function isThenable(obj) {
    return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}

const isBrower = typeof window !== 'undefined' && typeof window.setTimeout === 'function';
const isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

/**
 * 将执行函数添加到执行队列的最后，保证promise过程执行顺序的稳定和有序
 * 支持node环境和浏览器环境
 * @param  {Function} callback 回调函数
 * @param  {[type]}   arg      [description]
 * @return {[type]}            [description]
 */
export function assp(callback, ...arg) {
    const flush = () => {
        callback.apply(null, arg);
    };
    if(isBrower) {
        const setTimeout = window.setTimeout;
        setTimeout(flush, 1);
    } else if(isNode){
        process.nextTick(flush);
    }
}