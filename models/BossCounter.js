var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BossCounterSchema   = new Schema({
    bossCounter: String,
    types: [String],
    bestMoves: {
      quickMoves: [String],
      chargeMoves: [String]
    },
    bossId: String
});

module.exports = mongoose.model('BossCounter', BossCounterSchema);
