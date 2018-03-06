const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const minimist = require('minimist');
const cssnano = require('cssnano');
const del = require('del');
const postcssStylish = require('./lib/postcss-stylish');

const options = minimist(process.argv.slice(2));

const entries = {
  styles: {
    watch: './src/**/*.scss',
    src: ['./src/*.scss', './src/optionals/**/*.scss']
  }
};

const postcssOptions = [];

if (options.production) {
  postcssOptions.push(
    postcssStylish,
    cssnano({
      safe: true,
      core: false,
      discardComments: false
    })
  );
} else {
  postcssOptions.push(
    postcssStylish({
      isProduction: options.production,
      options: [
        {
          installKey: 'theme',
          value: require('fs').readFileSync(
            './src/optionals/theme/hatsune-miku.scss',
            'utf-8'
          )
        }
      ]
    })
  );
}

gulp.task('styles', () =>
  gulp
    .src(entries.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssOptions))
    .pipe(gulp.dest('./dist'))
);

gulp.task('watch', () =>
  Object.entries(entries).forEach(([task, path]) => {
    gulp.watch(path.watch, gulp.parallel(task));
  })
);

gulp.task('clean', () => del(['dist']));

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel(...Object.keys(entries)))
);

gulp.task('default', gulp.series('clean', 'watch'));
