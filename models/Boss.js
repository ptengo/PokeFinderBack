var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BossSchema   = new Schema({
    boss: String,
    difficulty: Number,
    types: [String],
    counters: [{type: Schema.ObjectId, ref: "BossCounter"}]
});

module.exports = mongoose.model('Boss', BossSchema);
