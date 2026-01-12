import { Request, Response, NextFunction } from 'express';
import { KeyManager } from '../services/KeyManager';
import * as crypto from 'crypto';

/**
 * Middleware to sign outgoing requests to Polymarket CLOB API
 * Adds required authentication headers and Builder ID for order attribution
 */
export const polymarketSigner = (req: Request, res: Response, next: NextFunction) => {
    try {
        const keyManager = KeyManager.getInstance();

        // Validate that secrets are present
        if (!keyManager.validateSecretsPresent()) {
            return res.status(500).json({
                error: 'Server configuration error',
                message: 'Polymarket credentials not configured'
            });
        }

        const apiKey = keyManager.getPolyApiKey();
        const apiSecret = keyManager.getPolyApiSecret();
        const passphrase = keyManager.getPolyPassphrase();
        const builderId = keyManager.getBuilderId();

        // Generate timestamp (Unix timestamp in seconds)
        const timestamp = Math.floor(Date.now() / 1000).toString();

        // Build signature payload: timestamp + method + path + body
        const method = req.method.toUpperCase();
        const path = req.path;
        const body = Object.keys(req.body || {}).length > 0 ? JSON.stringify(req.body) : '';
        const sigPayload = timestamp + method + path + body;

        // Generate HMAC signature
        const signature = crypto
            .createHmac('sha256', apiSecret)
            .update(sigPayload)
            .digest('base64');

        // Attach Polymarket authentication headers
        req.headers['POLY-API-KEY'] = apiKey;
        req.headers['POLY-TIMESTAMP'] = timestamp;
        req.headers['POLY-SIGNATURE'] = signature;
        req.headers['POLY-PASSPHRASE'] = passphrase;

        // Add Builder ID header for order attribution (if configured)
        if (builderId) {
            req.headers['X-Builder-ID'] = builderId;
        }

        next();
    } catch (error) {
        console.error('❌ Error in polymarketSigner middleware:', error);
        return res.status(500).json({
            error: 'Authentication error',
            message: 'Failed to sign request'
        });
    }
};

/**
 * Middleware to verify incoming webhook signatures from Polymarket
 * Ensures webhooks are authentic and not spoofed
 */
export const verifyPolymarketWebhook = (req: Request, res: Response, next: NextFunction) => {
    try {
        const keyManager = KeyManager.getInstance();
        const apiSecret = keyManager.getPolyApiSecret();

        // Get signature from headers
        const receivedSignature = req.headers['x-polymarket-signature'] as string;
        const timestamp = req.headers['x-polymarket-timestamp'] as string;

        if (!receivedSignature || !timestamp) {
            console.warn('⚠️  Webhook received without signature or timestamp');
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing webhook signature'
            });
        }

        // Verify timestamp is recent (within 5 minutes)
        const currentTime = Math.floor(Date.now() / 1000);
        const webhookTime = parseInt(timestamp, 10);
        const timeDiff = Math.abs(currentTime - webhookTime);

        if (timeDiff > 300) { // 5 minutes
            console.warn('⚠️  Webhook timestamp too old:', timeDiff, 'seconds');
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Webhook timestamp expired'
            });
        }

        // Reconstruct signature payload
        const body = JSON.stringify(req.body);
        const sigPayload = timestamp + body;

        // Calculate expected signature
        const expectedSignature = crypto
            .createHmac('sha256', apiSecret)
            .update(sigPayload)
            .digest('hex');

        // Compare signatures (constant-time comparison to prevent timing attacks)
        if (!crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))) {
            console.warn('⚠️  Invalid webhook signature received');
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid webhook signature'
            });
        }

        // Signature valid, proceed
        next();
    } catch (error) {
        console.error('❌ Error verifying webhook signature:', error);
        return res.status(500).json({
            error: 'Verification error',
            message: 'Failed to verify webhook'
        });
    }
};
