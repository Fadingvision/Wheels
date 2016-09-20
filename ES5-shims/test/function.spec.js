describe('test es5 function', function() {
	'use strict';
	// create a reference
	
 
	describe('#bind', function() {
		var actual;

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
            expect(actual).toEqual([1, 2, 4, 1, 2, 3]);
		})

		it('returns properly while binding a context properly', function() {
			var ret;
			testSubject.func = func.bind(actual);
			ret = testSubject.func(1, 2, 3);
			expect(ret).toBe(actual);
			expect(ret).not.toBe(testSubject);
		});

	})
});