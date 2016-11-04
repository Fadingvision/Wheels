'use strict';
require("babel-register");

import gulp from 'gulp';
import eslint from 'gulp-eslint';
import friendlyFormatter from 'eslint-friendly-formatter';
import path from 'path';

const filePath = {
	srcPath: path.join(__dirname, './build_your_own_promise/src/*.js'),
	distPath: path.join(__dirname, './build_your_own_promise/dist/*.js'),
}
gulp.task('lint', () => {
	const stream = gulp
        .src(filePath.srcPath)
        .pipe(eslint())
        .pipe(eslint.format(friendlyFormatter))
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
