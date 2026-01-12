import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Users } from 'lucide-react-native';
import { Market } from '@/types';
import { calculateImpliedProbability, formatVolume } from '@/lib/api';

interface MarketCardProps {
    market: Market;
    onPress?: () => void;
}

export default function MarketCard({ market, onPress }: MarketCardProps) {
    const yesPrice = calculateImpliedProbability(market.outcomePrices[0]);
    const noPrice = calculateImpliedProbability(market.outcomePrices[1]);

    return (
        <Pressable
            onPress={onPress}
            className="mb-4"
            style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
        >
            <BlurView intensity={15} tint="dark" className="overflow-hidden rounded-2xl border border-white/10">
                {/* Gradient Accent */}
                <LinearGradient
                    colors={['rgba(99, 102, 241, 0.3)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute w-full h-full"
                />

                <View className="p-4 bg-black/20">
                    {/* Category Badge */}
                    <View className="flex-row items-center mb-2">
                        <View className="bg-indigo-500/30 px-3 py-1 rounded-full border border-indigo-400/30">
                            <Text className="text-indigo-300 text-xs font-semibold">NBA</Text>
                        </View>
                    </View>

                    {/* Question */}
                    <Text className="text-white text-lg font-bold mb-3">{market.question}</Text>

                    {/* Odds Display */}
                    <View className="flex-row gap-3 mb-4">
                        {/* YES */}
                        <View className="flex-1 bg-green-500/20 border border-green-400/30 rounded-xl p-3">
                            <Text className="text-green-300 text-xs font-semibold mb-1">YES</Text>
                            <Text className="text-white text-2xl font-bold">{yesPrice}¢</Text>
                        </View>

                        {/* NO */}
                        <View className="flex-1 bg-red-500/20 border border-red-400/30 rounded-xl p-3">
                            <Text className="text-red-300 text-xs font-semibold mb-1">NO</Text>
                            <Text className="text-white text-2xl font-bold">{noPrice}¢</Text>
                        </View>
                    </View>

                    {/* Footer Stats */}
                    <View className="flex-row items-center justify-between pt-3 border-t border-white/10">
                        <View className="flex-row items-center gap-2">
                            <TrendingUp size={16} color="#9CA3AF" />
                            <Text className="text-gray-400 text-sm">Volume: {formatVolume(market.volumeNum)}</Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Users size={16} color="#9CA3AF" />
                            <Text className="text-gray-400 text-sm">Active</Text>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Pressable>
    );
}
