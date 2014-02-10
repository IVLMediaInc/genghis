var fs         = require('fs');
var path       = require('path');
var stream     = require('event-stream');
var datauri    = require('datauri');

var gulp       = require('gulp');
var bytediff   = require('gulp-bytediff');
var htmlmin    = require('gulp-htmlmin');
var livereload = require('gulp-livereload');
// var notify     = require('gulp-notify');
var rename     = require('gulp-rename');
var template   = require('gulp-template');

var server;

// Compile page templates.
gulp.task('templates', function() {
  if (!server) throw new Error('Server not set.');

  var dev = gulp.src('server/templates/{index,error}.mustache.tpl')
    .pipe(rename({ext: '.mustache'}))
    .pipe(template({
      favicon: '{{ base_url }}/img/favicon.png',
    }))
    .pipe(gulp.dest('public/templates'))
    .pipe(livereload(server));
    // .pipe(notify({
    //   message: 'Templates updated',
    //   onLast:  true
    // }));

  var dist = gulp.src('server/templates/{index,error}.mustache.tpl')
    .pipe(rename({ext: '.min.mustache'}))
    .pipe(template({
      favicon: datauri('client/img/favicon.png'),
    }))
    .pipe(bytediff.start())
    .pipe(htmlmin({
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes:     true
    }))
    .pipe(bytediff.stop())
    .pipe(gulp.dest('public/templates'));
    // .pipe(notify({
    //   message: 'Minified templates updated',
    //   onLast:  true
    // }));

  return stream.concat(dev, dist);
});

module.exports = {withServer: function(lr) { server = lr; }};