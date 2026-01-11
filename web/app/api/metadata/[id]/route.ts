import { NextResponse } from 'next/server';
import { getClearSportsData } from '@/lib/clearSports';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const sportsData = await getClearSportsData(id);

    // Generate dynamic image URL (mock)
    // In real implementation, this might call an image generation service or return a pre-generated URL
    const imageUrl = `https://generative-cards.com/api/image?player=${sportsData.playerId}&status=${sportsData.outcome}`;

    const metadata = {
        name: `${sportsData.playerName} - ${sportsData.condition} > ${sportsData.threshold}`,
        description: `Conditional Market Card for ${sportsData.playerName}. Status: ${sportsData.status}`,
        image: imageUrl,
        external_url: `https://polymarket.com/market/${id}`,
        attributes: [
            { trait_type: "Player", value: sportsData.playerName },
            { trait_type: "Condition", value: sportsData.condition },
            { trait_type: "Threshold", value: sportsData.threshold },
            { trait_type: "Current Value", value: sportsData.currentValue },
            { trait_type: "Status", value: sportsData.status },
            { trait_type: "Outcome", value: sportsData.outcome }
        ]
    };

    return NextResponse.json(metadata);
}
