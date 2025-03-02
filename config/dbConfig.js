const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.BATABASE_URI, {
      useUnifiedTopology: true
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;