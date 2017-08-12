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
    }
});

RaidSchema.pre('remove', function(next) {
  console.log('pre');
  this.model('Message').remove({ raidId: this._id }, next);
});
// change to 7200000 2h
RaidSchema.plugin(ttl, { ttl: 15000, reap: false});

module.exports = mongoose.model('Raid', RaidSchema);
