module.exports = {
  root: true,  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找配置文件。
  // extends: 'airbnb-base',
  extends: ['eslint:recommended'],  // 配置代码检查风格
  // extends: ['eslint:recommended', 'angular'],  // 配置代码检查风格
  // add your custom rules here
  'rules': {
    // allow

    // 不允许console.log
    'no-console': 0,
    // 不允许多余的分号
    'no-extra-semi': 0,
    // 禁止在正则表达式中使用控制字符 ：new RegExp("\x1f")
    "no-control-regex": 0,
    'no-div-regex': 0,


    // warning
    'valid-jsdoc': 1,
    'guard-for-in': 1,



    // disabled
    // 不允许定义了但未使用的变量
    "no-unused-vars": 2,
    'block-scoped-var': 2,
    // 指定代码复杂度
    "complexity": ["error", { "max": 5 }],

    'accessor-pairs': 2,
    'array-callback-return': 2,
    'block-scoped-var': 2,
    'default-case': 2,
    'dot-notation': 2,
    'no-eq-null': 2,
    'no-extra-bind': 2,
    'no-fallthrough': 2,
    'eqeqeq': 2,
    'no-else-return': 2,
    'no-magic-numbers': 2,
    'valid-typeof': 2,
    'no-implicit-globals': 2,
    'no-floating-decimal': 2,
    'max-params': ["error", { "max": 4 }],
  },

  "env": {
    "browser": true,  //  browser 全局变量, 解决window变量报错的问题
    "node": true,
    "phantomjs": true,
    "protractor": true,
    "jasmine": true,  // 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。
    "es6": false  // 支持除了modules所有 ECMAScript 6 特性。
  },
}
