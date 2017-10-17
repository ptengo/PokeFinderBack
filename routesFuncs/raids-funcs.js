var l = require('debug')('pokefinder:routes:raids');

var Boss = require('../models/Boss');
var BossCounter = require('../models/BossCounter');
var Message = require('../models/Message');
var Raid = require('../models/Raid');

module.exports.newRaid = function newRaid(obj, cb) {
  var raid = new Raid();

  var missingProps = [];

  if (obj.boss)
    raid.boss = obj.boss; // Will be objectId
  else
    missingProps.push('boss');

  if (obj.location)
    raid.location = obj.location;
  else
    missingProps.push('location')

  if (missingProps.length > 0) {
    l('Missing properties: %s', missingProps);
    return res.send({message: 'Missing properties: ' + missingProps.join(', ')});
  }

  raid.messages = [];
  raid.people = 0;

  raid.save(function(err, newRaid) {
    if (err)
      return cb(err);

    cb(null, {raidId: newRaid._id});
  });
};

module.exports.getRaidList = function getRaidList(difficulty, cb) {
  console.log('difficulty', difficulty);
  var properties = [{key: 'one', value: 1}, {key: 'two', value: 2}, {key: 'three', value: 3}, {key: 'four', value: 4}, {key: 'five', value: 5}];
  var filter;
  for (var prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      if (properties[prop].key === difficulty)
        filter = properties[prop].value;
    }
  }
  console.log('filter', filter);
  var populateQuery = [{path: 'messages'}, {path:'boss', populate: {path: 'counters'}}];
  Raid.find({'boss.difficulty': filter})
  .populate(populateQuery)
  .exec(function(err, raids) {
    if (err)
      return cb(err);

    cb(null, raids);
  });
};

module.exports.getRaidById = function getRaidById(id, cb) {
  Raid.findById(id, function(err, foundRaid) {
    if (err)
      return cb(err);

    cb(null, foundRaid);
  });
};

module.exports.updateRaid = function updateRaid(id, obj, cb) {
  Raid.findById(id, function(err, foundRaid) {
    if (err)
      return cb(err);

    if (obj.boss)
      foundRaid.boss = obj.boss;

    if (obj.location)
      foundRaid.location = obj.location;

    foundRaid.save(function(err) {
      if (err)
        return cb(err);

      cb(null);
    });
  });
};

module.exports.addMessageToRaid = function addMessageToRaid(rid, obj, cb) {
  Raid.find({_id: rid}, function(err, raid){
    if(err)
      return cb(err);

    if (raid) {
      var message = new Message();
      message.message = obj.message;
      message.user = obj.user;
      message.raidId = rid;

      message.save(function(err, newMessage) {
        if (err)
          return cb(err);
        Raid.update(
          {_id: rid},
          {$push: {messages: newMessage._id}},
          {safe: true, upsert: true, new: true},
          function (err, raidToUpdate) {
            //here send notification to all users subscribed to this raid
            //addUserToRaid(rid);
            cb(null, raidToUpdate);
          }
        )
      });
    }
  });
};

module.exports.addUserToRaid = function addUserToRaid(id, cb) {
  Raid.findById(id, function(err, foundRaid) {
    if (err)
      return cb(err);

    foundRaid.people++;

    foundRaid.save(function(err) {
      if (err)
        return cb(err);

      cb(null);
    });
  });
}

module.exports.removeRaid = function removeRaid (id, cb) {
  Raid.remove({_id: id}, function(err, raid) {
    if (err)
      return cb(err);

    Message.remove({raidId: id}, function (err, message){
      if (err)
        return cb(err)

        return cb(null);
    });
  });
}
