__Node.js load test and performance measurement tool__

```js
var Promise = require('bluebird');
Promise.longStackTraces();
var performanceRunner = require('node-perf');
var request = require('superagent');

var plugin = {};
plugin.before = function before() {
  return Promise.resolve({});
};

plugin.doIteration = function doIteration(task) {
  return new Promise(function (resolve, reject) {
    request.get('localhost:4567/rate')
    .end(function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result.body);
    });
  });
};

plugin.generateData = function () {
};

plugin.after = function after(env) {
  return Promise.resolve();
};

performanceRunner.run(plugin, {iterations: 1000, concurrency: 10});
```

The output like this:
```
sp@ubuntu13-50:~/tools/ratetable/node-ratetable$ node ratetable.js -i 10000 -c 50
###progress [===========================================================] 100% 10000 0.0s
iterations: 12911ms

{ iteration:
   { meter:
      { mean: 771.303948635688,
        count: 10000,
        currentRate: 771.3005793137153,
        '1MinuteRate': 0,
        '5MinuteRate': 0,
        '15MinuteRate': 0 },
     histogram:
      { min: 0.4303159713745117,
        max: 50.32475280761719,
        sum: 11414.773022651672,
        variance: 1.4070160465684114,
        mean: 1.1414773022651672,
        stddev: 1.1861770721812201,
        count: 10000,
        median: 0.9900850057601929,
        p75: 1.1628969311714172,
        p95: 1.5546403527259824,
        p99: 2.005256474018098,
        p999: 15.711822549581546 } } }
```