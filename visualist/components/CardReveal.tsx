import { useEffect } from 'react';
import { View, Text, Dimensions, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withTiming,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Star } from 'lucide-react-native';
import { Market } from '@/types';
import { calculateImpliedProbability, formatVolume } from '@/lib/api';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.85, 400);
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface CardRevealProps {
    market: Market;
    index: number;
    totalCards: number;
}

// Extract player name from market question
function extractPlayerInfo(question: string): { name: string; team: string; stat: string } {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('lebron')) {
        return { name: 'LeBron James', team: 'Lakers', stat: '30+ PTS' };
    } else if (lowerQ.includes('curry') || lowerQ.includes('steph')) {
        return { name: 'Stephen Curry', team: 'Warriors', stat: '5+ 3PT' };
    } else if (lowerQ.includes('giannis')) {
        return { name: 'Giannis', team: 'Bucks', stat: 'Triple-Double' };
    } else if (lowerQ.includes('lakers')) {
        return { name: 'Lakers', team: 'LAL', stat: 'Win vs Celtics' };
    } else if (lowerQ.includes('bucks')) {
        return { name: 'Bucks', team: 'MIL', stat: '120+ PTS' };
    }

    return { name: 'NBA', team: 'League', stat: 'Market' };
}

export default function CardReveal({ market, index, totalCards }: CardRevealProps) {
    // Start at 180 degrees to show card back first
    const rotateY = useSharedValue(180);
    const translateY = useSharedValue(400);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    const yesPrice = calculateImpliedProbability(market.outcomePrices[0]);
    const playerInfo = extractPlayerInfo(market.question);

    useEffect(() => {
        const delay = index * 300;

        // Slide in from bottom
        translateY.value = withDelay(
            delay,
            withSpring(0, {
                damping: 20,
                stiffness: 90,
                mass: 1,
            })
        );

        opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));

        scale.value = withDelay(
            delay,
            withSpring(1, {
                damping: 15,
                stiffness: 100,
            })
        );

        // Flip from 180 to 360 (which is 0) to reveal front
        rotateY.value = withDelay(
            delay + 300,
            withTiming(360, {
                duration: 800,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
        );
    }, [index]);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1500 },
            { rotateY: `${rotateY.value}deg` },
        ],
    }));

    // Card back fades out from 180 to 270
    const frontFaceStyle = useAnimatedStyle(() => ({
        opacity: interpolate(rotateY.value, [180, 270], [1, 0]),
    }));

    // Card front fades in from 270 to 360
    const backFaceStyle = useAnimatedStyle(() => ({
        opacity: interpolate(rotateY.value, [270, 360], [0, 1]),
    }));

    return (
        <Animated.View style={[containerStyle, { width: CARD_WIDTH, height: CARD_HEIGHT, marginBottom: 16 }]}>
            <Animated.View style={[cardStyle, { width: '100%', height: '100%' }]}>
                {/* Card Back (shown first) - Mystery card */}
                <Animated.View
                    style={[
                        frontFaceStyle,
                        { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },
                    ]}
                >
                    <BlurView intensity={10} tint="dark" className="w-full h-full rounded-3xl overflow-hidden border-2 border-purple-500/50">
                        <LinearGradient
                            colors={['#1e1b4b', '#312e81', '#4c1d95']}
                            className="w-full h-full items-center justify-center p-6"
                        >
                            {/* Pattern overlay */}
                            <View className="absolute inset-0 opacity-10">
                                <View className="flex-row flex-wrap">
                                    {Array.from({ length: 50 }).map((_, i) => (
                                        <Star key={i} size={20} color="#fff" className="m-2" />
                                    ))}
                                </View>
                            </View>

                            <Text className="text-white text-7xl font-bold opacity-30">?</Text>
                            <Text className="text-purple-300 text-xl font-bold mt-4">NBA CARD</Text>
                            <Text className="text-purple-400 text-sm mt-2">Market Pack</Text>
                        </LinearGradient>
                    </BlurView>
                </Animated.View>

                {/* Card Front (revealed) - NBA Player Card */}
                <Animated.View
                    style={[
                        backFaceStyle,
                        { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },
                    ]}
                >
                    <BlurView intensity={15} tint="dark" className="w-full h-full rounded-3xl overflow-hidden border-2 border-white/20">
                        {/* Gradient background */}
                        <LinearGradient
                            colors={['#1e3a8a', '#1e40af', '#3b82f6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="absolute w-full h-full"
                        />

                        <View className="h-full p-5">
                            {/* Header */}
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30">
                                    <Text className="text-white text-xs font-bold">{playerInfo.team}</Text>
                                </View>
                                <View className="bg-yellow-500/30 px-3 py-1.5 rounded-full border border-yellow-400/50">
                                    <Text className="text-yellow-200 text-xs font-bold">ACTIVE</Text>
                                </View>
                            </View>

                            {/* Player Name */}
                            <View className="flex-1 justify-center items-center">
                                <View className="bg-black/30 rounded-2xl p-6 w-full border border-white/20">
                                    <Text className="text-white text-3xl font-bold text-center mb-2">
                                        {playerInfo.name}
                                    </Text>
                                    <Text className="text-blue-200 text-lg text-center font-semibold">
                                        {playerInfo.stat}
                                    </Text>
                                </View>

                                {/* Odds Display */}
                                <View className="mt-6 w-full">
                                    <Text className="text-white/70 text-sm text-center mb-3">Market Odds</Text>
                                    <View className="flex-row gap-3">
                                        <View className="flex-1 bg-green-500/30 border-2 border-green-400/60 rounded-xl p-4">
                                            <Text className="text-green-300 text-xs font-bold mb-1 text-center">YES</Text>
                                            <Text className="text-white text-3xl font-bold text-center">{yesPrice}¢</Text>
                                        </View>
                                        <View className="flex-1 bg-red-500/30 border-2 border-red-400/60 rounded-xl p-4">
                                            <Text className="text-red-300 text-xs font-bold mb-1 text-center">NO</Text>
                                            <Text className="text-white text-3xl font-bold text-center">
                                                {100 - yesPrice}¢
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Footer Stats */}
                            <View className="bg-black/40 rounded-xl p-3 border border-white/10">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-1">
                                        <Text className="text-gray-400 text-xs">Volume</Text>
                                        <Text className="text-white font-bold text-sm">{formatVolume(market.volumeNum)}</Text>
                                    </View>
                                    <View className="flex-1 items-end">
                                        <Text className="text-gray-400 text-xs">ID</Text>
                                        <Text className="text-white font-bold text-sm">#{market.id}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Shine effect */}
                        <View className="absolute top-0 right-0 w-32 h-32 opacity-20" pointerEvents="none">
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.6)', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-full h-full rounded-full"
                            />
                        </View>
                    </BlurView>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    );
}
