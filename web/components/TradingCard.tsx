'use client';

import React, { useEffect, useState } from 'react';

interface CardMetadata {
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string | number }[];
}

interface TradingCardProps {
    tokenId: string;
}

export const TradingCard: React.FC<TradingCardProps> = ({ tokenId }) => {
    const [metadata, setMetadata] = useState<CardMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/metadata/${tokenId}`)
            .then(res => res.json())
            .then(data => {
                setMetadata(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch metadata", err);
                setLoading(false);
            });
    }, [tokenId]);

    if (loading) return <div className="w-64 h-96 bg-gray-800 animate-pulse rounded-xl border border-gray-700"></div>;
    if (!metadata) return <div className="text-red-500">Error loading card</div>;

    const outcome = metadata.attributes.find(a => a.trait_type === 'Outcome')?.value;
    const isWinning = outcome === 'winning' || outcome === 'won';

    return (
        <div className={`relative w-64 h-96 rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:rotate-1 shadow-2xl ${isWinning ? 'shadow-green-500/50 ring-4 ring-green-500/30' : 'shadow-red-500/50 ring-4 ring-red-500/30'}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${isWinning ? 'from-green-900 via-gray-900 to-black' : 'from-red-900 via-gray-900 to-black'} opacity-90`}></div>

            {/* Holographic Effect Overlay */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

            <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-white/70 bg-black/50 px-2 py-1 rounded">#{tokenId}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${isWinning ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                        {String(outcome)}
                    </span>
                </div>

                <div className="mt-4 flex-grow flex items-center justify-center">
                    {/* Placeholder for Image - in real app would use metadata.image */}
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-white leading-tight tracking-tighter">
                            {metadata.attributes.find(a => a.trait_type === 'Player')?.value}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {metadata.attributes.find(a => a.trait_type === 'Condition')?.value}
                        </p>
                        <p className="text-4xl font-mono font-bold mt-4 text-white">
                            {metadata.attributes.find(a => a.trait_type === 'Current Value')?.value}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {metadata.attributes.map((attr, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-gray-500 uppercase text-[10px]">{attr.trait_type}</span>
                                <span className="text-gray-200 font-medium truncate">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                    {isWinning && (
                        <button className="mt-4 w-full py-2 bg-green-500 hover:bg-green-400 text-black font-bold uppercase text-xs rounded shadow-lg transition-colors">
                            Redeem USDC
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
