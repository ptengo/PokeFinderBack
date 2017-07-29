var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BossCounterSchema   = new Schema({
    bosscounter: String,
    types: [String],
    bossId: String
});

module.exports = mongoose.model('BossCounter', BossCounterSchema);
