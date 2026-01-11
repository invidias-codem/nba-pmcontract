"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.polymarketSigner = void 0;
const KeyManager_1 = require("../services/KeyManager");
const crypto = __importStar(require("crypto"));
const polymarketSigner = (req, res, next) => {
    const keyManager = KeyManager_1.KeyManager.getInstance();
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
exports.polymarketSigner = polymarketSigner;
