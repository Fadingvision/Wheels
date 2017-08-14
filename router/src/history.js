const _history = {
	on(params) {
		var method = (params && params.silence) ? 'replaceState' : 'pushState';
		window.history[method](params, null, params.url);

	}
}

export default _history;