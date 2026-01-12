"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
const OrderBookMirror_1 = require("./services/OrderBookMirror");
const PolymarketSigner_1 = require("./middleware/PolymarketSigner");
const RateLimiter_1 = require("./middleware/RateLimiter");
const KeyManager_1 = require("./services/KeyManager");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Apply public rate limiter to all routes
app.use(RateLimiter_1.publicRateLimiter);
// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Config endpoint (shows sanitized configuration)
app.get('/api/config', RateLimiter_1.apiRateLimiter, (req, res) => {
    try {
        const keyManager = KeyManager_1.KeyManager.getInstance();
        const config = keyManager.getSanitizedConfig();
        res.json({
            status: 'ok',
            config
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Configuration error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Example protected route with Polymarket signing
app.get('/api/test-signature', RateLimiter_1.apiRateLimiter, PolymarketSigner_1.polymarketSigner, (req, res) => {
    res.json({
        message: 'Request signed successfully',
        headers: {
            'POLY-API-KEY': req.headers['poly-api-key'] ? 'SET' : 'NOT_SET',
            'POLY-TIMESTAMP': req.headers['poly-timestamp'],
            'POLY-SIGNATURE': req.headers['poly-signature'] ? 'SET' : 'NOT_SET',
            'X-Builder-ID': req.headers['x-builder-id'] || 'NOT_SET'
        }
    });
});
// Webhook endpoint for Polymarket events
app.post('/api/webhooks/polymarket', RateLimiter_1.webhookRateLimiter, PolymarketSigner_1.verifyPolymarketWebhook, (req, res) => {
    try {
        console.log('✅ Verified webhook received:', req.body);
        // TODO: Process webhook event
        // - Update orderbook state
        // - Trigger card minting
        // - Update market resolution
        res.json({
            status: 'ok',
            message: 'Webhook processed'
        });
    }
    catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).json({
            error: 'Webhook processing error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
// Initialize services
let mirror;
let cardWrapper;
try {
    // WebSocket handling
    mirror = OrderBookMirror_1.OrderBookMirror.getInstance();
    mirror.connect();
    // Initialize CardWrapper
    const { CardWrapper } = require('./services/CardWrapper');
    cardWrapper = CardWrapper.getInstance();
    console.log('✅ All services initialized successfully');
}
catch (error) {
    console.error('❌ Failed to initialize services:', error);
    if (error instanceof Error && error.message.includes('CRITICAL')) {
        console.error('💥 Critical configuration error. Exiting...');
        process.exit(1);
    }
}
wss.on('connection', (ws) => {
    console.log('🔌 New frontend client connected');
    mirror.addFrontendClient(ws);
    ws.on('close', () => {
        console.log('🔌 Frontend client disconnected');
    });
    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
    });
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('📴 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
server.listen(port, () => {
    console.log('🚀 ========================================');
    console.log(`🚀 NBA Contracts Backend Server`);
    console.log(`🚀 Port: ${port}`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ========================================');
});
