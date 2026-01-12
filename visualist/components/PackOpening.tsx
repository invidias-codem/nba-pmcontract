import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PackCard from './PackCard';
import CardReveal from './CardReveal';
import { Market } from '@/types';

type PackState = 'idle' | 'shaking' | 'revealing' | 'revealed';

interface PackOpeningProps {
    markets: Market[];
}

export default function PackOpening({ markets }: PackOpeningProps) {
    const [packState, setPackState] = useState<PackState>('idle');

    const handleShake = () => {
        if (packState !== 'idle') return;

        // Start shaking
        setPackState('shaking');

        // After shake animation, start revealing
        setTimeout(() => {
            setPackState('revealing');
        }, 1000);

        // Mark as fully revealed after all cards animate
        setTimeout(() => {
            setPackState('revealed');
        }, 1000 + markets.length * 400 + 1000);
    };

    const handleReset = () => {
        setPackState('idle');
    };

    return (
        <View className="flex-1">
            <LinearGradient
                colors={['#0f0f23', '#1a1a2e', '#16213e']}
                className="absolute w-full h-full"
            />

            <SafeAreaView className="flex-1">
                {packState === 'idle' || packState === 'shaking' ? (
                    <View className="flex-1 items-center justify-center">
                        <PackCard onShake={handleShake} isShaking={packState === 'shaking'} />
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={{ padding: 16, alignItems: 'center' }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text className="text-white text-3xl font-bold mb-2 text-center">
                            Your Markets
                        </Text>
                        <Text className="text-gray-400 mb-8 text-center">
                            {packState === 'revealing' ? 'Revealing...' : `${markets.length} markets unlocked!`}
                        </Text>

                        {markets.map((market, index) => (
                            <CardReveal
                                key={market.id}
                                market={market}
                                index={index}
                                totalCards={markets.length}
                            />
                        ))}

                        {packState === 'revealed' && (
                            <View className="mt-4 bg-indigo-500/20 border border-indigo-400/30 rounded-xl p-4 w-full">
                                <Text className="text-white text-center font-semibold mb-2">
                                    Ready to trade?
                                </Text>
                                <Text className="text-gray-400 text-center text-sm">
                                    Head to the Markets tab to place your bets
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
