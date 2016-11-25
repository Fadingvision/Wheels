export default class Headers {

	constructor() {
		this.map = new Map();
	}

	append(key, value) {
		let oldValue = this.get(key);
		let newValue;
		if(this.has(key)) {
			if( Array.isArray(oldValue) ){
				newValue = oldValue;
				newValue.push(value);
			} else {
				newValue = [];
				newValue.push(oldValue);
				newValue.push(value);
			}
			this.set(key, newValue);
		}else {
			this.set(key, value);
		}
	}

	delete(key) {
		return this.map.delete(key);
	}

	entries() {}

	forEach() {}

	get() {}

	getAll() {}

	has() {}

	keys() {}

	set() {}

	values() {}


}