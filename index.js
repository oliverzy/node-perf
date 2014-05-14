var util = require('util');
var _ = require('lodash');
var Promise = require('bluebird');
Promise.longStackTraces();
var stats = require('measured').createCollection();
var async = require('async');
var ProgressBar = require('progress');

var bar;  // progress bar

function runIteration(task, done) {
  var timer = stats.timer('iteration').start();
  task.env._plugin.doIteration(task)
  .then(function () {
    timer.end();

    bar.tick();
    done();
  });
}

function run(plugin, options) {
  options = options || {};
  if (!options.concurrency) options.concurrency = 2;
  if (!options.iterations) options.iterations = 10;
  bar = new ProgressBar('###progress [:bar] :percent :total :etas', {
    complete: '=',
    incomplete: ' ',
    width: 60,
    total: options.iterations
  });

  return plugin.before()
  .then(function (env) {
    env._plugin = plugin;

    return new Promise(function (resolve, reject) {
      var queue = async.queue(runIteration, options.concurrency);
      queue.drain = function () {
        console.timeEnd('iterations');
        stats.end();
        bar.update(1);
        resolve(env);
      };

      for (var i = 0; i < options.iterations; i++) {
        var task = {env: env, index: i};
        plugin.generateData(task);
        queue.push(task);
      }
      
      // Start timing
      console.time('iterations');
    });
  })
  .then(plugin.after);
}

process.on('exit', function () {
  console.log(stats.toJSON());
});

module.exports = {run: run};
