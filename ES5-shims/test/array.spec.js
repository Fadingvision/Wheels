describe('Array', function() {


    var testSubject;
    var arr = ES5.Array;

    beforeEach(function () {
        testSubject = [2, 3, undefined, true, 'hej', null, false, 0];
        delete testSubject[1];
    });

    describe('#forEach()', function() {

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
    });





});