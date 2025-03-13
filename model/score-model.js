const mongoose = require("mongoose");

const Score = mongoose.model('Score', {
    pseudo:   String,
    score:  Number, 
    date:  Date
});

module.exports = Score;