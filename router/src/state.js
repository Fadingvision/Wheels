import pathToRegexp from 'path-to-regexp';
export default class State {
	constructor(stateName, url, cb) {
		this.stateName = stateName;
		this.url = url;

		this.regexp = pathToRegexp(url);
		this.tokens = pathToRegexp.parse(url);
		this.cb = cb;
	}

	leave() {
		this.cb.leave && this.cb.leave();
	}

	reload() {
		this.cb.enter();
	}

}