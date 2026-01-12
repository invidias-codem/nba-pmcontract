import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PackOpening from '@/components/PackOpening';
import { Market } from '@/types';
import { fetchNBAMarkets } from '@/lib/api';

export default function PackScreen() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMarkets();
    }, []);

    const loadMarkets = async () => {
        try {
            const data = await fetchNBAMarkets();
            // Take first 3 markets for the pack
            setMarkets(data.slice(0, 3));
        } catch (error) {
            console.error('Failed to load markets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#6366F1" style={{ flex: 1 }} />
        );
    }

    return <PackOpening markets={markets} />;
}
