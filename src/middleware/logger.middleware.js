
const crypto = require("crypto");
const logger = require("../config/logger");
const {activeRequests,httpRequestDuration,httpRequestTotal} = require('../config/metrics');
const AppError = require("../utils/AppError");
const sendLog = require("../config/sendReport");

const requestLogger = (req, res, next) => {
    // Generate unique ID for each request
    const requestId = crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    activeRequests.inc()
    // Record request start time
    const startTime = process.hrtime.bigint();
    // Wait until response finishes
    res.on("finish", async () => {
        const endTime = process.hrtime.bigint();
        // Convert nanoseconds into milliseconds
        const durationMs =
            Number(endTime - startTime) / 1_000_000;
   
        const statusCode = res.statusCode;

        const durationSeconds = Number(endTime - startTime) / 1e9;

        const label = {
            method: req.method,
            route: req.route?.path || req.path,
            status_code: String(statusCode)
        }
        httpRequestTotal.inc(label)
        httpRequestDuration.observe(label, durationSeconds)
        activeRequests.dec()
        // Determine log level
        const level =
            statusCode >= 500 ? "error" :
            statusCode >= 400 ? "warn" :
            "info";

        const logData = {
            service: 'banking-ledger',
            level,
            message: req.errorMessage || 'Http request complete',
            requestId,
            method: req.method,
            endpoint: req.originalUrl,
            statusCode,
            durationMs: Number(durationMs.toFixed(2))
        }
        logger.log(logData);
        await sendLog(logData).then().catch((error)=>{
             throw error
         })
    });
    
    next();
};

module.exports = requestLogger;
