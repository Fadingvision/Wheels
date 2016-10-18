import angular from 'angular';
import BasicCtrl from './basic/basic.ctrl';
import IndexCtrl from './index/index.ctrl';
import LoanCtrl from './loan/loan.ctrl';

let appModule = angular.module('app.modules', [])
    .controller('BasicCtrl', BasicCtrl)
    .controller('IndexCtrl', IndexCtrl)
    .controller('LoanCtrl', LoanCtrl)
    .name;

export default appModule;
