module.exports = {
  root: true,  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找配置文件。
  parser: 'babel-eslint',
  parserOptions: {
    // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    sourceType: 'module'
  },
  // extends: 'airbnb-base',
  extends: 'eslint:recommended',  // 配置代码检查风格
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // fix the unused import variable error
    "no-unused-vars": 0,

    // 取消缩进的报错
    'indent' : 0,
    'import/no-unresolved': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
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
