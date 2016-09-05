;(function(global, factory) {

    if(typeof module !== 'undefined' && typeof module.exports === 'function') module.exports = factory();
    else if(typeof define !== 'undefined' && (define.amd || define.cmd)) define(factory);
    else global.glass = factory();

})(this, function() {
    'use strict';

    var proto = 'prototye';

    function extend(child) {
        var super = this;

        var Fn = function() {};
        Fn[proto] = super[proto];

        super[proto][constructor].call(child);

        Fn.extend = argument.callee;

        Fn.statics = function() {

        }

        Fn.methods = function() {

        }

        return Fn;

    }

    var glass = function(o) {
        return typeof o !== 'function' ? o : extend.call(o)
    }


    return glass;
});