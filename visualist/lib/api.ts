import { Market, PlayerStats, Game, MarketWithAnalytics } from '@/types';

const POLYMARKET_API_BASE = 'https://gamma-api.polymarket.com';
const NBA_API_BASE = 'https://v2.nba.api-sports.io';

// Mock NBA markets for demonstration
// In production, these would come from Polymarket API filtered by NBA tags
const MOCK_NBA_MARKETS: Market[] = [
    {
        id: '1',
        question: 'Will LeBron James score 30+ points vs Warriors?',
        description: 'This market resolves to "Yes" if LeBron James scores 30 or more points in the Lakers vs Warriors game on January 15, 2026.',
        category: 'Sports',
        image: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-lebron.png',
        endDate: '2026-01-15T00:00:00Z',
        outcomes: ['Yes', 'No'],
        outcomePrices: ['0.62', '0.38'],
        volume: '45230.50',
        volumeNum: 45230.50,
        active: true,
        closed: false,
    },
    {
        id: '2',
        question: 'Will the Lakers win against the Celtics?',
        description: 'This market resolves to "Yes" if the Los Angeles Lakers defeat the Boston Celtics on January 16, 2026.',
        category: 'Sports',
        endDate: '2026-01-16T00:00:00Z',
        outcomes: ['Yes', 'No'],
        outcomePrices: ['0.55', '0.45'],
        volume: '78450.25',
        volumeNum: 78450.25,
        active: true,
        closed: false,
    },
    {
        id: '3',
        question: 'Will Steph Curry make 5+ three-pointers?',
        description: 'This market resolves to "Yes" if Stephen Curry makes 5 or more three-point shots in the Warriors vs Suns game.',
        category: 'Sports',
        endDate: '2026-01-17T00:00:00Z',
        outcomes: ['Yes', 'No'],
        outcomePrices: ['0.48', '0.52'],
        volume: '32100.75',
        volumeNum: 32100.75,
        active: true,
        closed: false,
    },
    {
        id: '4',
        question: 'Will the Bucks score 120+ points vs Nets?',
        description: 'This market resolves to "Yes" if the Milwaukee Bucks score 120 or more points against the Brooklyn Nets.',
        category: 'Sports',
        endDate: '2026-01-18T00:00:00Z',
        outcomes: ['Yes', 'No'],
        outcomePrices: ['0.71', '0.29'],
        volume: '56780.00',
        volumeNum: 56780.00,
        active: true,
        closed: false,
    },
    {
        id: '5',
        question: 'Will Giannis record a triple-double?',
        description: 'This market resolves to "Yes" if Giannis Antetokounmpo records a triple-double (10+ in three stat categories) in the next Bucks game.',
        category: 'Sports',
        endDate: '2026-01-19T00:00:00Z',
        outcomes: ['Yes', 'No'],
        outcomePrices: ['0.35', '0.65'],
        volume: '41250.30',
        volumeNum: 41250.30,
        active: true,
        closed: false,
    },
];

/**
 * Fetch NBA markets from Polymarket Gamma API
 * Currently returns mock data - replace with real API call when ready
 */
export async function fetchNBAMarkets(): Promise<Market[]> {
    try {
        // TODO: Replace with real API call
        // const response = await fetch(`${POLYMARKET_API_BASE}/markets?closed=false&limit=50`);
        // const data = await response.json();
        // Filter for NBA markets based on tags or keywords
        // return data.filter((m: Market) => m.category === 'Sports' && isNBAMarket(m));

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_NBA_MARKETS;
    } catch (error) {
        console.error('Error fetching NBA markets:', error);
        return [];
    }
}

/**
 * Fetch player statistics from API-Sports NBA API
 * Requires API key in production
 */
export async function fetchPlayerStats(playerId: number, gameId?: number): Promise<PlayerStats | null> {
    try {
        // TODO: Add API key from environment variables
        // const API_KEY = process.env.EXPO_PUBLIC_NBA_API_KEY;
        // const response = await fetch(`${NBA_API_BASE}/players/statistics?id=${playerId}${gameId ? `&game=${gameId}` : ''}`, {
        //   headers: {
        //     'x-apisports-key': API_KEY,
        //   },
        // });
        // const data = await response.json();
        // return data.response[0];

        return null; // Return null for now
    } catch (error) {
        console.error('Error fetching player stats:', error);
        return null;
    }
}

/**
 * Fetch NBA games from API-Sports
 */
export async function fetchGames(date?: string): Promise<Game[]> {
    try {
        // TODO: Implement real API call
        // const API_KEY = process.env.EXPO_PUBLIC_NBA_API_KEY;
        // const dateParam = date || new Date().toISOString().split('T')[0];
        // const response = await fetch(`${NBA_API_BASE}/games?date=${dateParam}`, {
        //   headers: {
        //     'x-apisports-key': API_KEY,
        //   },
        // });
        // const data = await response.json();
        // return data.response;

        return [];
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
}

/**
 * Helper to calculate implied probability from decimal odds
 */
export function calculateImpliedProbability(price: string): number {
    const decimal = parseFloat(price);
    return Math.round(decimal * 100);
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
    if (volume >= 1000000) {
        return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
        return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
}
