const Redis = require("ioredis")

class redis {
  constructor() {
    this.redis = Redis.createClient(process.env.REDIS_URL);
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
