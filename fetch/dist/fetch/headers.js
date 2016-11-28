"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

function argumentIsNeeded() {
	throw new TypeError("Failed to execute 'Request': 1 argument required, but only 0 present");
}

var Headers = (function () {
	function Headers() {
		_classCallCheck(this, Headers);

		this.map = new Map();
	}

	_prototypeProperties(Headers, null, {
		append: {
			value: function append(key, value) {
				var oldValue = this.get(key);
				var newValue = undefined;
				if (this.has(key)) {
					if (Array.isArray(oldValue)) {
						newValue = oldValue;
						newValue.push(value);
					} else {
						newValue = [];
						newValue.push(oldValue);
						newValue.push(value);
					}
					this.set(key, newValue);
				} else {
					this.set(key, value);
				}
			},
			writable: true,
			configurable: true
		},
		"delete": {
			value: function _delete() {
				var key = arguments[0] === undefined ? argumentIsNeeded() : arguments[0];
				return this.map["delete"](key);
			},
			writable: true,
			configurable: true
		},
		set: {
			value: function set(key, value) {
				return this.map.set(key, value);
			},
			writable: true,
			configurable: true
		},
		forEach: {

			/**
    * 对headers对象进行遍历
    * @param  {Function} cb [description]
    * @return {[type]}      [description]
    */
			value: function forEach() {
				var cb = arguments[0] === undefined ? argumentIsNeeded() : arguments[0];
				for (var _iterator = this.map.entries()[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
					var item = _step.value;
					cb(item[0], item[1], this);
				}
			},
			writable: true,
			configurable: true
		},
		get: {
			value: function get() {
				var key = arguments[0] === undefined ? argumentIsNeeded() : arguments[0];
				var value = this.map.get(key);
				return Array.isArray(value) ? value[0] : value;
			},
			writable: true,
			configurable: true
		},
		getAll: {
			value: function getAll() {
				var key = arguments[0] === undefined ? argumentIsNeeded() : arguments[0];
				var value = this.map.get(key);
				return Array.isArray(value) ? value : [value];
			},
			writable: true,
			configurable: true
		},
		has: {
			value: function has() {
				var key = arguments[0] === undefined ? argumentIsNeeded() : arguments[0];
				return this.map.has(key);
			},
			writable: true,
			configurable: true
		},
		keys: {
			value: function keys() {
				return this.map.keys();
			},
			writable: true,
			configurable: true
		},
		entries: {
			value: function entries() {
				return this.map.entries();
			},
			writable: true,
			configurable: true
		},
		values: {
			value: function values() {
				return this.map.values();
			},
			writable: true,
			configurable: true
		}
	});

	return Headers;
})();

module.exports = Headers;