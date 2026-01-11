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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Example protected route
app.get('/api/test-signature', PolymarketSigner_1.polymarketSigner, (req, res) => {
    res.json({
        message: 'Request signed',
        headers: {
            'POLY-API-KEY': req.headers['POLY-API-KEY'],
            'POLY-TIMESTAMP': req.headers['POLY-TIMESTAMP'],
            'POLY-SIGNATURE': req.headers['POLY-SIGNATURE']
        }
    });
});
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
// WebSocket handling
const mirror = OrderBookMirror_1.OrderBookMirror.getInstance();
mirror.connect();
wss.on('connection', (ws) => {
    console.log('New frontend client connected');
    mirror.addFrontendClient(ws);
});
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
