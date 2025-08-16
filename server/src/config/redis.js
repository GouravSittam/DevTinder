const redis = require("redis")

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17329.c92.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 17329
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

module.exports = redisClient;
