import util from './util';
import State from './state';
import _history from './history';
import Events from './events';
import pathToRegexp from 'path-to-regexp';

const throwException = () => {
	throw new Error('expected 2 parmaters, but only get one');
}

const events = new Events();
const stateArr = [];


class Router{
	constructor() {
		this.listen();
	}

	start() {
		let path = window.location.pathname.split('?');
		let queryObj = util.query(path[1]);

		let currentState = this.decode(path[0]);

		if(currentState) {
			this.current = currentState;
			this.go(currentState.stateName, queryObj, {
				url: currentState.url, // compile url through params
				silence: true,
			});
		}
		return this;
	}

	decode(path) {
		let paramsObj = {};
		let states = stateArr.filter(state => {
			var arr = state.regexp.exec(path);
			if(arr !== null) {
				let i = 1;
				// 只能用index来匹配tokens和execs，是不是不太科学？
				state.tokens.forEach(function(item, index) {
					if(item instanceof Object && 'pattern' in item) {
						let reg = new RegExp(item.pattern);
						var value = arr[i++];
						if(reg.test(value)) {
							paramsObj[item.name] = decodeURIComponent(value);
						}
					}
				})
				return true;
			} else {
				return false;
			}
		});
		this.paramsObj = paramsObj;
		return states[0];
	}

	add(routerName, opts = throwException()) {
		let state = new State(routerName, opts.url, {
			enter: opts.enter,
			leave: opts.leave,
		});
		stateArr.push(state);
		return this;
	}

	listen() {
		/* notice: pushState or replaceState won't trigger popstate event */
		window.addEventListener('popstate', event => {
			this.previous = this.current;
			this.current = this.queryStateByName(event.state.stateName);
			this.current.enter.call(this, event.state);
		}, false)
	}

	go(stateName, stateParams, params) {
		var params = Object.assign({}, {stateName}, params);
		params.url = pathToRegexp.compile(params.url)(this.paramsObj);

		_history.on(params);
		this.previous = this.current;
		this.current.leave && this.current.leave();
		this.current = this.queryStateByName(stateName);

		this.current.cb.enter(params);
		events.emit('routerChange', params);
	}

	queryStateByName(stateName) {
		return stateArr.filter(state => stateName === state.stateName)[0];
	}

	routerChange(fn) {
		events.on('routerChange', fn);
	}

	reload() {
		this.current.reload();
	}

	destory(stateName) {
		let state = this.queryStateByName(stateName);
		let index = stateArr.indexOf(state);
		if(index !== -1) stateArr.splice(index, 1); // eslint-disable-line
		return this;
	}
}


const router = new Router();
export default router;