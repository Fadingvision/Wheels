/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		1:0,
/******/ 		0:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"observe"}[chunkId]||chunkId) + ".bundle.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _Observer = __webpack_require__(1);\n\nvar _Observer2 = _interopRequireDefault(_Observer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar app1 = new _Observer2.default({\n    data: {\n        name: 'youngwind',\n        age: 25\n    }\n});\n\nvar app2 = new _Observer2.default({\n    data: {\n        university: 'bupt',\n        major: 'computer'\n    }\n});\n\n// 要实现的结果如下：\napp1.name; // 你访问了 name\napp1.age = 100; // 你设置了 age，新的值为100\napp2.university; // 你访问了 university\napp2.major = 'science'; // 你设置了 major，新的值为 science\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9EOi9Db2RlL2dpdGh1Yi9XaGVlbHMvbXZ2bS9zcmMvaW5kZXguanM/NThhMyJdLCJuYW1lcyI6WyJhcHAxIiwiZGF0YSIsIm5hbWUiLCJhZ2UiLCJhcHAyIiwidW5pdmVyc2l0eSIsIm1ham9yIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7QUFFQSxJQUFJQSxPQUFPLHVCQUFhO0FBQ3BCQyxVQUFNO0FBQ0ZDLGNBQU0sV0FESjtBQUVGQyxhQUFLO0FBRkg7QUFEYyxDQUFiLENBQVg7O0FBT0EsSUFBSUMsT0FBTyx1QkFBYTtBQUNwQkgsVUFBTTtBQUNGSSxvQkFBWSxNQURWO0FBRUZDLGVBQU87QUFGTDtBQURjLENBQWIsQ0FBWDs7QUFPQTtBQUNBTixLQUFLRSxJQUFMLEMsQ0FBVTtBQUNWRixLQUFLRyxHQUFMLEdBQVcsR0FBWCxDLENBQWdCO0FBQ2hCQyxLQUFLQyxVQUFMLEMsQ0FBZ0I7QUFDaEJELEtBQUtFLEtBQUwsR0FBYSxTQUFiLEMsQ0FBdUIiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPYnNlcnZlciBmcm9tICcuL09ic2VydmVyJztcclxuXHJcbmxldCBhcHAxID0gbmV3IE9ic2VydmVyKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBuYW1lOiAneW91bmd3aW5kJyxcclxuICAgICAgICBhZ2U6IDI1XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubGV0IGFwcDIgPSBuZXcgT2JzZXJ2ZXIoe1xyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHVuaXZlcnNpdHk6ICdidXB0JyxcclxuICAgICAgICBtYWpvcjogJ2NvbXB1dGVyJ1xyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vIOimgeWunueOsOeahOe7k+aenOWmguS4i++8mlxyXG5hcHAxLm5hbWUgLy8g5L2g6K6/6Zeu5LqGIG5hbWVcclxuYXBwMS5hZ2UgPSAxMDA7IC8vIOS9oOiuvue9ruS6hiBhZ2XvvIzmlrDnmoTlgLzkuLoxMDBcclxuYXBwMi51bml2ZXJzaXR5IC8vIOS9oOiuv+mXruS6hiB1bml2ZXJzaXR5XHJcbmFwcDIubWFqb3IgPSAnc2NpZW5jZScgLy8g5L2g6K6+572u5LqGIG1ham9y77yM5paw55qE5YC85Li6IHNjaWVuY2VcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9EOi9Db2RlL2dpdGh1Yi9XaGVlbHMvbXZ2bS9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Observer = function () {\n  function Observer(conf) {\n    _classCallCheck(this, Observer);\n\n    this.observeData(conf.data);\n  }\n\n  _createClass(Observer, [{\n    key: \"observeData\",\n    value: function observeData(data) {\n      var _this = this;\n\n      Object.keys(data).forEach(function (key) {\n        var tempValue = data[key];\n        Object.defineProperty(_this, key, {\n          enumerable: true,\n          configurable: true,\n          set: function set(newVal) {\n            tempValue = newVal;\n            console.log(\"\\u4F60\\u8BBE\\u7F6E\\u4E86\" + key + \",\\u65B0\\u7684\\u503C\\u4E3A\" + newVal);\n          },\n          get: function get() {\n            console.log(\"\\u4F60\\u8BBF\\u95EE\\u4E86\" + key);\n            return tempValue;\n          }\n        });\n      });\n    }\n  }]);\n\n  return Observer;\n}();\n\nexports.default = Observer;\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9EOi9Db2RlL2dpdGh1Yi9XaGVlbHMvbXZ2bS9zcmMvT2JzZXJ2ZXIuanM/OTVkOCJdLCJuYW1lcyI6WyJPYnNlcnZlciIsImNvbmYiLCJvYnNlcnZlRGF0YSIsImRhdGEiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInRlbXBWYWx1ZSIsImtleSIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsInNldCIsIm5ld1ZhbCIsImNvbnNvbGUiLCJsb2ciLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLFE7QUFDbkIsb0JBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBS0MsV0FBTCxDQUFpQkQsS0FBS0UsSUFBdEI7QUFDRDs7OztnQ0FFV0EsSSxFQUFNO0FBQUE7O0FBQ2hCQyxhQUFPQyxJQUFQLENBQVlGLElBQVosRUFBa0JHLE9BQWxCLENBQTBCLGVBQU87QUFDL0IsWUFBSUMsWUFBWUosS0FBS0ssR0FBTCxDQUFoQjtBQUNBSixlQUFPSyxjQUFQLFFBQTRCRCxHQUE1QixFQUFpQztBQUMvQkUsc0JBQVksSUFEbUI7QUFFL0JDLHdCQUFjLElBRmlCO0FBRy9CQyxhQUgrQixlQUczQkMsTUFIMkIsRUFHbkI7QUFDVk4sd0JBQVlNLE1BQVo7QUFDQUMsb0JBQVFDLEdBQVIsOEJBQW1CUCxHQUFuQixpQ0FBOEJLLE1BQTlCO0FBQ0QsV0FOOEI7QUFPL0JHLGFBUCtCLGlCQU96QjtBQUNKRixvQkFBUUMsR0FBUiw4QkFBbUJQLEdBQW5CO0FBQ0EsbUJBQU9ELFNBQVA7QUFDRDtBQVY4QixTQUFqQztBQVlELE9BZEQ7QUFnQkQ7Ozs7OztrQkF0QmtCUCxRIiwiZmlsZSI6IjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBPYnNlcnZlciB7XHJcbiAgY29uc3RydWN0b3IoY29uZikge1xyXG4gICAgdGhpcy5vYnNlcnZlRGF0YShjb25mLmRhdGEpXHJcbiAgfVxyXG5cclxuICBvYnNlcnZlRGF0YShkYXRhKSB7XHJcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgIGxldCB0ZW1wVmFsdWUgPSBkYXRhW2tleV07XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHtcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICBzZXQobmV3VmFsKSB7XHJcbiAgICAgICAgICB0ZW1wVmFsdWUgPSBuZXdWYWxcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGDkvaDorr7nva7kuoYke2tleX0s5paw55qE5YC85Li6JHtuZXdWYWx9YClcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldCgpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGDkvaDorr/pl67kuoYke2tleX1gKVxyXG4gICAgICAgICAgcmV0dXJuIHRlbXBWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gIH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9EOi9Db2RlL2dpdGh1Yi9XaGVlbHMvbXZ2bS9zcmMvT2JzZXJ2ZXIuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);