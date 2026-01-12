import { CardWrapper } from '../src/services/CardWrapper';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env from root
dotenv.config({ path: resolve(__dirname, '../../.env') });

async function main() {
    console.log("Starting Test Listener...");
    const wrapper = CardWrapper.getInstance();

    // Keep alive
    setInterval(() => {
        console.log("Listening...");
    }, 5000);
}

main().catch(console.error);
