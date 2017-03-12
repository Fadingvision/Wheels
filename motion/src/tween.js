/* eslint-disable */
/*
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * you can visit 'http://tweens.net/zh-cn' to get effect
 */
// const tween = {
//     Linear(t, b, c, d) {
//         return c * t / d + b;
//     },
//     Quad: {
//         easeIn(t, b, c, d) {
//             return c * (t /= d) * t + b;
//         },
//         easeOut(t, b, c, d) {
//             return -c * (t /= d) * (t - 2) + b;
//         },
//         easeInOut(t, b, c, d) {
//             if ((t /= d / 2) < 1) return c / 2 * t * t + b;
//             return -c / 2 * ((--t) * (t - 2) - 1) + b;
//         }
//     },
//     Cubic: {
//         easeIn(t, b, c, d) {
//             return c * (t /= d) * t * t + b;
//         },
//         easeOut(t, b, c, d) {
//             return c * ((t = t / d - 1) * t * t + 1) + b;
//         },
//         easeInOut(t, b, c, d) {
//             if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
//             return c / 2 * ((t -= 2) * t * t + 2) + b;
//         }
//     },
//     Quart: {
//         easeIn(t, b, c, d) {
//             return c * (t /= d) * t * t * t + b;
//         },
//         easeOut(t, b, c, d) {
//             return -c * ((t = t / d - 1) * t * t * t - 1) + b;
//         },
//         easeInOut(t, b, c, d) {
//             if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
//             return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
//         }
//     },
//     Quint: {
//         easeIn(t, b, c, d) {
//             return c * (t /= d) * t * t * t * t + b;
//         },
//         easeOut(t, b, c, d) {
//             return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
//         },
//         easeInOut(t, b, c, d) {
//             if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
//             return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
//         }
//     },
//     Sine: {
//         easeIn(t, b, c, d) {
//             return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
//         },
//         easeOut(t, b, c, d) {
//             return c * Math.sin(t / d * (Math.PI / 2)) + b;
//         },
//         easeInOut(t, b, c, d) {
//             return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
//         }
//     },
//     Expo: {
//         easeIn(t, b, c, d) {
//             return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
//         },
//         easeOut(t, b, c, d) {
//             return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
//         },
//         easeInOut(t, b, c, d) {
//             if (t == 0) return b;
//             if (t == d) return b + c;
//             if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
//             return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
//         }
//     },
//     Circ: {
//         easeIn(t, b, c, d) {
//             return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
//         },
//         easeOut(t, b, c, d) {
//             return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
//         },
//         easeInOut(t, b, c, d) {
//             if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
//             return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
//         }
//     },
//     Elastic: {
//         easeIn(t, b, c, d, a, p) {
//             var s;
//             if (t == 0) return b;
//             if ((t /= d) == 1) return b + c;
//             if (typeof p == "undefined") p = d * .3;
//             if (!a || a < Math.abs(c)) {
//                 s = p / 4;
//                 a = c;
//             } else {
//                 s = p / (2 * Math.PI) * Math.asin(c / a);
//             }
//             return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
//         },
//         easeOut(t, b, c, d, a, p) {
//             var s;
//             if (t == 0) return b;
//             if ((t /= d) == 1) return b + c;
//             if (typeof p == "undefined") p = d * .3;
//             if (!a || a < Math.abs(c)) {
//                 a = c;
//                 s = p / 4;
//             } else {
//                 s = p / (2 * Math.PI) * Math.asin(c / a);
//             }
//             return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
//         },
//         easeInOut(t, b, c, d, a, p) {
//             var s;
//             if (t == 0) return b;
//             if ((t /= d / 2) == 2) return b + c;
//             if (typeof p == "undefined") p = d * (.3 * 1.5);
//             if (!a || a < Math.abs(c)) {
//                 a = c;
//                 s = p / 4;
//             } else {
//                 s = p / (2 * Math.PI) * Math.asin(c / a);
//             }
//             if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
//             return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
//         }
//     },
//     Back: {
//         easeIn(t, b, c, d, s) {
//             if (typeof s == "undefined") s = 1.70158;
//             return c * (t /= d) * t * ((s + 1) * t - s) + b;
//         },
//         easeOut(t, b, c, d, s) {
//             if (typeof s == "undefined") s = 1.70158;
//             return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
//         },
//         easeInOut(t, b, c, d, s) {
//             if (typeof s == "undefined") s = 1.70158;
//             if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
//             return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
//         }
//     },
//     Bounce: {
//         easeIn(t, b, c, d) {
//             return c - tween.Bounce.easeOut(d - t, 0, c, d) + b;
//         },
//         easeOut(t, b, c, d) {
//             if ((t /= d) < (1 / 2.75)) {
//                 return c * (7.5625 * t * t) + b;
//             } else if (t < (2 / 2.75)) {
//                 return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
//             } else if (t < (2.5 / 2.75)) {
//                 return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
//             } else {
//                 return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
//             }
//         },
//         easeInOut(t, b, c, d) {
//             if (t < d / 2) {
//                 return tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
//             } else {
//                 return tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
//             }
//         }
//     }
// }


let tween = {};
let names = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
let functions = {
    Sine: function(t) {
        return 1 - Math.cos(t * Math.PI / 2);
    },
    Circ: function(t) {
        return 1 - Math.sqrt(1 - t * t);
    },
    Elastic: function(t, m) {
        if (t === 0 || t === 1) return t;
        let p = (1 - Math.min(m, 998) / 1000),
            st = t / 1,
            st1 = st - 1,
            s = p / (2 * Math.PI) * Math.asin(1);
        return -(Math.pow(2, 10 * st1) * Math.sin((st1 - s) * (2 * Math.PI) / p));
    },
    Back: function(t) {
        return t * t * (3 * t - 2);
    },
    Bounce: function(t) {
        let pow2, bounce = 4;
        while (t < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
    }
}
names.forEach(function(name, i) {
    functions[name] = function(t) {
        return Math.pow(t, i + 2);
    }
});
Object.keys(functions).forEach(function(name) {
    let easeIn = functions[name];
    tween['easeIn' + name] = easeIn;
    tween['easeOut' + name] = function(t, m) {
        return 1 - easeIn(1 - t, m);
    };
    tween['easeInOut' + name] = function(t, m) {
        return t < 0.5 ? easeIn(t * 2, m) / 2 : 1 - easeIn(t * -2 + 2, m) / 2;
    };
});
tween.linear = function(t) {
    return t;
};
export default tween;