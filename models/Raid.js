var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RaidSchema   = new Schema({
    boss: {type: Schema.ObjectId, ref: "Boss"},
    people: Number,
    messages: [{type: Schema.ObjectId, ref: "Message"}],
    location: {
      latitude: Number,
      longitude: Number
    }
});

module.exports = mongoose.model('Raid', RaidSchema);
