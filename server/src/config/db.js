const mongoose = require('mongoose');

const RETRY_DELAY_MS = 5000;

// Keeps the Express server alive even if MongoDB is unreachable, so routes
// that don't need the DB (like /api-docs) keep working while this retries
// in the background. DB-dependent routes will just error until it connects.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'desimug_social_kart',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.error(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_DELAY_MS);
  }
};

module.exports = connectDB;
