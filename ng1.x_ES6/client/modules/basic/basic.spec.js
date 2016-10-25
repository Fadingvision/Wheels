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
    });

})