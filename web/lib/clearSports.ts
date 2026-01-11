export interface ClearSportsData {
    playerId: string;
    playerName: string;
    condition: string;
    threshold: number;
    currentValue: number;
    status: 'LIVE' | 'FINAL';
    outcome: 'winning' | 'losing' | 'won' | 'lost';
}

export async function getClearSportsData(tokenId: string): Promise<ClearSportsData> {
    // Mock implementation returning dynamic data based on tokenId
    // In production, this would fetch from ClearSports API

    // Deterministic mock based on tokenId
    const isOdd = parseInt(tokenId) % 2 === 1;

    return {
        playerId: isOdd ? "23" : "30",
        playerName: isOdd ? "LeBron James" : "Stephen Curry",
        condition: "Points",
        threshold: 25.5,
        currentValue: isOdd ? 28 : 20, // LeBron has 28 (winning), Curry 20 (losing)
        status: 'LIVE',
        outcome: isOdd ? 'winning' : 'losing'
    };
}
