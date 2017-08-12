var l = require('debug')('pokefinder:routes:bosses');
var Message = require('../models/Message');

module.exports.getMessages = function getMessages(cb) {
  Message.find()
  .exec(function(err, messages) {
    if (err)
      return cb(err);

    cb(null, messages);
  });
};
