const is = {
    object(object) {
        return Object.prototype.toString.call(object) ===
            '[object Object]';
    }
}

export default class Observer {
    constructor(conf) {
        this.data = conf.data;
        this._watchers = [];
        this.observeData(conf.data);
    }

    observeData(data) {
        Object.keys(data).forEach(key => {
            let tempValue = data[key]

            // in case data is deep object
            if (is.object(tempValue)) {
                this.observeData(tempValue)
            }

            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                set: (newVal) => {
                    if (newVal === tempValue) return;

                    // keep tracking the new value if it's object
                    if (is.object(newVal)) {
                        this.observeData(newVal)
                    }

                    console.log(
                        `你设置了${key},新的值为${newVal}`); // eslint-disable-line

                    this.callWatchers(data, key, newVal,
                        tempValue);

                    tempValue = newVal;
                },

                get: () => {
                    console.log(`你访问了${key}`) // eslint-disable-line
                    return tempValue
                }

            })
        })
    }

    $watch(expression, cb) {
        // generate the unique id
        let id = setTimeout(() => {});

        // add wathcer
        this._watchers.push({
            expression,
            cb,
            id,
            active: true,
                vm: this,
                value: this.$parse(expression).reduce((initialValue,
                        key) =>
                    initialValue[key], this.data)
        });

        // cancel the current watcher
        return () => {
            for (var i = 0, l = this._watchers.length; i < l; i++) {
                if (watcher.id === id) {
                    this._watchers.splice(i, 1);
                    return;
                }
            }
        };
    }


    callWatchers(data, key, newVal, oldVal) {
        ////////////////////////////////////////////////////////////////////////////////////
        // * how to check whether the watching expression's in this.data ?                //
        // * it seems a little bit diffcult, cos it need a parser to parse the expression //
        ////////////////////////////////////////////////////////////////////////////////////

        /**
         watching the value and invoke the callback when it's changed.
         @todo: for now we can only track the one depth expression,
         watch.js is depend on level, it looks like not so good.
         */
        this._watchers.forEach((watcher) => {
            if ((watcher.active &&
                    key === watcher.expression) ||

                // watch sub properties
                (this.data[watcher.expression] &&
                    data === this.data[watcher.expression])
            ) {
                watcher.cb(newVal, oldVal);
            }
        })

    }

    $parse(expression) {
        return expression.split('.')
    }

}
