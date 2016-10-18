import angular from 'angular';
import alertDirec from './modal/modal.directive';

let appComponent = angular.module('app.component', [])
.directive('alertDirec', alertDirec)
.name;

export default appComponent;