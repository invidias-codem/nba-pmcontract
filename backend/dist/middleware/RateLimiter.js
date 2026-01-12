"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRateLimiter = exports.publicRateLimiter = exports.apiRateLimiter = exports.authRateLimiter = void 0;
exports.createRateLimiter = createRateLimiter;
const store = {};
// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);
/**
 * Creates a rate limiting middleware
 * @param options Configuration options
 */
function createRateLimiter(options = {}) {
    const { windowMs = 60 * 1000, // Default: 1 minute
    max = 100, // Default: 100 requests per minute
    message = 'Too many requests, please try again later', skipSuccessfulRequests = false } = options;
    return (req, res, next) => {
        // Get client identifier (IP address)
        const identifier = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        // Initialize or get existing record
        if (!store[identifier] || store[identifier].resetTime < now) {
            store[identifier] = {
                count: 0,
                resetTime: now + windowMs
            };
        }
        // Increment request count
        store[identifier].count++;
        // Check if limit exceeded
        if (store[identifier].count > max) {
            const retryAfter = Math.ceil((store[identifier].resetTime - now) / 1000);
            res.setHeader('Retry-After', retryAfter.toString());
            res.setHeader('X-RateLimit-Limit', max.toString());
            res.setHeader('X-RateLimit-Remaining', '0');
            res.setHeader('X-RateLimit-Reset', store[identifier].resetTime.toString());
            return res.status(429).json({
                error: 'Too Many Requests',
                message,
                retryAfter
            });
        }
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max.toString());
        res.setHeader('X-RateLimit-Remaining', (max - store[identifier].count).toString());
        res.setHeader('X-RateLimit-Reset', store[identifier].resetTime.toString());
        // If skipSuccessfulRequests is true, decrement on successful response
        if (skipSuccessfulRequests) {
            const originalSend = res.send;
            res.send = function (data) {
                if (res.statusCode < 400) {
                    store[identifier].count--;
                }
                return originalSend.call(this, data);
            };
        }
        next();
    };
}
/**
 * Predefined rate limiters for different use cases
 */
// Strict rate limiter for authentication endpoints
exports.authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes
    message: 'Too many authentication attempts, please try again later'
});
// Standard rate limiter for API endpoints
exports.apiRateLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'API rate limit exceeded'
});
// Lenient rate limiter for public endpoints
exports.publicRateLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 300, // 300 requests per minute
    message: 'Rate limit exceeded'
});
// Strict rate limiter for webhook endpoints
exports.webhookRateLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 webhooks per minute
    message: 'Webhook rate limit exceeded'
});
