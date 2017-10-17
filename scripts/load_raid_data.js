var config = require('../config');
var funcs = require('../routesFuncs/raids-funcs.js');
var _async = require('async');
var _ = require ('lodash');
var fs = require('fs');
var request = require('request');
var spawn = require('child_process').spawn;

var sourceFile = process.argv[2] || config.dataFile;

var addUserToRaid = funcs.addUserToRaid;

var resolve = function resolve(str) {
  return str.replace(/%([^%]+)%/g, function(_,n) {
    return process.env[n];
  });
};

var randomMessage = function randomMessage(){
  var arr =
  [
    {
      "message": "Laborum pariatur duis deserunt sunt veniam sint magna excepteur sit. Tempor magna fugiat et reprehenderit deserunt incididunt. Excepteur duis voluptate do aliquip ea est officia in id nostrud pariatur proident. Eiusmod aliqua ullamco sint incididunt occaecat magna sunt. Amet pariatur consectetur fugiat laboris irure quis officia ipsum elit. Non sunt occaecat laboris eu nisi. Consectetur excepteur officia voluptate Lorem culpa velit cupidatat et anim.\r\n",
      "user": "voluptate"
    },
    {
      "message": "Aute sint reprehenderit fugiat sunt minim esse do mollit velit. Cupidatat dolore commodo nulla qui sint voluptate nostrud proident adipisicing dolore et. Consequat est est ad in sint veniam irure magna sunt nisi aute. Enim enim ad enim dolor ex fugiat incididunt. Amet ad laborum veniam culpa esse enim tempor est ex amet. Mollit eiusmod dolor dolor veniam mollit id. Deserunt aliquip reprehenderit laboris pariatur est eu Lorem elit mollit cillum ipsum laboris dolore.\r\n",
      "user": "minim"
    },
    {
      "message": "Fugiat ad ut incididunt id deserunt non ea ullamco ipsum. Anim quis veniam dolore exercitation amet nostrud velit enim proident occaecat. Aliqua ullamco consequat velit sint cupidatat commodo officia. Exercitation sit amet cillum pariatur et deserunt velit officia ea nulla.\r\n",
      "user": "et"
    },
    {
      "message": "Enim ullamco reprehenderit deserunt magna occaecat commodo velit sunt nulla tempor et irure nulla. Fugiat fugiat aliqua eu sint irure ea velit. Consectetur veniam incididunt nisi eu eiusmod nostrud.\r\n",
      "user": "ea"
    },
    {
      "message": "Anim est enim occaecat aute ipsum fugiat. Esse aliqua elit voluptate consectetur ut ad velit incididunt adipisicing deserunt mollit enim aliqua. Ex excepteur dolore ad ex ipsum ipsum non eiusmod nisi. Ad culpa dolor reprehenderit laboris ipsum.\r\n",
      "user": "esse"
    },
    {
      "message": "Consectetur voluptate minim Lorem nisi excepteur irure ullamco et sunt aliqua anim. Laborum dolor esse do incididunt laboris exercitation qui velit laboris in. Labore esse et ullamco dolor culpa nisi aliquip proident cupidatat esse in do.\r\n",
      "user": "cillum"
    },
    {
      "message": "Ullamco eu cupidatat duis duis duis quis elit ea proident esse do et duis et. Velit in voluptate duis occaecat ex excepteur ad tempor. Ullamco qui sint commodo ipsum ad id excepteur in ea deserunt Lorem id laborum cupidatat. Fugiat sunt quis fugiat reprehenderit incididunt in ipsum. Ea consequat duis anim tempor dolor velit.\r\n",
      "user": "ad"
    },
    {
      "message": "Culpa anim duis esse cupidatat in ea adipisicing elit occaecat voluptate qui eiusmod pariatur mollit. Duis mollit mollit nisi exercitation veniam fugiat aliquip laborum cillum eiusmod aute ad nostrud dolore. Cupidatat occaecat ad velit id ex reprehenderit elit tempor nisi quis occaecat in nostrud eiusmod. Eiusmod commodo enim aliquip ad exercitation ipsum culpa anim anim do Lorem. Mollit adipisicing do laboris velit. Exercitation deserunt deserunt eiusmod dolore cillum irure aute cupidatat anim ad. Occaecat ullamco deserunt laborum nisi dolore sint culpa ullamco laboris consectetur eiusmod.\r\n",
      "user": "sunt"
    },
    {
      "message": "Veniam sit ut deserunt aliquip officia enim nostrud consectetur cupidatat eu. Exercitation mollit qui exercitation proident ad adipisicing officia nisi. Deserunt magna ad magna in in quis ullamco ullamco quis ut qui magna.\r\n",
      "user": "adipisicing"
    },
    {
      "message": "Ex magna mollit id ut est qui. Ex ut sint quis ut anim sit pariatur qui duis sint excepteur do cillum. Aute sit nulla nulla incididunt do sunt Lorem duis quis et pariatur irure labore. Lorem Lorem tempor aute ad ex deserunt.\r\n",
      "user": "ipsum"
    }
  ];
  return arr[Math.floor(Math.random()*arr.length)];
}

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
            difficulty: aBoss.difficulty,
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
    },
    function (ids, callback) {
      var raidIds = [];
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
          raidIds.push(body.raidId);
          process.stdout.write('S');
          cb();
        });
      }, function(err) {
        console.log('Done creating raids');
        return callback(null, raidIds);
      });
    }
  ], function (err, ids) {
    _async.eachSeries(ids, function(id, cb) {
      var i = 0;
      for (var i = 0; i < 10; i++) {
        var body = randomMessage();
        request({
          url: config.node.address + "/raids/" + id + "/message",
          method: 'PUT',
          json: true,
          body: body
        }, function(err, res, body) {
          if (err || res.statusCode != 200) {
            console.log(err);
            return;
          }
          process.stdout.write('S');
        });

        request({
          url: config.node.address + "/raids/" + id + "/user",
          method: 'PUT',
          json: true
        }, function(err, res, body) {
          if (err || res.statusCode != 200) {
            console.log(err);
            return;
          }
          process.stdout.write('s');
        });
      }
      cb();
    }, function(err) {
      console.log('Done creating messages');
    });
  });
});
