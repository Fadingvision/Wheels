;(function(global, factory) {

    if(typeof module !== 'undefined' && typeof module.exports === 'function') module.exports = factory();
    else if(typeof define !== 'undefined') define(factory);
    else global.glass = factory();

})(this, function() {
    var proto = 'prototye';

    // var Glass = function(constructor) {
    //     this.newClass = new constructor;
    //     this.Constructor = constructor;
    // }

    // Glass.prototype.extend = function() {
    //     this.
    // }

    // Glass.prototype.statics = function(staticObj) {
    //     var Constructor = this.Constructor;
    //     Object.keys(staticObj).forEach(function (key) {
    //         Constructor.key = staticObj[key];
    //     })
    //     return this;
    // }

    // Glass.prototype.methods = function(protoMethods) {
    //     var Constructor = this.Constructor;
    //     Object.keys(protoMethods).forEach(function (key) {
    //         Constructor.prototype[key] = protoMethods[key];
    //     })
    //     return this;
    // }
    

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