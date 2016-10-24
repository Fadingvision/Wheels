import angular from 'angular';
import mocks from 'angular-mocks';
let context = require.context('./client', true, /\.spec$/);
context.keys().forEach(context);
