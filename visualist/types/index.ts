// Type definitions for Polymarket and NBA data

export interface Market {
    id: string;
    question: string;
    description: string;
    category: string;
    image?: string;
    icon?: string;
    endDate: string;
    outcomes: string[]; // e.g., ["Yes", "No"]
    outcomePrices: string[]; // Decimal prices for each outcome
    volume: string;
    volumeNum: number;
    active: boolean;
    closed: boolean;
}

export interface PlayerStats {
    player: {
        id: number;
        firstname: string;
        lastname: string;
    };
    team: {
        id: number;
        name: string;
        logo: string;
    };
    points: number;
    pos: string;
    min: string;
    fgm: number;
    fga: number;
    fgp: string;
    ftm: number;
    fta: number;
    ftp: string;
    tpm: number;
    tpa: number;
    tpp: string;
    offReb: number;
    defReb: number;
    totReb: number;
    assists: number;
    pFouls: number;
    steals: number;
    turnovers: number;
    blocks: number;
    plusMinus: string;
}

export interface Game {
    id: number;
    league: string;
    season: number;
    date: {
        start: string;
        end: string | null;
        duration: string | null;
    };
    stage: number;
    status: {
        clock: string | null;
        halftime: boolean;
        short: number;
        long: string;
    };
    periods: {
        current: number;
        total: number;
        endOfPeriod: boolean;
    };
    arena: {
        name: string;
        city: string;
        state: string;
        country: string;
    };
    teams: {
        visitors: {
            id: number;
            name: string;
            nickname: string;
            code: string;
            logo: string;
        };
        home: {
            id: number;
            name: string;
            nickname: string;
            code: string;
            logo: string;
        };
    };
    scores: {
        visitors: {
            win: number;
            loss: number;
            series: {
                win: number;
                loss: number;
            };
            linescore: string[];
            points: number;
        };
        home: {
            win: number;
            loss: number;
            series: {
                win: number;
                loss: number;
            };
            linescore: string[];
            points: number;
        };
    };
}

export interface MarketWithAnalytics extends Market {
    relatedPlayer?: PlayerStats;
    relatedGame?: Game;
}
