module.exports = {
  root: true,  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找配置文件。
  parser: 'babel-eslint',
  parserOptions: {
    // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    sourceType: 'module'
  },
  extends: ['eslint:recommended'],  // 配置代码检查风格
  // extends: ['eslint:recommended', 'angular'],  // 配置代码检查风格
  // extends: ['airbnb-base', 'angular'],
  extends: 'airbnb-base',
  'rules': {
    // add your custom rules here

    ///////////
    // allow //
    ///////////
    'no-console': 0, // 不允许console.log
    'comma-dangle': 0,
    'no-extra-semi': 0, // 不允许多余的分号
    'linebreak-style': 0, // 强制使用一致的换行符风格
    'semi': 0, // 要求或禁止使用分号而不是 ASI
    "no-control-regex": 0, // 禁止在正则表达式中使用控制字符 ：new RegExp("\x1f")
    'no-div-regex': 0,
    'no-param-reassign': 0, // 不允许对 function 的参数进行重新赋值
    'no-undefined':　0, // 禁止将 undefined 作为标识符
    'computed-property-spacing': 0, // 强制在计算的属性的方括号中使用一致的空格
    'eol-last': 0, // 强制文件末尾至少保留一行空行
    'consistent-this': 0,  // 当获取当前执行环境的上下文时，强制使用一致的命名
    'func-names': 0, // 强制使用命名的 function 表达式
    'no-multiple-empty-lines': 0, // 不允许多个空行
    'keyword-spacing': 0,
    /////////////
    // warning //
    /////////////

    'valid-jsdoc': 1, // 强制使用有效的 JSDoc 注释
    'guard-for-in': 1, // 要求 for-in 循环中有一个 if 语句
    'no-alert': 1, // 禁用 alert、confirm 和 prompt
    'no-extend-native': 1, // 禁止扩展原生类型
    'no-implicit-coercion': 1, // 禁止使用短符号进行类型转换
    'no-multi-spaces': 1, // 禁止使用多个空格
    'no-new-wrappers': 1, // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-proto': 1, // 禁用 proto 操作符
    'no-void': 1, // 禁用 void 操作符
    'vars-on-top': 1, // 要求所有的 var 声明出现在它们所在的作用域顶部
    'no-shadow': 1, // 禁止 var 声明 与外层作用域的变量同名
    'no-undef-init': 1 , // 禁止将变量初始化为 undefined
    'no-use-before-define': 1, // 不允许在变量定义之前使用它们(更好的与let和const接轨)
    'brace-style': ["error", "1tbs",  { "allowSingleLine": true }], // one true brace style 大括号风格要求
    'comma-spacing': 1, // 强制在逗号前后使用一致的空格
    'comma-style': 1, // 强制使用一致的逗号风格
    'id-length': [1, {'min': 2, 'max': 15}],  // 强制标识符的最新和最大长度
    'indent': [1, 4], // 强制使用一致的缩进 (默认为4个空格)
    'new-parens': 1, // 要求调用无参构造函数时有圆括号
    'newline-per-chained-call': 1, // 要求方法链中每个调用都有一个换行符
    'no-array-constructor': 1, // 禁止使用 Array 构造函数
    'no-mixed-operators': 1, // 禁止混合使用不同的操作符
    'no-negated-condition': 1, // 不允许否定的表达式
    'no-nested-ternary': 1, // 不允许使用嵌套的三元表达式
    'no-new-object': 1,
    'no-spaced-func': 1, // 禁止 function 标识符和括号之间出现空格
    'require-jsdoc': 1, // 要求使用 JSDoc 注释
    'space-infix-ops': 1, // 要求操作符周围有空格


    //////////////
    // disabled //
    //////////////
    "no-unused-vars": 2, // 不允许定义了但未使用的变量
    'block-scoped-var': 2,
    'accessor-pairs': 2,  // 强制 getter 和 setter 在对象中成对出现
    'array-callback-return': 2, // 强制数组方法的回调函数中有 return 语句
    'block-scoped-var': 2, // 强制把变量的使用限制在其定义的作用域范围内(当移植到es6时，则可以直接用let全局替换var)
    "complexity": ["error", { "max": 10 }],  // 指定程序中允许的最大环路复杂度
    'consistent-return': 2, // 要求 return 语句要么总是指定返回的值，要么不指定
    'default-case': 2, // 要求 switch 语句中有 default 分支
    'dot-notation': 2, // 强制在任何允许的时候使用点号
    'eqeqeq': 2, // 要求使用 === 和 !==
    'no-caller': 2, // 禁用 arguments.caller 或 arguments.callee
    'no-case-declarations': 2, // 不允许在 case 子句中使用词法声明
    'no-else-return': 2, // 禁止 if 语句中有 return 之后有 else
    'no-empty-function': 2, // 禁止出现空函数
    'no-eq-null': 2, // 禁止在没有类型检查操作符的情况下与 null 进行比较
    'no-eval': 2,
    'no-extra-bind': 2, // 禁止不必要的 .bind() 调用
    'no-fallthrough': 2, // 禁止 case 语句落空
    'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾小数点
    'no-implicit-globals': 2, // 禁止在全局范围内使用 var 和命名的 function 声明
    'no-invalid-this': 2, //  禁止 this 关键字出现在类和类对象之外
    'no-lone-blocks': 2, // 禁用不必要的嵌套块
    'no-loop-func': 2, // 禁止在循环中出现 function 声明和表达式
    'no-magic-numbers': 2, // 禁用魔术数字(去除硬编码)
    'no-multi-str': 2, // 禁止使用多行字符串(like \)
    'no-native-reassign': 2, // 禁止对原生对象赋值
    'no-new': 2, // 禁止在非赋值或条件语句中使用 new 操作符
    'no-new-func': 2, // 禁止对 Function 对象使用 new 操作符
    'no-redeclare': 2, // 禁止使用 var 多次声明同一变量
    'no-return-assign': 2, // 禁止在 return 语句中使用赋值语句

    'no-self-compare': 2, // 禁止自身比较
    'no-throw-literal': 2, // 禁止抛出非异常字面量
    'no-unused-expressions': 2, // 禁止出现未使用过的表达式
    'no-useless-call': 2, // 禁止不必要的 .call() 和 .apply()
    'no-useless-concat': 2, // 禁止不必要的字符串字面量或模板字面量的连接
    'no-with': 2, // 禁用 with 语句
    'wrap-iife': 2, // 要求 IIFE 使用括号括起来
    'yoda': 2, // 要求或禁止 “Yoda” 条件
    'strict': 2, // 要求使用严格模式
    'no-shadow-restricted-names': 2, // 禁止覆盖受限制的标识符
    'no-undef': 2, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    'no-unused-vars': 2, // 禁止出现未使用过的变量



    // 代码风格指南
    'camelcase': 2, // 强制使用骆驼拼写法命名约定
    'max-depth': 2, // 强制可嵌套的块的最大深度(4)
    'max-len': 2, // 强制一行的最大长度(80)
    'max-nested-callbacks': ["error", { "max": 3 }], // 强制回调函数最大嵌套深度
    'valid-typeof': 2, // 强制 typeof 表达式与有效的字符串进行比较
    'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾小数点
    'max-params': ["error", { "max": 4 }], // 强制 function 定义中最多允许的参数数量
    'max-statements': ["error", { "max": 30 }], // 强制 function 块最多允许的的语句数量
    'new-cap': 2, // 要求构造函数首字母大写
    'no-bitwise': 2, // 禁用按位运算符
    'no-unneeded-ternary': 2, // 禁止可以在有更简单的可替代的表达式时使用三元操作符
    'operator-assignment': 2, // 要求或禁止在可能的情况下要求使用简化的赋值操作符(默认为要求)

  },

  "env": {
    "browser": true,  //  browser 全局变量, 解决window变量报错的问题
    "node": true,
    "phantomjs": true,
    "protractor": true,
    "jasmine": true,  // 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。
    "es6": true  // 支持除了modules所有 ECMAScript 6 特性。
  },
}
