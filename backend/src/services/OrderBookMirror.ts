import WebSocket from 'ws';

interface OrderBookState {
    [marketId: string]: any; // Placeholder for actual orderbook structure
}

export class OrderBookMirror {
    private static instance: OrderBookMirror;
    private polymarketWsUrl = 'wss://ws-subscriptions-clob.polymarket.com/ws/market';
    private ws: WebSocket | null = null;
    private orderBooks: OrderBookState = {};
    private frontendClients: Set<WebSocket> = new Set();

    private constructor() { }

    public static getInstance(): OrderBookMirror {
        if (!OrderBookMirror.instance) {
            OrderBookMirror.instance = new OrderBookMirror();
        }
        return OrderBookMirror.instance;
    }

    public connect() {
        this.ws = new WebSocket(this.polymarketWsUrl);

        this.ws.on('open', () => {
            console.log('Connected to Polymarket CLOB WebSocket');
            // Subscriptions would happen here based on active markets
            // Example: this.subscribeToMarket("some-condition-id");
        });

        this.ws.on('message', (data: WebSocket.Data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handlePolymarketMessage(message);
            } catch (error) {
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

    private handlePolymarketMessage(message: any) {
        // Update local state logic here
        // Broadcast to frontend clients
        this.broadcastToClients(message);
    }

    public addFrontendClient(client: WebSocket) {
        this.frontendClients.add(client);
        client.on('close', () => this.frontendClients.delete(client));
    }

    private broadcastToClients(data: any) {
        const payload = JSON.stringify(data);
        this.frontendClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }

    // Method to subscribe to specific markets
    public subscribeToMarket(assetId: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const msg = {
                type: "Market",
                assets: [assetId]
            };
            this.ws.send(JSON.stringify(msg));
            console.log(`Subscribed to market: ${assetId}`);
        }
    }
}
