import { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Market } from '@/types';
import { fetchNBAMarkets } from '@/lib/api';
import MarketCard from './MarketCard';

export default function MarketFeed() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadMarkets = async () => {
        try {
            const data = await fetchNBAMarkets();
            setMarkets(data);
        } catch (error) {
            console.error('Failed to load markets:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMarkets();
        setRefreshing(false);
    };

    useEffect(() => {
        loadMarkets();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#6366F1" />
                <Text className="text-white mt-4">Loading markets...</Text>
            </View>
        );
    }

    if (markets.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-8">
                <Text className="text-white text-xl font-bold mb-2">No Active Markets</Text>
                <Text className="text-gray-400 text-center">
                    Check back soon for new NBA prediction markets!
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={markets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <MarketCard
                    market={item}
                    onPress={() => {
                        // TODO: Navigate to market details
                        console.log('Market pressed:', item.id);
                    }}
                />
            )}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#6366F1"
                />
            }
            showsVerticalScrollIndicator={false}
        />
    );
}
