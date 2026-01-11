"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataHydrator = void 0;
class MetadataHydrator {
    constructor() {
        this.isActive = false;
        this.intervalId = null;
        this.INTERVAL_MS = 60000; // 60 seconds
    }
    start() {
        if (this.isActive)
            return;
        this.isActive = true;
        console.log('Metadata Hydrator started.');
        this.intervalId = setInterval(async () => {
            await this.hydrateAllCards();
        }, this.INTERVAL_MS);
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isActive = false;
        console.log('Metadata Hydrator stopped.');
    }
    async hydrateAllCards() {
        console.log('Hydrating metadata for all active cards...');
        // Logic:
        // 1. Fetch all active "Wrapped Cards" from DB
        // 2. Group by Player/Market
        // 3. Batch fetch live stats from ClearSportsAPI
        // 4. Update the stored metadata/attributes in DB/Cache
        // Example stub:
        // const cards = await db.getActiveCards();
        // for (const card of cards) {
        //    const updatedMeta = await CardWrapper.getInstance().wrapMarketToCard(card.questionId);
        //    await db.updateCardMetadata(card.id, updatedMeta);
        // }
    }
}
exports.MetadataHydrator = MetadataHydrator;
