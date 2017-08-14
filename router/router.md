## Router

-----
### timer(continually checks __location.hash__) & onHashChange & HTML5 history API(pushState, popState)



### API设计

- router.go(routerName, params, options: {
	silent: true, // will not trigger the router function
	replace: true, // relpace the current history in browser. so there won't be any new history.
})
- router.add(routerName, options: {
	url: '', (/^[-\$\w]+$/)
	enter: (stateParams) => {},
	leave: (stateParams) => {},
})
- router.is(routerName, params)
- router.reload()
- router.params
- router.current
- router.previous
- routerChangeEvent = fn(toRouter, toParams) [return false, 应该可以阻止路由跳转]

- router.destory (销毁所有的事件和监听)
