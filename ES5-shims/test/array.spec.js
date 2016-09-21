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
    });





});