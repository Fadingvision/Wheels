'use strict';
require("babel-register");

import gulp from 'gulp';
import gulpIf from 'gulp-if';
import eslint from 'gulp-eslint';
import friendlyFormatter from 'eslint-friendly-formatter';
import path from 'path';

const filePath = {
	srcPath: path.join(__dirname, './build_your_own_promise/src/promise.js'),
	distPath: path.join(__dirname, './build_your_own_promise/dist/*.js'),
}

gulp.task('lint', () => {
    let isFixed = (file) => {
        return file.eslint != null && file.eslint.fixed;
    }

	const stream = gulp
        .src(filePath.srcPath)
        .pipe(eslint({fix: true}))
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

gulp.task('default', ['lint', 'watch'], function() {

});
