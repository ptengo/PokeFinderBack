var _async = require('async');
var _ = require ('lodash');
var config = require('../config');
var fs = require('fs');
var request = require('request');
var spawn = require('child_process').spawn;

var sourceFile = process.argv[2] || config.dataFile;

var resolve = function resolve(str) {
  return str.replace(/%([^%]+)%/g, function(_,n) {
    return process.env[n];
  });
};

var mongoRoute = resolve('%ProgramFiles%\\MongoDB\\Server\\3.4\\bin\\mongo.exe');

console.log('Clearing database...');
var prc = spawn(mongoRoute,  ['pokefinder', '--eval', 'db.dropDatabase()']);

prc.on('close', function(){

  console.log('Done. Loading Bosses...')
  var json = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  var bosses = _.cloneDeep(json.bosses);
  _async.waterfall([
    function(callback) {
      var bossIds = [];
      _async.eachSeries(bosses, function(aBoss, cb) {
        request({
          url: config.node.address + "/boss",
          method: 'POST',
          json: true,
          body: {
            boss: aBoss.boss,
            dificulty: aBoss.dificulty,
            types: aBoss.types,
            counters: aBoss.counters,
          }
        }, function(err, res, body) {
          if (err || res.statusCode != 200) {
            console.log(err);
            return;
          }
          bossIds.push(body.bossId);
          process.stdout.write('s');
          cb();
        });
      }, function(err) {
        console.log('Done creating bosses');
        return callback(null, bossIds);
      });
    }
  ], function (err, ids) {
    _async.eachSeries(ids, function(id, cb) {
      request({
        url: config.node.address + "/raids",
        method: 'POST',
        json: true,
        body: {
          boss: id,
          location: {latitude: 20, longitude: 20}
        }
      }, function(err, res, body) {
        if (err || res.statusCode != 200) {
          console.log(err);
          return;
        }
        process.stdout.write('S');
        cb();
      });
    }, function(err) {
      console.log('Done creating raids');
    });
  });
});
