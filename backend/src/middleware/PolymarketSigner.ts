import { Request, Response, NextFunction } from 'express';
import { KeyManager } from '../services/KeyManager';
import * as crypto from 'crypto';

export const polymarketSigner = (req: Request, res: Response, next: NextFunction) => {
    const keyManager = KeyManager.getInstance();
    const apiKey = keyManager.getPolyApiKey();
    const apiSecret = keyManager.getPolyApiSecret();
    const passphrase = keyManager.getPolyPassphrase();

    if (!apiKey || !apiSecret || !passphrase) {
        // Continue but warn if auth is missing and it's needed generally, 
        // or just let the downstream fail if it really needs it.
        // For now, we assume this middleware is applied to routes that NEED auth.
        console.warn("Missing Polymarket credentials for signing.");
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const sigPayload = timestamp + req.method + req.path + (Object.keys(req.body).length ? JSON.stringify(req.body) : '');

    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(sigPayload)
        .digest('base64');

    // Append headers
    req.headers['POLY-API-KEY'] = apiKey;
    req.headers['POLY-TIMESTAMP'] = timestamp;
    req.headers['POLY-SIGNATURE'] = signature;
    req.headers['POLY-PASSPHRASE'] = passphrase;

    next();
};
