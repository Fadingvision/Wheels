// Karma configuration
// Generated on Tue Sep 20 2016 15:01:18 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    // 需要测试的文件与测试文件
    files: [
      'ES5-shims/src/es5-shim.js',
      'ES5-shims/test/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    
    // 配置预处理器
    // 为添加的文件添加覆盖率打点
    // preprocessors: {},
    preprocessors : {'ES5-shims/src/es5-shim.js': 'coverage'},

    


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    
    // reporters: ['progress'],
    // 报告器
    reporters: ['progress','coverage'],

    // coverageReporter: {
    //     type : 'html',
    //     dir : 'coverage/'
    // },

    // 覆盖率报告格式
    coverageReporter: {
        dir : './coverage',
        reporters : [
        {
            type : 'html',
            subdir : 'report-html'
        },
        {
            type : 'lcov',
            subdir : 'report-lcov'
        },{
            type : 'text',
            subdir : 'text.txt'
        },{
            type : 'text-summary',
            subdir : 'text-summary.txt'
        }]
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['PhantomJS', 'Chrome'],
    
    // 需要测试的浏览器
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
