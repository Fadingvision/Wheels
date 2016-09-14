// throttle 策略的电梯。保证如果电梯第一个人进来后，15秒后准时运送一次，不等待。如果没有人，则待机。
// (文本输入、自动完成，keyup 事件)
// debounce 策略的电梯。如果电梯里有人进来，等待15秒。如果又人进来，15秒等待重新计时，直到15秒超时，开始运送。
// (鼠标移动，mousemove 事件, DOM 元素动态定位，window 对象的 resize 和 scroll 事件)

/**
 * 函数节流(mousemove, resize, scroll)
 * @param  {Function} fn [description]
 * @param  {Function} delay [description]
 * @param  {Function}  [description]
 * @return {[type]}      [description]
 */

// step 1
// 我们的目的就是让函数不那么频繁的被调用，也就是让函数延迟执行，使用setTimeout就达到需求
// 现在每次只要调用这个函数就会清空原来的timeout，然后继续设置新的timeout。
// 直到不在调用的时候（也就是用户的操作停止的时候），fn才会真正执行
function throttle(fn, delay) {
    var timer = null;
    // 返回真正执行的函数
    return function() {
        timer && clearTimeout(timer);
        timer = setTimeout(function() {
            fn();
        }, delay);
    }
}


// step 2
/*
    上面的代码如果用户 不断的 resize 浏览器窗口大小，这时延迟处理函数一次都不会执行，更像是debounce。
    用户触发 resize 的时候应该 在某段时间 内至少触发一次，既然是在某段时间内，那么这个判断条件就可以取当前的时间毫秒数，
    每次函数调用把当前的时间和上一次调用时间相减，然后判断差值如果大于某段时间就直接触发，否则还是走 timeout 的延迟逻辑。
 */ 

function throttle(fn, delay) {
    var timer = null;
    var previous = null;

    // 返回真正执行的函数
    return function() {
        var now = Date.now();
        // 记录上一次调用函数的时间
        if(!previous) previous = now;
        // 如果两次调用函数的时间间隔超过延迟的时间，则立即调用
        if(now - previous > delay){
            fn();
            // 改变上一次的时间为当前时间
            previous = now;
        }else {
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                fn();
            }, delay);
        }
    }
}


// step 3
// 优化this指向，添加函数的执行参数
function throttle(fn, delay) {
    var timer = null;
    var previous = null;

    // 返回真正执行的函数
    return function() {
        var now = Date.now();
        var args = arguments;
        var context = this;

        // 记录上一次调用函数的时间
        if(!previous) previous = now;
        // 如果两次调用函数的时间间隔超过延迟的时间，则立即调用
        if(now - previous > delay){
            fn.apply(context, args);
            // 改变上一次的时间为当前时间
            previous = now;
        }else {
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        }
    }
}


// step 4
// 保存函数调用的返回值
function throttle(fn, delay) {
    var timer = null;
    var previous = null;

    var context, args , result;

    // 返回真正执行的函数
    return function() {
        var now = Date.now();
        args = arguments;
        context = this;

        // 记录上一次调用函数的时间
        if(!previous) previous = now;
        // 如果两次调用函数的时间间隔超过延迟的时间，则立即调用
        if(now - previous > delay){
            result = fn.apply(context, args);
            // 改变上一次的时间为当前时间
            previous = now;
        }else {
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                result = fn.apply(context, args);
            }, delay);
        }

        return result;
    }
}

// step 5
// 优化首尾调用参数
function throttle(fn, delay, option) {
    // 默认立即执行，且最后也执行
    option = option || {
        leading     : true,
        trailing    : true
    };
    var context,
        args,
        result,
        timer = null,
        previous = 0;

    // 返回真正执行的函数
    return function() {
        var now = Date.now();
        args = arguments;
        context = this;

        // 如果leading为false,则不立即执行; 如果leading为true，且是第一次执行,则previous为0,则会立即执行
        if(!previous && option.leading === false) previous = now;

        // 如果两次调用函数的时间间隔超过延迟的时间，则立即调用
        if(now - previous >= delay){
            timer && clearTimeout(timer);
            timer = null;
            // 改变上一次的时间为当前时间
            previous = now;
            result = fn.apply(context, args);

        // 如果trailing为false,则不执行最后的定时。否则如果没有超过延迟的时间，则计算剩余的
        }else if(!timer && option.trailing !== false){
            timer = setTimeout(function() {
                result = fn.apply(context, args);
                timer = null;
                // 还原previous:
                // 立即执行就让它为date.now(),则下次now - previous >= delay；
                // 否则为0，下次则为now ,则 now - previous < delay
                previous = option.leading === false ? 0 : Date.now();
            }, delay - (now - previous));
        }

        return result;
    }
} 


// step 6
// underscore版本的throttle
function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 上次执行时间点
    var previous = 0;
    if (!options) options = {};
    // 延迟执行函数
    var later = function() {
        // 若设定了开始边界不执行选项，上次执行时间始终为0
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = _.now();
        // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
        if (!previous && options.leading === false) previous = now;
        // 延迟执行时间间隔
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
        // remaining大于时间窗口wait，表示客户端系统时间被调整过
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
            //如果延迟执行不存在，且没有设定结尾边界不执行选项
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}