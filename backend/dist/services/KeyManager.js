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
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        // Validate all required environment variables
        this.validateEnvironment();
        // Load and validate secrets
        this.POLY_API_KEY = this.getRequiredEnvVar('POLY_API_KEY');
        this.POLY_API_SECRET = this.getRequiredEnvVar('POLY_API_SECRET');
        this.POLY_PASSPHRASE = this.getRequiredEnvVar('POLY_PASSPHRASE');
        this.SIGNER_PRIVATE_KEY = this.getRequiredEnvVar('SIGNER_PRIVATE_KEY');
        // Builder ID is optional but recommended
        this.BUILDER_ID = process.env.BUILDER_ID || '';
        if (!this.BUILDER_ID) {
            console.warn('⚠️  BUILDER_ID not set. Order attribution will not work.');
        }
        // Validate secret formats
        this.validateSecrets();
        console.log('✅ KeyManager initialized successfully');
        if (this.BUILDER_ID) {
            console.log(`✅ Builder ID configured: ${this.BUILDER_ID.substring(0, 8)}...`);
        }
    }
    /**
     * Validates that all required environment variables are present
     */
    validateEnvironment() {
        const requiredVars = [
            'POLY_API_KEY',
            'POLY_API_SECRET',
            'POLY_PASSPHRASE',
            'SIGNER_PRIVATE_KEY'
        ];
        const missing = requiredVars.filter(varName => !process.env[varName]);
        if (missing.length > 0) {
            throw new Error(`❌ CRITICAL: Missing required environment variables: ${missing.join(', ')}\n` +
                `Please set these in your .env file before starting the server.`);
        }
    }
    /**
     * Gets a required environment variable or throws an error
     */
    getRequiredEnvVar(name) {
        const value = process.env[name];
        if (!value || value.trim() === '') {
            throw new Error(`❌ CRITICAL: Environment variable ${name} is required but not set or empty.`);
        }
        return value.trim();
    }
    /**
     * Validates the format of secrets
     */
    validateSecrets() {
        // Validate API key format (should be alphanumeric)
        if (!/^[a-zA-Z0-9_-]+$/.test(this.POLY_API_KEY)) {
            throw new Error('❌ POLY_API_KEY has invalid format');
        }
        // Validate API secret is base64-like
        if (this.POLY_API_SECRET.length < 32) {
            throw new Error('❌ POLY_API_SECRET appears too short (minimum 32 characters)');
        }
        // Validate private key format (should start with 0x for hex)
        if (this.SIGNER_PRIVATE_KEY.startsWith('0x')) {
            if (this.SIGNER_PRIVATE_KEY.length !== 66) { // 0x + 64 hex chars
                console.warn('⚠️  SIGNER_PRIVATE_KEY may have incorrect length for Ethereum private key');
            }
        }
        else if (this.SIGNER_PRIVATE_KEY.length !== 64) {
            console.warn('⚠️  SIGNER_PRIVATE_KEY may have incorrect length');
        }
        // In production, ensure secrets are not default/example values
        if (this.NODE_ENV === 'production') {
            const exampleValues = ['your_api_key', 'example', 'test', 'placeholder'];
            const secrets = [this.POLY_API_KEY, this.POLY_API_SECRET, this.POLY_PASSPHRASE];
            for (const secret of secrets) {
                if (exampleValues.some(ex => secret.toLowerCase().includes(ex))) {
                    throw new Error('❌ CRITICAL: Production environment detected with example/placeholder secrets!');
                }
            }
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
    getBuilderId() {
        return this.BUILDER_ID;
    }
    isProduction() {
        return this.NODE_ENV === 'production';
    }
    /**
     * Validates that secrets are still set (for runtime checks)
     */
    validateSecretsPresent() {
        return !!(this.POLY_API_KEY &&
            this.POLY_API_SECRET &&
            this.POLY_PASSPHRASE &&
            this.SIGNER_PRIVATE_KEY);
    }
    /**
     * Returns a sanitized config object for logging (secrets redacted)
     */
    getSanitizedConfig() {
        return {
            POLY_API_KEY: this.POLY_API_KEY ? `${this.POLY_API_KEY.substring(0, 8)}...` : 'NOT_SET',
            POLY_API_SECRET: this.POLY_API_SECRET ? '***REDACTED***' : 'NOT_SET',
            POLY_PASSPHRASE: this.POLY_PASSPHRASE ? '***REDACTED***' : 'NOT_SET',
            SIGNER_PRIVATE_KEY: this.SIGNER_PRIVATE_KEY ? '***REDACTED***' : 'NOT_SET',
            BUILDER_ID: this.BUILDER_ID || 'NOT_SET',
            NODE_ENV: this.NODE_ENV
        };
    }
}
exports.KeyManager = KeyManager;
