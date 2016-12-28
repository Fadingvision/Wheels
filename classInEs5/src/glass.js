;(function(global, factory) {

    if(typeof module !== 'undefined' && typeof module.exports === 'function') module.exports = factory();
    else if(typeof define !== 'undefined' && (define.amd || define.cmd)) define(factory);
    else global.glass = factory();

})(this, function() {
    'use strict';

    let glass = {
        create(superclass, definition) {
            // 如果没有可继承的父类，则让其直接继承Object对象
            if(arguments.length === 1) {
                let [definition, superclass] = [superclass, Object];
            }
            // 强制父类的构造函数
            if(typeof superclass !== 'function') {
                throw new Error('superClass must be a function');
            }

            let _super = superclass.prototype;
            // 类的静态属性和方法
            let statics = definition.statics;

            // 仅保留构造函数和原型方法
            delete definition.statics;

            // 作用1：修复传入的definition对象，使其如果是以普通对象定义的，改造成属性描述符的形式，方便用于object.create第二个参数
            // 如果是以属性描述符方式定义的对象，让其enumerable可枚举属性变为true
            // 作用2：如果有子类和父类有相同的方法，保存this._super为父类的方法，以便能够在子类同名方法中去调用父类的同名方法this._super()
            Object.keys(definition).forEach((prop) => {
                let item = definition[prop] = {
                    value: definition[prop],
                    enumerable: true,
                    writable: true,
                }

                if(typeof item.value === 'function' && typeof _super[prop] === 'function') {
                    // 保存对父类同名方法的引用
                    var __super = (...arg) => _super[prop].apply(this, arg);
                    var __superApply = (arg) => _super[prop].args;
                    var fn = item.value;

                    item.value  = function() {
                        return fn.apply(this, arguments);
                    };
                }

            });


            let Base = function() {
                this.init.apply(this, arguments);
            }

            Base.prototype = Object.create(_super, definition);
            Base.prototype.constructor = Base; // 修正指向

            if(typeof Base.prototype.init !== 'function'){
                Base.prototype.init = function() {
                    superclass.apply(this, arguments);
                };
            }

            // 继承父类的静态属性和方法
            let funNames = Object.getOwnPropertyNames(Function);
            if(Object !== superclass) {
                Object.getOwnPropertyNames(superclass).forEach((name) => {
                    // 去除任何函数都有的五个静态属性["length", "name", "arguments", "caller", "prototype"]
                    if(!funNames.includes(name)) {
                        Object.defineProperty(Base, name, Object.getOwnPropertyDescriptor(superclass, name));
                    }
                })
            }

            // 添加自身的静态属性和方法
            Object.getOwnPropertyNames(statics).forEach((name) => {
                // 去除任何函数都有的五个静态属性["length", "name", "arguments", "caller", "prototype"]
                if(!funNames.includes(name)) {
                    Object.defineProperty(Base, name, Object.getOwnPropertyDescriptor(statics, name));
                }
            })

            return Object.freeze(Base);
        },
    }

    return glass;
});