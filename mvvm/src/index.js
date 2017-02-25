import Observer from './Observer';

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

// 要实现的结果如下：
app1.name // 你访问了 name
app1.age = 100; // 你设置了 age，新的值为100
app2.university // 你访问了 university
app2.major = 'science' // 你设置了 major，新的值为 science