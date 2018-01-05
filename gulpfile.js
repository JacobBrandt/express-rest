const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const nodemon = require('gulp-nodemon');
const del = require('del');
const typescriptConfig = require('./tsconfig.json');

/**
 * Starts the node server; will remove previously compiled js files,
 * lint ts, and compile new js
 */
gulp.task('server', ['compile'], function() {
  nodemon({
    script: 'dist/server.js',
    watch: [ 'src/**/*.ts', 'express-rest' ],
    ext: 'ts',
    ignore: 'src/test/**/*.ts',
    env: {
      'NODE_ENV': 'development',
      'NODE_CONFIG_DIR': 'src/config'
    },
    tasks: function(changedFiles) {
      changedFiles.forEach(function (file) {
        console.log('Detected change in file: ' + file);
      });
      return ['compile'];
    }
  })
  .on('restart', function() {
    console.log('Restarting Server');
  });
});

/**
 * Run server nodejs tests and create coverage reports with istanbul
 */
gulp.task('server-test', ['pre-test'], function() {
  return gulp.src(['dist/test/**/*.js'])
    .pipe(mocha({
      reporter: 'nyan'
    }))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        statements: 50,
        functions: 50,
        lines: 50
      }
    }))
    .on('error', () => {
      process.exit(1);
    })
    .on('end', () => {
      process.exit(0);
    });
});

/**
 * Compile the js from ts files for the server. Also cleans the
 * dist directory and lints all ts (client and server)
 */
gulp.task('compile', ['clean', 'lint'], function() {
  return compile(['src/**/*.ts', '!src/test/**/*.ts'], 'dist');
});

/**
 * Compile server test code from typescript to js
 */
gulp.task('compile-test', ['clean-test', 'lint-test'], function() {
  return compile(['src/test/**/*.ts'], 'dist');
});

function compile(globArray, destDir) {
  var stream = gulp.src(globArray, {follow: true})
    .pipe(sourcemaps.init())
    .pipe(typescript(typescriptConfig.compilerOptions))
    .pipe(sourcemaps.write(".", {
      mapSources: (path) => {
        return path;
        //if (destDir.indexOf("test") === -1) {
        //  return path;
        //}
        //else {
        //  return "../" + path;
        //}
      },
      sourceRoot: function(file) {
        return file.cwd + "/" + destDir;
      }}))
    .pipe(gulp.dest(destDir));
  return stream;
}

/**
 * Clean the server's dist directory that contains js files
 * compiled from ts files.
 */
gulp.task('clean', function() {
  return clean(['dist/**']);
});

/**
 * Clean the server's test dist directory that contains js files
 * compiled from ts files.
 */
gulp.task('clean-test', function() {
  return clean(['dist/test/**']);
});

function clean(globArray) {
  var stream = del(globArray, { force: true });
  return stream;
}

/**
 * lint for TypeScript files (server)
 */
gulp.task('lint', function() {
  return lint(['src/**/*.ts', '!src/test/**/*.ts']);
});

/**
 * lint for TYpescript files (test)
 */
gulp.task('lint-test', function() {
  return lint(['src/test/**/*.ts']);
});

function lint(globArray) {
  var stream = gulp.src(globArray)
    .pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report({
      summarizeFailureOutput: true,
      emitError: false
    }));
  return stream;
}

/**
 * Prep for coverage report
 */
gulp.task('pre-test', ['compile-test', 'compile'], function() {
  return gulp.src(['dist/**/*.js', '!dist/test/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});
