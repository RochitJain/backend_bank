const {createClient} = require('redis');
const logger = require('./logger');

const client = createClient({
    url: process.env.REDIS_URL,
    socket: { 
        reconnectStrategy(retries) {
        return Math.min(1000 * 2 ** retries, 10000);
    },
  },
})

client.on("error", (err) => {
  logger.error({
    service: 'banking-ledger',
    message: "Redis client error",
    event: err.code,
  });
});

client.on("connect", () => {
  logger.info({
      service: 'banking-ledger',
      event: "redis_connecting",
      message: "Redis connecting",
    });
});

client.on("ready", () => {
  logger.info({
      service: 'banking-ledger',
      event: "redis_connection_ready",
      message: "Redis connection ready",
    });
});

client.on("reconnecting", () => {
  logger.warn({
      service: 'banking-ledger',
      event: "redis_reconnecting",
      message: "Redis is reconnecting",
    });
});

client.on("end", () => {
  logger.warn({
      service: 'banking-ledger',
      event: "redis_connection_closed",
      message: "Redis connection closed",
    });
});

function connectRedis (){
if (!process.env.REDIS_URL) {
    logger.warn({
      service: 'banking-ledger',
      event: "redis_configuration_missing",
      message: "Redis is disabled because REDIS_URL is missing",
    });
    return 0;
  }
  if(client.isOpen) return ;
    client.connect().then(res=> {return }).catch(err=>{
    console.log(err)
    logger.error({
      service: 'banking-ledger',
        message: 'redis failed',
        event: err.code
    })
    })
}

module.exports = {connectRedis, client}