const gulp = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const minimist = require('minimist');
const cssnano = require('cssnano');
const del = require('del');
const forceImportant = require('./lib/postcss-force-important');

const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development'
  }
});

const isDev = !options.production;
const isProd = options.production;

const entries = {
  styles: {
    watch: './src/**/*.scss',
    src: [
      './src/*.scss',
      './src/optionals/**/*.scss'
    ]
  }
};

const postcssOptions = [ forceImportant ];

if (isProd) {
  postcssOptions.push(
    cssnano({
      discardComments: {
        removeAll: true
      }
    })
  );
}

gulp.task('styles', () =>
  gulp.src(entries.styles.src)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssOptions))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./dist'))
);

gulp.task('watch', () =>
  Object.entries(entries).forEach(([task, path]) => {
    gulp.watch(path.watch, gulp.parallel(task));
  })
);

gulp.task('clean', () => del(['dist']));

gulp.task('build', gulp.series('clean', gulp.parallel(...Object.keys(entries))));

gulp.task('default', gulp.series('clean', 'watch'));
