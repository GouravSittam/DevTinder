const redisClient = require("../config/redis");

const rateLimiter = async(req, res, next) => {
  try {
    const ip = req.ip;
    if (!ip) {
      return res.status(400).json({ error: "IP address not found." });
    }

    // Increment request count for IP
    const requestCount = await redisClient.incr(ip);


    


    // Check if limit exceeded
    if (requestCount > 2000) {
      
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // Set expiry for first request from this IP
    if (requestCount === 1) {
      await redisClient.expire(ip, 3600); // Key and expiry time in seconds
    }

    next();
  } catch (err) {
    console.error("Error in rate limiter:", err);
    return res.status(429).json({ 
      error: err.message || "Too many requests. Please try again later." 
    });
  }
};

module.exports = rateLimiter;