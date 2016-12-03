import fetchs from './fetch/src/fetch';


var fe = fetchs('https://www.baidu.com', {
    method: 'POST'
});
console.log(fe);