const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/tp';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to Mongoose Server')
}).catch((err) => {
    console.log('Error connecting to Mongoose Server :', err)
});

module.exports = mongoose;