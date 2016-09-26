describe('Array', function() {


    var testSubject;
    var arr = ES5.Array;

    beforeEach(function () {
        testSubject = [2, 3, undefined, true, 'hej', null, false, 0];
        delete testSubject[1];
    });

    describe('#forEach()', function() {
        var expected, actual;

        beforeEach(function () {
            expected = { 0: 2, 2: undefined, 3: true, 4: 'hej', 5: null, 6: false, 7: 0 };
            actual = {};
        });
        it('应该传递正确的参数', function() {
            var callback = jasmine.createSpy('callback');
            var array = ['1'];
            arr.forEach(array, callback);
            expect(callback).toHaveBeenCalledWith('1', 0, array);
        })


        it('应该检测是否是数组', function() {
            var callback = jasmine.createSpy('callback');
            var str = undefined;
            try{
                arr.forEach(str, callback);
            }catch(e) {
                expect(e).toBeTruthy();
            }
        })

        it('应该检测是否是函数', function() {
            var callback = 123;
            var array = ['1'];
            try{
                arr.forEach(array, callback);
            }catch(e) {
                expect(e).toBeTruthy();
            }
        })


        it('在循环中添加的元素应该无效', function(){
            var array = [1, 2, 3];
            var i = 0;
            arr.forEach(array, function(a) {
                i += 1;
                array.push(a + 3);
            });
            expect(array).toEqual([1, 2, 3, 4, 5, 6]);
            expect(i).toBe(3);
        })

        it('当不设置thisArg的时候，this应该为undefined', function(){
            var context;
            arr.forEach([1], function(){context = this});

            expect(context).toBe(function() {return this;}.call());
        });

        it('should iterate all', function () {
            testSubject.forEach(function (obj, index) {
                actual[index] = obj;
            });
            expect(actual).toExactlyMatch(expected);
        });
        
    });





});