"use strict";

var gulp = require('gulp'),
	less = require('gulp-less'),
	prefixer = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	useref = require('gulp-useref'),
	clean = require('gulp-clean'),
	minifyCss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	wiredep = require('wiredep').stream,
	gulpif = require('gulp-if'),
	sftp = require('gulp-sftp'),	
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	del = require('del'),
	clean = require('gulp-clean'),
	rimraf = require('rimraf'),
	cssnano = require('gulp-cssnano'),		
	reload = browserSync.reload;

	// clean

	gulp.task('clean', function () {
         return del.sync('dist');               
});

	// SFTP

// 	gulp.task('default', function () {
//     return gulp.src('dist/**/*')
//         .pipe(sftp({
//             host: 'website.com',
//             user: 'johndoe',
//             pass: '1234'
//             remotePath: '#'
//         }));
// });


	// less
	gulp.task('less', function () {
  	 gulp.src('./app/less/*.less')
    .pipe(less())
    .pipe(prefixer('last 15 version', '> 1%', 'ie 8'), {cascade: true})
    .pipe(reload({stream: true}))    
    .pipe(gulp.dest('app/css'));
});
	// bower

	gulp.task('bower', function () {
	  gulp.src('./app/index.html')
	    .pipe(wiredep({
	      directory : "./app/libs"	      
	    }))
	    .pipe(gulp.dest('./app/'));
	    	});

	// build

	gulp.task('build', ['clean', 'img'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))        
        .pipe(gulp.dest('./dist'));
});

// 	gulp.task('default', function () {
//     return gulp.src('css/style.css')
//         .pipe(uncss({
//             html: ['./app/index.html']
//         }))
//         .pipe(gulp.dest('./app/css'));
// });
	
	// Images

	gulp.task('img', function() {
	    return gulp.src('./app/img/**/*')
	        .pipe(imagemin({
	        	interlaced: true,
	        	progressive: true,
	        	svgPlagins: [{removeViewBox: false}],
	        	use: [pngquant()]
	        })) 	        
	        .pipe(gulp.dest('dist/img'));
});


	// browser-reload

	gulp.task('browserSync', function() {
		browserSync({
			server: {
				baseDir: "app"
			},
			notify: false
		});
});

	gulp.task('watch', ['browserSync', 'less'], function() {
		gulp.watch('./app/less/**/*.less', ['less']);		
		gulp.watch('./app/*.html', reload);
		gulp.watch('./app/js/**/*.js', reload)
		gulp.watch('bower.json', ['bower']);

});


	gulp.task('default', ['build', 'browserSync', 'watch']);
