
const mongoose = require("mongoose");
const logger = require("./logger");

async function connectDB() {
  try {
    const url = process.env.MONGO_LOCAL?.trim();
    if(!url){
        throw new Error('Mongo URL not available')
    }
    await mongoose.connect(url);
    logger.info({message: "MongoDB connected successfully",service: 'banking-ledger',event: 'database_connected'});
  } catch (err){
      logger.error({
        service: 'banking-ledger',
       error: err.message,
       message: 'MongoDB connection failed',
       code: err.code,
      })
      throw err;
    }
}

mongoose.connection.on("disconnected", () => {
    logger.error({
        service: 'banking-ledger',
        message: "MongoDB connection lost",
        event: "database_disconnected"
    });
});

mongoose.connection.on("reconnected", () => {
    logger.info({
        service: 'banking-ledger',
        message: "MongoDB connection restored",
        event: "database_reconnected"
    });
});

module.exports = connectDB;
