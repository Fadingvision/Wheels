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


gulp.task('lint', function() {
	gulp
		.src(filePath.srcPath)
		.pipe(eslint())
		.pipe(format(friendlyFormatter))
		.pipe(filePath.distPath)
});

gulp.task('default', ['lint'], function() {

});
