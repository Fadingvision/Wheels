import localStroageModule from 'angular-local-storage';
import uiRouter from 'angular-ui-router';
import appModule from '../app.modules';

describe('Basic', () => {
    let vm, localStorageService, $state;
    const result = {
        code: 10000,
        data: {
            orderNum: 'fake_order_num'
        }
    };
    // fuck!!!!!!!!!!!!!!!!!!!!!!!!!
    // 我的老哥，报错和这个依赖注入太坑爹了，
    // 原来没有注入local和router的依赖，坑死爹了
    beforeEach(window.module(localStroageModule));
    beforeEach(window.module(uiRouter));
    beforeEach(window.module(appModule));



    beforeEach(inject((_$rootScope_, _$controller_, _localStorageService_, _$state_) => {
        let $rootScope = _$rootScope_;
        let $controller = _$controller_;
        $state = _$state_;
        localStorageService = _localStorageService_;

        spyOn(localStorageService, 'set');
        spyOn($state, 'go');
        spyOn(localStorageService, 'get').and.callFake(function(key) {
            return undefined;
        });

        vm = $controller('BasicCtrl', {
            $scope: $rootScope.$new()
        });
    }));

    // beforeEach(inject(($injector) => {
    //     // let $q = $injector.get('$q');

    //     localStorage = $injector.get('localStorageService');

    //     spyOn(localStorage, 'set');
    //     spyOn($state, 'go');
    //     spyOn(localStorage, 'get').and.callFake(function(key) {
    //         return undefined;
    //     });

    //     // spyOn(applicationCustomerFactory, 'saveBasicInfo').and.callFake(function() {
    //     //     let deferred = $q.defer();
    //     //     deferred.resolve(result);
    //     //     return deferred.promise;
    //     // });

    //     vm = $controller('BasicCtrl', {
    //         $scope: $rootScope.$new()
    //     });


    // }));



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
        expect(localStorageService.set).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
        // expect(0).toEqual(0);
    });


    // it('should allow the submit when input is valid', function() {
    //     vm.basic = {
    //         name: 'asd',
    //         phone: 15708483717,
    //         idNum: '512924196912231506',
    //         qq: '541606115',
    //         email: '541606115@qq.com',
    //         isStudent: '0'
    //     };
    //     vm.vertifyInfo();
    //     expect(localStorage.set).toHaveBeenCalled();
    //     expect($state.go).toHaveBeenCalled();
    // });

})