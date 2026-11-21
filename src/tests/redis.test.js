const logger = require('../config/logger');
const {client} = require('../config/redis')

async function getCache(key){
    try{
    if(!client.isReady) return null
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
    }catch(err){
        logger.warn({
            service: 'banking-ledger',
            error: err.message,
            event: 'Cant fetch data'
        })
        return null;
    }
}

async function setCache(key,value){
    try{
        if(!client.isReady) return null
        await client.set(key,JSON.stringify(value),{
            expiration: 300
        })
        return true
    }catch(err){
        logger.warn({
            service: 'banking-ledger',
            error: err.message,
            event: 'Cant set data in redis'
        })
        return null
    }
}

async function deleteCache(key) {
  try {
    if (!client.isReady) return false;

    await client.del(key);
    return true;
  } catch (err) {
    logger.warn({
        service: 'banking-ledger',
      event: "redis_cache_delete_failed",
      error: err.message,
    });
    return false;
  }
}
module.exports = {getCache, setCache, deleteCache}