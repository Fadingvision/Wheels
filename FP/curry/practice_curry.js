const _ = require('lodash');


function add(a, b) {
    return a + b;

}
let curried_add = _.curry(add);
console.log(curried_add(1)(2));
