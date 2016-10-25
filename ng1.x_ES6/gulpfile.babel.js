'use strict';
require("babel-register");
import gulp from 'gulp';
import webpack from 'webpack';
import path from 'path';
import sync from 'run-sequence';
import rename from 'gulp-rename';
import template from 'gulp-template';
import fs from 'fs';
import yargs from 'yargs';
import lodash from 'lodash';
import gutil from 'gulp-util';
import serve from 'browser-sync';
import del from 'del';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';

let root = 'client';
let proRoot = 'dist';

// helper method for resolving paths
let resolveToApp = (glob = '') => {
    return path.join(root, './', glob); // app/{glob}
};

let resolveToComponents = (glob = '') => {
    return path.join(root, './modules', glob); // app/modules/{glob}
};

// map of all paths
let paths = {
    js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
    less: resolveToApp('**/*.less'), // stylesheets
    html: [
        resolveToApp('**/*.html'),
        path.join(root, 'index.html')
    ],
    entry: [
        'babel-polyfill',
        path.join(__dirname, root, './app.js')
    ],
    output: root,
    blankTemplates: path.join(__dirname, 'generator', 'templateModule/**/*.**'),
    dest: path.join(__dirname, 'dist')
};

// 生产环境编译
gulp.task('build', ['clean'], (cb) => {
    const config = require('./webpack.dist.config');
    config.entry.app = paths.entry;

    // run webpack
    webpack(config, (err, stats) => {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        gutil.log("[webpack]", stats.toString({
            // output options
            colors: colorsSupported,
            chunks: false,
            errorDetails: true
        }));

        // 启动一个服务来查看build的资源
        serve({
            port: process.env.PORT || 8801,
            open: true,
            server: {
                baseDir: proRoot
            },
            middleware: [
                // 用于匹配资源，将所有路由重定向到index.htm
                historyApiFallback()
            ]
        });

        cb();
    });
});
// 启动开发环境
gulp.task('serve', () => {
    const config = require('./webpack.dev.config');
    config.entry.app = [
        // This allows you to add hot reloading into an existing server without webpack-dev-server
        'webpack-hot-middleware/client?reload=true',
        // application entry point
    ].concat(paths.entry);

    console.log(config.entry)
    var compiler = webpack(config);

    serve({
        port: process.env.PORT || 3000,
        open: false,
        server: {
            baseDir: root
        },
        middleware: [
            // 用于匹配资源，将所有路由重定向到index.htm
            historyApiFallback(),
            // No files are written to disk, it handle the files in memory
            webpackDevMiddleware(compiler, {
                stats: {
                    colors: colorsSupported,
                    chunks: false,
                    modules: false
                },
                publicPath: config.output.publicPath
            }),
            // This allows you to add hot reloading into an existing server without webpack-dev-server
            webpackHotMiddleware(compiler)
        ]
    });
});

gulp.task('watch', ['serve']);


// 自动生成新的文件模板
// 包括*.ctrl.js, *.html, *.spec.js, *.less
// usage: gulp module --name 'moduleName' --parent 'parentPath'
gulp.task('module', () => {
    // 首字母大写
    const cap = (val) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    };

    // yargs用于获取启动参数
    const name = yargs.argv.name;
    const parentPath = yargs.argv.parent || '';
    console.log(name, parentPath);
    const destPath = path.join(resolveToComponents(), parentPath, name);

    return gulp.src(paths.blankTemplates)
        .pipe(template({
            name: name,
            upCaseName: cap(name)
        }))
        .pipe(rename((path) => {
            path.basename = path.basename.replace('temp', name);
        }))
        .pipe(gulp.dest(destPath));
});

// 每次bulid之前清除之前的dist目录
gulp.task('clean', (cb) => {
    del([paths.dest]).then(function(paths) {
        gutil.log("[clean]", paths);
        cb();
    })
});

gulp.task('default', ['watch']);