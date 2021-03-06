var l = require('debug')('pokefinder:routes:bosses');
var _async = require('async');
var Boss = require('../models/Boss');
var BossCounter = require('../models/BossCounter');

module.exports.newBoss = function newBoss(obj, cb) {
  var boss = new Boss();

  var missingProps = [];

  if (obj.boss)
    boss.boss = obj.boss;
  else
    missingProps.push('boss');

  if (obj.difficulty)
    boss.difficulty = obj.difficulty;
  else
    missingProps.push('difficulty')

  if (obj.types)
    boss.types = obj.types;
  else
    missingProps.push('types')

  if (!obj.counters)
    missingProps.push('counters')

  if (missingProps.length > 0) {
    l('Missing properties: %s', missingProps);
    return cb({message: 'Missing properties: ' + missingProps.join(', ')}, null);
  }


  if (obj.counters) {
    var bossCounter;

    _async.waterfall([
      function(callback) {
        var counters = [];
        var index = 1;
        for (var i in obj.counters) {
          bossCounter = new BossCounter();
          bossCounter.bossCounter = obj.counters[i].bossCounter;
          bossCounter.types = obj.counters[i].types;
          bossCounter.bestMoves = obj.counters[i].bestMoves;

          bossCounter.save(function(err, newCounter) {
            if (err)
              return cb(err);
            counters.push(newCounter._id); // Test this
            if (index === obj.counters.length)
              callback(null, counters);
            else
              index++;
          });
        }
      }
    ], function (err, counters) {
      boss.counters = counters;
      boss.save(function(err, newBoss) {
        if (err)
        return cb(err);

        cb(null, {bossId: newBoss._id});
      });
    });
  }

};

module.exports.getBossList = function getBossList(cb) {
  Boss.find()
  .populate('counters')
  .exec(function(err, bosses) {
    if (err)
      return cb(err);

    cb(null, bosses);
  });
};
