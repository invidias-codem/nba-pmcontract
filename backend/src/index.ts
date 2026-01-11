import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import { OrderBookMirror } from './services/OrderBookMirror';
import { polymarketSigner } from './middleware/PolymarketSigner';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Example protected route
app.get('/api/test-signature', polymarketSigner, (req, res) => {
    res.json({
        message: 'Request signed',
        headers: {
            'POLY-API-KEY': req.headers['POLY-API-KEY'],
            'POLY-TIMESTAMP': req.headers['POLY-TIMESTAMP'],
            'POLY-SIGNATURE': req.headers['POLY-SIGNATURE']
        }
    });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket handling
const mirror = OrderBookMirror.getInstance();
mirror.connect();

wss.on('connection', (ws) => {
    console.log('New frontend client connected');
    mirror.addFrontendClient(ws);
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
