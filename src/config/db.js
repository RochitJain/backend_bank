const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

function connectDB() {
    mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => { throw new AppError(`Mongo DB error: ${err}`, 500 )})
}

module.exports = connectDB;