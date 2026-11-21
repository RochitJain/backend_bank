const winston = require("winston");
const Transport = require("winston-transport");
const axios = require("axios");

class CopilotTransport extends Transport {
  async log(info, callback) {
    try {
      await axios.post(process.env.COPILOT_ADD_LOG_URL, info);
    } catch (error) {
      // Do not use logger.error() here; that would trigger this transport again.
      console.error("Failed to forward log to Copilot:", error.message);
    }

    callback();
  }
}

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),

    new winston.transports.File({
      filename: "logs/combined.log"
    }),

    new CopilotTransport()
  ]
});

module.exports = logger;