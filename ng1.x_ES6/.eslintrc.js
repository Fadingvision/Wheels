module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // extends: 'airbnb-base',
  extends: 'eslint:recommended',
  // required to lint *.vue files
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

  // 解决window变量报错的问题
  "env": {
    "browser": true,
    "node": true,
    "jasmine": true,
    "es6": true
  },
}
