'use strict';
require("babel-register");

import gulp from 'gulp';
import gulpIf from 'gulp-if';
import eslint from 'gulp-eslint';
import friendlyFormatter from 'eslint-friendly-formatter';
import path from 'path';

const filePath = {
    srcPath: path.join(__dirname, './promise/src/promise.js'),
    distPath: path.join(__dirname, './promise/dist/*.js'),
}

gulp.task('lint', () => {
    let isFixed = (file) => {
        return file.eslint != null && file.eslint.fixed;
    }

    const stream = gulp
        .src(filePath.srcPath)
        .pipe(eslint({
            fix: true
        }))
        // .pipe(gulpIf(isFixed, eslint.format(friendlyFormatter)));
        .pipe(eslint.format(friendlyFormatter));
    return stream;
});

gulp.task('watch', () => {
    var watcher = gulp.watch(filePath.srcPath, ['lint']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
})


// 由于浏览器还不支持export语法，为了有时候能在浏览器里跑跑代码，
// 所以有必要写一个 6 => 5的任务。
gulp.task('babel', () => {

});

gulp.task('default', ['lint', 'watch'], function() {

});