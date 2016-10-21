module.exports = function(config) {
    config.set({
        // base path used to resolve all patterns
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'chai'],

        // 把所有的文件打包到入口文件spec.bundle.js中
        files: [{
            pattern: 'spec.bundle.js',
            watched: true
        }],

        // files to exclude
        exclude: [],

        plugins: [
            // 测试框架
            require("karma-chai"),
            require("karma-jasmine"),
            // 测试平台
            require("karma-phantomjs-launcher"),
            // 报告器
            require("karma-mocha-reporter"),

            // 预处理
            require("karma-coverage"),
            require("karma-sourcemap-loader"),
            require("karma-webpack")
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // 将spec.bundle.js进行webpack打包
        preprocessors: {
            'spec.bundle.js': ['webpack', 'coverage' ]
        },


        // webpack　options
        webpack: {
            // devtool: 'inline-source-map',
            module: {
                loaders: [{
                    test: /\.js/,
                    exclude: [/app\/lib/, /node_modules/],
                    loader: 'babel'
                }, {
                    test: /\.html/,
                    loader: 'html-withimg-loader!raw'
                }, {
                    test: /\.styl$/,
                    loader: 'style!css!less'
                }, {
                    test: /\.css$/,
                    loader: 'style!css'
                }, {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url?limit=10000&name=./img/[name].[hash:7].[ext]'
                }, {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url?limit=10000&name=./fonts/[name].[hash:7].[ext]'
                }]
            }
        },

        webpackServer: {
            noInfo: true // prevent console spamming when running in Karma!
        },

        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],
        // reporter options 
        mochaReporter: {
            colors: {
                success: 'green',
                info: 'bgGreen',
                warning: 'yellow',
                error: 'red'
            },
            symbols: {
                success: '+',
                info: '#',
                warning: '!',
                error: 'x'
            }
        },
        coverageReporter: {
            dir: 'test/coverage',
            reporters: [{
                type: 'html',
                subdir: 'report-html'
            }, {
                type: 'lcov',
                subdir: 'report-lcov'
            }, {
                type: 'text',
                subdir: 'text.txt'
            }, {
                type: 'text-summary',
                subdir: 'text-summary.txt'
            }]
        },

        // web server port
        port: 9876,

        // enable colors in the output
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // toggle whether to watch files and rerun tests upon incurring changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // if true, Karma runs tests once and exits
        singleRun: false
    });
};