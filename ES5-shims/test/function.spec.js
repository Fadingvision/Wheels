describe('test es5 function', function() {
	'use strict';
	// create a reference
	
 
	describe('#bind', function() {
		var actual;
		// 利用testSubject的同名push来进行bind测试。
		// 如果绑定成功到actual,则会调用原生的push,否则则会调用testSubject的push方法
		var testSubject = {
			push: function(o) {
				this.a.push(o);
			}
		};

		var func = function func() {
			Array.prototype.forEach.call(arguments, function(a) {
				this.push(a);
			}, this);

			return this;
		}

		beforeEach(function() {
			actual = [];
			testSubject.a = [];
		});

		it('it should bins properly without a context', function() {
			var context;
			testSubject.func = function() {
				context = this;
			}.bind();

			testSubject.func();
			expect(context).toBe(function() {return this;}.call());
			expect(context).toBe(undefined);
		});

		it('returns properly without binding a context, and still supplies bound arguments;', function() {
			var context;
			testSubject.func = function () {
			    context = this;
			    return Array.prototype.slice.call(arguments);
			}.bind(undefined, 1, 2, 3);

			actual = testSubject.func(1, 2, 4);
            expect(context).toBe(function () { return this; }.call());
            expect(actual).toEqual([1, 2, 3, 1, 2, 4]);
		})

		it('binds a context properly', function () {
		    testSubject.func = func.bind(actual);
		    testSubject.func(1, 2, 3);
		    expect(actual).toEqual([1, 2, 3]);
		    expect(testSubject.a).toEqual([]);
		});


		it('binds a context properly', function () {
		    testSubject.func = func.bind(testSubject);
		    testSubject.func(1, 2, 3);
		    expect(actual).toEqual([]);
		    expect(testSubject.a).toEqual([1, 2, 3]);
		});

		it('binds a context and supplies bound arguments', function () {
            testSubject.func = func.bind(actual, 1, 2, 3);
            testSubject.func(4, 5, 6);
            expect(actual).toEqual([1, 2, 3, 4, 5, 6]);
            expect(testSubject.a).toEqual([]);
        });

        it('returns properly without binding a context ', function() {
        	var ret;
        	testSubject.func = func.bind();
        	ret = testSubject.func();
        	expect(ret).toBe(undefined);
        	expect(ret).not.toBe(testSubject);
        });

		it('returns properly while binding a context properly', function() {
			var ret;
			testSubject.func = func.bind(actual);
			ret = testSubject.func(1, 2, 3);
			expect(ret).toBe(actual);
			expect(ret).not.toBe(testSubject);
		});

		it('returns properly while binding a context and supplies bound arguments', function () {
		    var ret;
		    testSubject.func = func.bind(actual, 1, 2, 3);
		    ret = testSubject.func(4, 5, 6);
		    expect(ret).toBe(actual);
		    expect(ret).not.toBe(testSubject);
		});

		// my bind can not pass this one (bug fixed)
		it('当绑定函数作为构造函数使用的时候，传入的thisArg无效', function () {
		    var actualContext;
		    var expectedContext = { foo: 'bar' };
		    testSubject.Func = function () {
		        actualContext = this;
		    }.bind(expectedContext);
		    var result = new testSubject.Func();
		    expect(result).toBeTruthy();
		    expect(result).toBe(actualContext);
		    expect(actualContext).not.toBe(expectedContext);
		});

		it('作为构造函数时正确传递参数', function () {
		    var expected = { name: 'Correct' };
		    testSubject.Func = function (arg) {
				// my bind can not pass this one 
		        expect(Object.prototype.hasOwnProperty.call(this, 'name')).toBe(false);
		        // 如果return的是非对象(数字、字符串、布尔类型等)会忽而略返回值;如果return的是对象，则返回该对象。
		        return arg;
		    }.bind({ name: 'Incorrect' });
		    var ret = new testSubject.Func(expected);
		    expect(ret).toBe(expected);
		});

		it('返回的原始值应该无效,返回的对象应该有效', function () {
		    var Subject = function (oracle) {
		        expect(this).not.toBe(oracle);
		        return oracle;
		    }.bind(null);

		    var primitives = ['asdf', null, true, 1];
		    for (var i = 0; i < primitives.length; ++i) {
		        expect(new Subject(primitives[i])).not.toBe(primitives[i]);
		    }

		    var objects = [[1, 2, 3], {}, function () {}];
		    for (var j = 0; j < objects.length; ++j) {
		        expect(new Subject(objects[j])).toBe(objects[j]);
		    }
		});


		it('returns the return value of the bound function when called as a constructor', function () {
		    var oracle = [1, 2, 3];
		    var Subject = function () {
		        expect(this).not.toBe(oracle);
		        return oracle;
		    }.bind(null);
		    var result = new Subject();
		    expect(result).toBe(oracle);
		});


		it('returns the value that instance of original "class" when called as a constructor', function () {
		    var ClassA = function (x) {
		        this.name = x || 'A';
		    };
		    var ClassB = ClassA.bind(null, 'B');

		    var result = new ClassB();
		    expect(result.name).toBe('B')
		    expect(result instanceof ClassA).toBe(true);
		    // instanceof 运算符用来检测 ClassB.prototype 是否存在于参数 result 的原型链上。
		    // result.__proto__ = ClassB.prototype
		    expect(result instanceof ClassB).toBe(true);
		});

		xit('sets a correct length without thisArg', function () {
			var fn = function (a, b, c) { return a + b + c; };
		    var Subject = fn.bind();
		    expect(Subject.length).toBe(3);
		});

		xit('sets a correct length with thisArg', function () {
		    var Subject = function (a, b, c) { return a + b + c + this.d; }.bind({ d: 1 });
		    expect(Subject.length).toBe(3);
		});
		xit('sets a correct length with thisArg and first argument', function () {
		    var Subject = function (a, b, c) { return a + b + c + this.d; }.bind({ d: 1 }, 1);
		    expect(Subject.length).toBe(2);
		});
		xit('sets a correct length without thisArg and first argument', function () {
		    var Subject = function (a, b, c) { return a + b + c; }.bind(undefined, 1);
		    expect(Subject.length).toBe(2);
		});
		xit('sets a correct length without thisArg and too many argument', function () {
		    var Subject = function (a, b, c) { return a + b + c; }.bind(undefined, 1, 2, 3, 4);
		    expect(Subject.length).toBe(0);
		});

	})
});