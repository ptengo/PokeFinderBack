var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    user: {
      type: String,
      lowercase: true,
      trim: true
    },
    message: String,
    raidId: {type: Schema.ObjectId, ref: "Raid"}
});

module.exports = mongoose.model('Message', MessageSchema);
