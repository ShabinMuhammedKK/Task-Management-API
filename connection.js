const mongoose = require("mongoose");


//here is mongodb connetion take place

const connectDB = async (url) => mongoose.connect(url);

module.exports = connectDB;
