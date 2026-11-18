require("dotenv").config();
const { default: mongoose } = require("mongoose");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/config/logger");
const { connectRedis } = require("./src/config/redis");
const PORT = process.env.PORT || 3000;
let server;
let isShuttingDown = false;

async function startServer() {
    try {
        await connectDB();
        connectRedis();

        server = app.listen(PORT, () => {
            logger.info({
                message: `Server is running on port ${PORT}`,
                event: "server started",
            });
        });
    } catch (err) {
        process.exit(1);
    }
}

async function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`${signal} received`);

    if (server) {
        server.close(async () => {
            await mongoose.connection.close();
            logger.info({
                message: "Application shut down successfully",
                event: "database_disconnected",
            });
            process.exit(0);
        });
    } else {
        await mongoose.connection.close();
        process.exit(0);
    }
}

process.on("SIGTERM", () => {
    shutdown("SIGTERM");
});
process.on("SIGINT", () => {
    shutdown("SIGINT");
});
startServer();
