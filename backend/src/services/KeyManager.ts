import dotenv from 'dotenv';

dotenv.config();

export class KeyManager {
    private static instance: KeyManager;
    private POLY_API_KEY: string;
    private POLY_API_SECRET: string;
    private POLY_PASSPHRASE: string;
    private SIGNER_PRIVATE_KEY: string;

    private constructor() {
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

    public static getInstance(): KeyManager {
        if (!KeyManager.instance) {
            KeyManager.instance = new KeyManager();
        }
        return KeyManager.instance;
    }

    public getPolyApiKey(): string {
        return this.POLY_API_KEY;
    }

    public getPolyApiSecret(): string {
        return this.POLY_API_SECRET;
    }

    public getPolyPassphrase(): string {
        return this.POLY_PASSPHRASE;
    }

    public getSignerPrivateKey(): string {
        return this.SIGNER_PRIVATE_KEY;
    }
}
