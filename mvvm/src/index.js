// import Observer from './Observer';

// let app1 = new Observer({
//     data: {
//         name: 'youngwind',
//         age: 25
//     }
// });

// let app2 = new Observer({
//     data: {
//         university: 'bupt',
//         major: 'computer'
//     }
// });

// // 要实现的结果如下：
// app1.data.name // 你访问了 name
// app1.data.age = 100; // 你设置了 age，新的值为100
// app2.data.university // 你访问了 university
// app2.data.major = 'science' // 你设置了 major，新的值为 science


import Observer from './Observer_v2';

let app1 = new Observer({
    data: {
        name: 'youngwind',
        age: 25
    }
});

let app2 = new Observer({
    data: {
        university: 'bupt',
        major: 'computer'
    }
});

app1.$watch('name', function(newVal, oldVal) {
    console.log(`我的名字变了，原来是${oldVal}，现在已经是：${newVal}了`)
});

app1.data.name = {
    lastName: 'liang',
    firstName: 'shaofeng'
};
app1.data.name.lastName = 'hahaha';
// 这里还需要输出 '你访问了 lastName '
app1.data.name.firstName = 'lalala';
// 这里还需要输出 '你设置了firstName, 新的值为 lalala'




// 你需要实现 $watch 这个 API
app1.$watch('age', function(newVal, oldVal) {
    console.log(`我的年纪变了，原来是${oldVal}岁，现在已经是：${newVal}岁了`)
});

app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'