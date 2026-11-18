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
    message: "Redis client error",
    event: err.code,
  });
});

client.on("connect", () => {
  logger.info("Redis connecting");
});

client.on("ready", () => {
  logger.info("Redis connection ready");
});

client.on("reconnecting", () => {
  logger.warn("Redis reconnecting");
});

client.on("end", () => {
  logger.warn("Redis connection closed");
});

function connectRedis (){
if (!process.env.REDIS_URL) {
    logger.warn({
      event: "redis_configuration_missing",
      message: "Redis is disabled because REDIS_URL is missing",
    });
    return 0;
  }
  if(client.isOpen) return ;
    client.connect().then(res=> {return }).catch(err=>{
    console.log(err)
    logger.error({
        message: 'redis failed',
        event: err.code
    })
    })
}

module.exports = {connectRedis, client}