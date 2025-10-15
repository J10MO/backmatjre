const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Cache helper functions
async function getFromCache(key, redisClient) {
  if (!redisClient) return null;
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error('Redis get error:', err);
    return null;
  }
}

async function setToCache(key, data, expiry = 3600, redisClient) {
  if (!redisClient) return;
  try {
    await redisClient.setEx(key, expiry, JSON.stringify(data));
  } catch (err) {
    console.error('Redis set error:', err);
  }
}

async function deleteFromCache(key, redisClient) {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis delete error:', err);
  }
}

module.exports = {
  generateToken,
  generateVerificationCode,
  getFromCache,
  setToCache,
  deleteFromCache
};