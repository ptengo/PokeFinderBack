var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ttl = require('mongoose-ttl');
var RaidSchema   = new Schema({
    boss: {type: Schema.ObjectId, ref: "Boss"},
    people: Number,
    messages: [{type: Schema.ObjectId, ref: "Message"}],
    location: {
      latitude: Number,
      longitude: Number
    },
    expire_at: {type: Date, default: Date.now, expires: 5}
});

RaidSchema.plugin(ttl, { ttl: 7200000, reap: false});

module.exports = mongoose.model('Raid', RaidSchema);
