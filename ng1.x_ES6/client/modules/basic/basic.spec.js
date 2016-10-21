import appModule from '../app.modules';

describe('Basic', () => {
    let vm, localStorage, $state;
    const result = {
        code: 10000,
        data: {
            orderNum: 'fake_order_num'
        }
    };

    beforeEach(window.module(appModule));
    beforeEach(window.module('LocalStorageModule'));
    beforeEach(window.module('ui-router'));


    beforeEach(inject(($injector) => {
        let $rootScope = $injector.get('$rootScope');
        let $controller = $injector.get('$controller');
        let $q = $injector.get('$q');
        $state = $injector.get('$state');
        localStorage = $injector.get('localStorageService');

        spyOn(localStorage, 'set');
        spyOn($state, 'go');
        spyOn(localStorage, 'get').and.callFake(function(key) {
            return undefined;
        });

        // spyOn(applicationCustomerFactory, 'saveBasicInfo').and.callFake(function() {
        //     let deferred = $q.defer();
        //     deferred.resolve(result);
        //     return deferred.promise;
        // });

        vm = $controller('BasicCtrl', {
            $scope: $rootScope.$new()
        });
    }));



    it('should forbid the submit when input is invalid', function() {
        vm.basic = {
            name: 'asd',
            phone: '15708483717',
            idNum: '51132219930918261',
            qq: '',
            email: '',
            isStudent: '0'
        };
        vm.vertifyInfo();
        expect(localStorage.set).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
    });


    it('should allow the submit when input is valid', function() {
        vm.basic = {
            name: 'asd',
            phone: 15708483717,
            idNum: '512924196912231506',
            qq: '541606115',
            email: '541606115@qq.com',
            isStudent: '0'
        };
        vm.vertifyInfo();
        expect(localStorage.set).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalled();
    });

})