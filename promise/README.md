## about Promise

#### Issues
1. ��������⣬ʵ�ֵ�ԭ��
2. ��ͬpromise��ʵ��֮��Ľ�����resolvePromise������ʵ�ֺ��÷���--- ��̫����
3. ԭ���ϣ�promise.then(onResolved, onRejected)��������ຯ����Ҫ�첽����,��then�Ĳ����첽ִ��
    ��setTimeout(fn, 0)�ĺ�����÷��� --- ��̫����
4. promise��׼�Ĳ��ԣ�eslint���﷨�����޸�
5. promise���Ĵ�����
6. promise.race, .all, ��������ط�����ʵ�֣�����then������
7. ������ţ�Ƶ�ʵ�֣�q, bluebird, $q, $.defer���ĶԱȺ�ѧϰ
8. promise �ķ�ģʽ
----------------


#### һ����������⣬ʵ�ֵ�ԭ��

���������ڱ�дһ�������������㲻�����Ϸ���ֵ�������Եķ������ǽ����ص�ֵ����һ���ص�������Ϊ�����������ǽ���return������

```javascript
var oneOneSecondLater = function (callback) {
    setTimeout(function () {
        callback(1);
    }, 1000);
};
```
����һ���ܼ򵥵Ľ�����������Ǵ��ںܶ����⡣

һ������ͨ�İ취�Ǵ���һ���ص������Լ�һ�������������Է��ص�ֵ�Լ����ܳ��ֵĴ�����д���
```js
var maybeOneOneSecondLater = function (callback, errback) {
    setTimeout(function () {
        if (Math.random() < .5) {
            callback(1);
        } else {
            errback(new Error("Can't provide one."));
        }
    }, 1000);
};
```

Ȼ��,��Щ����ʵ��ģ���׳��쳣���쳣��try / catch���Ŀ�����Ƴ���ʽ������쳣,ֱ�����򷵻�һ��ֵ����ͼ�ָ���������ġ���Ҫ��һЩ��ʽ�����쳣�Ļ�����������û�б�������쳣�������Pormise.


```javascript
var maybeOneOneSecondLater = function () {
    var callback;
    setTimeout(function () {
        callback(1);
    }, 1000);
    return {
        then: function (_callback) {
            callback = _callback;
        }
    };
};

maybeOneOneSecondLater().then(callback);
```
����ģ��һ����then�����Ķ�����ģ��promise,Ŀ����Ϊ���Ƴٻص�������ע�ᣬ������������������⣺

1�� ֻ�������һ��callbackȥ���ܷ��ص�value, ����и����callback����ȥ�������ֵ����ô������󽫻�����á�
2���������ص�������ע��ʱ�䳬����1�룬��ô���Promise����ʧ�ܵģ���Ϊcallback������ִ�С�

һ�����ձ�Ľ���취������κ������Ļص�����������ע��֮ǰ��֮��ʱ,����һ����˵,����¼������ǿ���ͨ����Promise���һ��ӵ������״̬�Ķ�����ʵ����һ�㡣

```js
var maybeOneOneSecondLater = function () {
    var pending = [], value;
    setTimeout(function () {
        value = 1;
        for (var i = 0, ii = pending.length; i < ii; i++) {
            var callback = pending[i];
            callback(value);
        }
        pending = undefined;
    }, 1000);
    return {
        then: function (callback) {
            if (pending) {
                pending.push(callback);
            } else {
                callback(value);
            }
        }
    };
};

```
������ĺ��������ı䣬��promise���߼����������첽���������߼��ֿ����Ӷ��߼����Ի��ֵĸ�������ͬʱdefer����Ҳ���Խ��и��ã��õ������һ��ͨ�õ�defer���󣬿�����then����ӻص���������resolve������������Ļص�����ִ�У���������Ӧ��������Ҫ�ص��������ܵĲ���valueֵ��

```js
var defer = function () {
    var pending = [], value;
    return {
        resolve: function (_value) {
            value = _value;
            for (var i = 0, ii = pending.length; i < ii; i++) {
                var callback = pending[i];
                callback(value);
            }
            pending = undefined;
        },
        then: function (callback) {
            if (pending) {
                pending.push(callback);
            } else {
                callback(value);
            }
        }
    }
};
// ���ʹ��defer����
var oneOneSecondLater = function () {
    var result = defer();
    setTimeout(function () {
        result.resolve(1);
    }, 1000);
    return result;
};

oneOneSecondLater().then(callback);

```
�����resolve�����е�ȱ�ݣ����������ִ�ж�β��ı�promise��״̬���޸�һ��, ���ڶ��ε���resolve��ʱ���׳�һ������

```js
if (pending) {
    value = _value;
    for (var i = 0, ii = pending.length; i < ii; i++) {
        var callback = pending[i];
        callback(value);
    }
    pending = undefined;
} else {
    throw new Error("A promise can only be resolved once.");
}
```

��promise��resolve�з������������������ѭ��һְ��ı��ԭ��promiseֻ�����ؽ����״̬����resolve��������������ִ�С�
���ַ����Ȼ������������ջ��Ƶĸ�����

```js
var Promise = function () {
};

var isPromise = function (value) {
    return value instanceof Promise;
};

var defer = function () {
    var pending = [], value;
    var promise = new Promise();
    promise.then = function (callback) {
        if (pending) {
            pending.push(callback);
        } else {
            callback(value);
        }
    };
    return {
        resolve: function (_value) {
            if (pending) {
                value = _value;
                for (var i = 0, ii = pending.length; i < ii; i++) {
                    var callback = pending[i];
                    callback(value);
                }
                pending = undefined;
            }
        },
        promise: promise
    };
};
```
��һ���ǽ������promise���õ����⣬����һ�£��и�������ִ���������������첽�����ķ���ֵ���ûص�������������ʵ�֣�

```js
var twoOneSecondLater = function (callback) {
    var a, b;
    var consider = function () {
        if (a === undefined || b === undefined)
            return;
        callback(a + b);
    };
    oneOneSecondLater(function (_a) {
        a = _a;
        consider();
    });
    oneOneSecondLater(function (_b) {
        b = _b;
        consider();
    });
};

twoOneSecondLater(function (c) {
    // c === 2
});
```
���ַ�ʽ�����Ե�ȱ�㣺consider������Ҫ���䱻ʹ��֮ǰ��ʽ��������

����promise��ʵ���£�����ֻ��Ҫ���д���Ϳ������ɵ�ʵ�����Ч����

```js

var a = oneOneSecondLater();
var b = oneOneSecondLater();
var c = a.then(function (a) {
    return b.then(function (b) {
        var c = a + b;
        return c;
    });
});
```
Ϊ������Ĵ����ܹ������Ĺ�����������Ҫ��һ�¼����£�
1. then�������뷵��һ��Promise��
2. ���ص�promise�����ܹ����ص������ķ���ֵresolve
3. �ص������ķ���ֵ������һ������ĳ���ֵ������һ��pormise����

#### ������ͬpromise֮��Ľ�����̣�Ϊ�˼��ݲ�ͬ��promise��׼ʵ�ֻ��߼���һЩ��promise�Ĵ����÷�����





Promise �������

Promise ���������һ������Ĳ�������������һ�� promise ��һ��ֵ�����Ǳ�ʾΪ [[Resolve]](promise, x)����� x �� then �����ҿ���ȥ��һ�� Promise ��������򼴳���ʹ promise ���� x ��״̬���������� x ��ֵ��ִ�� promise ��

���� thenable ������ʹ�� Promise ��ʵ�ָ�����ͨ���ԣ�ֻҪ�䱩¶��һ����ѭ Promise/A+ Э��� then �������ɣ���ͬʱҲʹ��ѭ Promise/A+ �淶��ʵ�ֿ�������Щ��̫�淶�����õ�ʵ�������ù��档

���� [[Resolve]](promise, x) ����ѭ���²��裺

x �� promise ���

��� promise �� x ָ��ͬһ������ TypeError Ϊ����ܾ�ִ�� promise

x Ϊ Promise

��� x Ϊ Promise ����ʹ promise ���� x ��״̬ ע4��

��� x ���ڵȴ�̬�� promise �豣��Ϊ�ȴ�ֱ̬�� x ��ִ�л�ܾ�
��� x ����ִ��̬������ͬ��ִֵ�� promise
��� x ���ھܾ�̬������ͬ�ľ���ܾ� promise
x Ϊ�������

��� x Ϊ������ߺ�����

�� x.then ��ֵ�� then ע5
���ȡ x.then ��ֵʱ�׳����� e ������ e Ϊ����ܾ� promise

��� then �Ǻ������� x ��Ϊ������������ this ����֮�����������ص�������Ϊ��������һ���������� resolvePromise ���ڶ����������� rejectPromise:

��� resolvePromise ��ֵ y Ϊ���������ã������� [[Resolve]](promise, y)

��� rejectPromise �Ծ��� r Ϊ���������ã����Ծ��� r �ܾ� promise

��� resolvePromise �� rejectPromise �������ã����߱�ͬһ���������˶�Σ������Ȳ����״ε��ò�����ʣ�µĵ���

������� then �����׳����쳣 e��

��� resolvePromise �� rejectPromise �Ѿ������ã������֮
������ e Ϊ����ܾ� promise

��� then ���Ǻ������� x Ϊ����ִ�� promise
��� x ��Ϊ������ߺ������� x Ϊ����ִ�� promise

���һ�� promise ��һ��ѭ���� thenable ���еĶ��������� [[Resolve]](promise, thenable) �ĵݹ�������ʹ���䱻�ٴε��ã������������㷨�����������޵ݹ�֮�С��㷨�䲻ǿ��Ҫ�󣬵�Ҳ����ʩ�߼�������ĵݹ��Ƿ���ڣ�����⵽��������һ����ʶ��� TypeError Ϊ�������ܾ� promise ע6��


**reference��**

[Promises/A+�淶(����)](http://example.com/)

[Promises/A+�淶(Ӣ��)](https://promisesaplus.com/)


#### setTimeout(fn, 0)������

ȷ���ص�������������ע���ʱ��˳��ȥִ�У���������˿������첽��̵Ĺ���Σ������������һ���򵥵�����:

```js
var blah = function () {
    var result = foob().then(function () {
        return barf();
    });
    var barf = function () {
        return 10;
    };
    return result;
};
```

�ú������׳�һ���쳣�򷵻�һ����10�����promise, ��ȡ����foob()�����ͬһ���¼�ѭ��(�����������ص���ͬһ��ջ)����δ��������ص����Ƴٵ�δ��,����һֱ�ɹ���

#### ����setTimeout(fn, 0);

js�����ǻ��ڵ��̵߳ģ���ζ��һ�δ���ִ��ʱ���������뽫������еȴ���һ���߳��п��о�ִ�к������롣����������趨��һ��setTimeout����ô���������ں��ʵ�ʱ�䣬���������������У�������ʱ����Ϊ 0���ʹ�������������У�������������ִ�У���ȻҪ�ȴ�ǰ�����ִ����ϣ���ʵ�и���ʱ��������16ms����4msȡ�����������������setTimeout �����ܱ�ִ֤�е�ʱ�䣬�Ƿ�ʱִ��ȡ���� JavaScript �߳���ӵ�����ǿ��С�


```html
<input type="text" ng-model="name" ng-keydown="showName()">
<span ng-bind="name"></span>
```

```js
var app = angular.module('App', []);
app.controller('myContrl', function($scope, $window) {
    $scope.name = '123';
    $scope.showName = function() {
        $window.setTimeout(function() {
            console.log($scope.name);
        }, 0);
    };
})
```
������keydown�¼��У�js������Ҫ��ȥִ��keydown���¼���Ȼ����ȥ����input�е�valueֵ��
��͵��������޷���ʱ��ȡ��������С�׼ȷ����valueֵ����������setTimeout(fn, 0)��ȡֵ�Ĳ������뵽��ǰִ�ж��е���󣬵ȴ�value��ֵ����֮��������ȥ����ȡֵ�Ĳ������Ϳ���ȡ��׼ȷ��ֵ�ˡ�