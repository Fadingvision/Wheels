const _history = {
	on(params) {
		// window[(params && (params.silence || params.replace)) ? 'relpaceState' : 'pushState'](params, null, params.url);
		var method = (params && params.silence) ? 'replaceState' : 'pushState';
		window.history[method](params, null, params.url);

	}
}

export default _history;