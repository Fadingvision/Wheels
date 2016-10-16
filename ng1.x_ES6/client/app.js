import flexible from 'lib-flexible';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import localStroageModule from 'angular-local-storage';
import appModule from './modules/app.modules';

import indexHtml from './modules/index/index.html';
import basicHtml from './modules/basic/basic.html';



import './less/main.less';

angular.module('Application', [
        uiRouter,
        localStroageModule,
        appModule
    ])
    .config(config);



function config($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $sceProvider) {
    "ngInject";
    $sceProvider.enabled(false);
    $stateProvider
        .state('applicationForm', {
            url: '/application',
            // abstract: true,     //　指定母版界面，所有的子界面都有这个统一的界面,　不能直接访问
            template: indexHtml,
            controller: 'IndexCtrl',
            controllerAs: 'vm'
        })
        // 基本信息
        .state('applicationForm.basic', {
            url: '/basic',
            template: basicHtml,
            controller: 'BasicCtrl',
            controllerAs: 'vm'
        });


    $locationProvider.html5Mode(true).hashPrefix('!');
}