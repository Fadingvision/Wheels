
function argumentIsNeeded() {
	throw new　TypeError('Failed to execute \'Request\': 1 argument required, but only 0 present');
}

export default class Headers {

	constructor() {
		this.map = new Map();
	}

	append() {}

	delete(key = argumentIsNeeded()) {
		return this.map.delete(key);
	}

	entries() {
		return this.map.entries();
	}

	/**
	 * 对headers对象进行遍历
	 * @param  {Function} cb [description]
	 * @return {[type]}      [description]
	 */
	forEach(cb = argumentIsNeeded()) {
		for (let item of this.map.entries()) {
		  	cb(item[0], item[1], this);
		}
	}

	get(key = argumentIsNeeded()) {
		let value = this.map.get(key);
		return Array.isArray(value) ? value[0] : value;
	}

	getAll(key = argumentIsNeeded()) {
		return this.map.get(key);
	}

	has(key = argumentIsNeeded()) {
		return this.map.has(key);
	}

	keys() {
		return this.map.keys();
	}

	set(key, value) {
		return this.map.set(key, value);
	}

	values() {
		return this.map.values();
	}
}