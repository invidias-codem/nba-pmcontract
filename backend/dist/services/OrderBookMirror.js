"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookMirror = void 0;
const ws_1 = __importDefault(require("ws"));
class OrderBookMirror {
    constructor() {
        this.polymarketWsUrl = 'wss://ws-subscriptions-clob.polymarket.com/ws/market';
        this.ws = null;
        this.orderBooks = {};
        this.frontendClients = new Set();
    }
    static getInstance() {
        if (!OrderBookMirror.instance) {
            OrderBookMirror.instance = new OrderBookMirror();
        }
        return OrderBookMirror.instance;
    }
    connect() {
        this.ws = new ws_1.default(this.polymarketWsUrl);
        this.ws.on('open', () => {
            console.log('Connected to Polymarket CLOB WebSocket');
            // Subscriptions would happen here based on active markets
            // Example: this.subscribeToMarket("some-condition-id");
        });
        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handlePolymarketMessage(message);
            }
            catch (error) {
                console.error('Error parsing Polymarket WS message:', error);
            }
        });
        this.ws.on('close', () => {
            console.log('Polymarket CLOB WebSocket closed. Reconnecting in 5s...');
            setTimeout(() => this.connect(), 5000);
        });
        this.ws.on('error', (err) => {
            console.error('Polymarket CLOB WebSocket error:', err);
        });
    }
    handlePolymarketMessage(message) {
        // Update local state logic here
        // Broadcast to frontend clients
        this.broadcastToClients(message);
    }
    addFrontendClient(client) {
        this.frontendClients.add(client);
        client.on('close', () => this.frontendClients.delete(client));
    }
    broadcastToClients(data) {
        const payload = JSON.stringify(data);
        this.frontendClients.forEach(client => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(payload);
            }
        });
    }
    // Method to subscribe to specific markets
    subscribeToMarket(assetId) {
        if (this.ws && this.ws.readyState === ws_1.default.OPEN) {
            const msg = {
                type: "Market",
                assets: [assetId]
            };
            this.ws.send(JSON.stringify(msg));
            console.log(`Subscribed to market: ${assetId}`);
        }
    }
}
exports.OrderBookMirror = OrderBookMirror;
