"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManager = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class KeyManager {
    constructor() {
        this.POLY_API_KEY = process.env.POLY_API_KEY || '';
        this.POLY_API_SECRET = process.env.POLY_API_SECRET || '';
        this.POLY_PASSPHRASE = process.env.POLY_PASSPHRASE || '';
        this.SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY || '';
        if (!this.POLY_API_KEY || !this.POLY_API_SECRET || !this.POLY_PASSPHRASE) {
            console.warn('WARNING: Polymarket API credentials are not fully set in environment variables.');
        }
        if (!this.SIGNER_PRIVATE_KEY) {
            console.warn('WARNING: Signer Private Key is not set in environment variables.');
        }
    }
    static getInstance() {
        if (!KeyManager.instance) {
            KeyManager.instance = new KeyManager();
        }
        return KeyManager.instance;
    }
    getPolyApiKey() {
        return this.POLY_API_KEY;
    }
    getPolyApiSecret() {
        return this.POLY_API_SECRET;
    }
    getPolyPassphrase() {
        return this.POLY_PASSPHRASE;
    }
    getSignerPrivateKey() {
        return this.SIGNER_PRIVATE_KEY;
    }
}
exports.KeyManager = KeyManager;
