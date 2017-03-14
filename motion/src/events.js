const throwErr = (err) => {throw err};

class Events {
	constructor() {
		this._events = Object.create(null);
	}

	/**
	 * add listenr of event
	 * @param  {[type]} event  [description]
	 * @param  {[type]} handler [description]
	 * @return {[type]}         [description]
	 */
	on(event, handler) {
		if (Array.isArray(event)) {
			event.forEach(e => this.on(e, handler));
		} else {
			(this._events[event] || (this._events[event] = [])).push(event);
		}
		return this;
	}

	once(event, handler) {
		let fn = () => {
			this.off(event, handler);
			handler.call(this);
		}
		this.on(event, fn);
	}

	/**
	 * return all the eventNames of this instance
	 * @return {array/string} array or string
	 */
	eventNames() {
		return Object.keys(this._events);
	}

	off(event, handler) {
		// remove all listeners in all events
		if (!arguments.length) {
			this.offAll();
			return this;
		}
		// remove the specific handler of specific event
		let events = this._events[event];
		if (events && handler) {
			events.splice(events.indexOf(handler) >>> 0, 1); // eslint-disable-line
			return this;
		}
		// remove the specific event
		if (events) delete this._events[event];
		return this;
	}

	offAll() {
		this._events = Object.create(null);
		return this;
	}

	emit(event, ...params) {
		if (!this._events[event]) return false;
		try {
			this._events[event].forEach(handler => handler.apply(this, params));
		} catch (err) {
			if(!this._event.error) this.on('error', throwErr);
			this.emit('error', err);
		}
		return true;
	}
}

export default Events;