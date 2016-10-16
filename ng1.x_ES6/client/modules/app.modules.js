import angular from 'angular';
import BasicCtrl from './basic/basic.ctrl';
import IndexCtrl from './index/index.ctrl';

let appModule = angular.module('app.modules', [])
    .controller('BasicCtrl', BasicCtrl)
    .controller('IndexCtrl', IndexCtrl)
    .name;

export default appModule;
