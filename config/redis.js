const redis = require('redis');

let redisClient = null;
const useRedis = process.env.USE_REDIS !== 'false';

async function initRedis() {
  if (useRedis) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    try {
      await redisClient.connect();
      console.log('✅ Redis connected successfully');
    } catch (err) {
      console.log('⚠️  Redis not available - running without cache');
      console.log('   To enable caching, install and run Redis');
      redisClient = null;
    }
  }
}

module.exports = { redisClient, initRedis };