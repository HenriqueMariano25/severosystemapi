const Redis = require("ioredis")

class redis {
  constructor() {
    this.redis = new Redis({
      url: process.env.REDIS_URL
      // keyPrefix: process.env.REDIS_HOST || 6379,
    })
  }

  async get(key) {
    const value = await this.redis.get(key)

    return value ? JSON.parse(value) : null
  }

  set(key, value, timeExp) {
    return this.redis.set(key, JSON.stringify(value), "EX", timeExp)
  }
}

module.exports = new redis()
