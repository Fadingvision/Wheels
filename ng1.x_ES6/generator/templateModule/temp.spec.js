import appModule from '../app.modules';
import uiRouter from 'angular-ui-router';

describe('<%= upCaseName %>', () => {
    let vm, $state;

    beforeEach(window.module(uiRouter));
    beforeEach(window.module(appModule));
    
    beforeEach(inject((_$rootScope_, _$controller_, _$state_) => {
        let $rootScope = _$rootScope_;
        let $controller = _$controller_;
        $state = _$state_;

        vm = $controller('<%= upCaseName %>Ctrl', {
            $scope: $rootScope.$new()
        });
    }));

    // controller specs
    describe('Controller', () => {
        it('begin your fist test here', () => { 
            
        });
    });
});