var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    user: {
      type: String,
      lowercase: true,
      trim: true
    },
    message: String,
    raidId: String,
    expire_at: {type: Date, default: Date.now, expires: 7200}
});

module.exports = mongoose.model('Message', MessageSchema);
