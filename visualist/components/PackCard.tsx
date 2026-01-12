import { useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Package } from 'lucide-react-native';
import { shakeAnimation, breathingAnimation, glowPulse } from '@/lib/animations';

const { width } = Dimensions.get('window');
const PACK_SIZE = width * 0.6;

interface PackCardProps {
    onShake: () => void;
    isShaking: boolean;
}

export default function PackCard({ onShake, isShaking }: PackCardProps) {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const glowOpacity = useSharedValue(0.3);

    // Breathing animation when idle
    useEffect(() => {
        scale.value = breathingAnimation();
        glowOpacity.value = glowPulse();
    }, []);

    // Shake animation when triggered
    useEffect(() => {
        if (isShaking) {
            rotation.value = shakeAnimation(15);
        }
    }, [isShaking]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value}deg` },
            { scale: scale.value },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    return (
        <Pressable onPress={onShake} className="items-center justify-center">
            <Animated.View style={animatedStyle}>
                {/* Glow Effect */}
                <Animated.View
                    style={[glowStyle]}
                    className="absolute -inset-8"
                >
                    <LinearGradient
                        colors={['rgba(99, 102, 241, 0.6)', 'rgba(139, 92, 246, 0.4)', 'transparent']}
                        className="w-full h-full rounded-full"
                        style={{ width: PACK_SIZE + 64, height: PACK_SIZE + 64 }}
                    />
                </Animated.View>

                {/* Pack Card */}
                <BlurView
                    intensity={20}
                    tint="dark"
                    className="overflow-hidden rounded-3xl border-2 border-white/20"
                    style={{ width: PACK_SIZE, height: PACK_SIZE * 1.4 }}
                >
                    <LinearGradient
                        colors={['#4c1d95', '#5b21b6', '#6d28d9']}
                        className="w-full h-full items-center justify-center p-6"
                    >
                        {/* Pack Icon */}
                        <View className="bg-white/10 p-6 rounded-full mb-4">
                            <Package size={64} color="#fff" strokeWidth={2} />
                        </View>

                        {/* Pack Title */}
                        <Text className="text-white text-2xl font-bold text-center mb-2">
                            NBA Market Pack
                        </Text>
                        <Text className="text-purple-200 text-sm text-center mb-8">
                            Tap to open
                        </Text>

                        {/* Pack Details */}
                        <View className="bg-black/30 rounded-xl p-4 w-full border border-white/10">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-300 text-sm">Cards Inside</Text>
                                <Text className="text-white font-bold">3</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-300 text-sm">Rarity</Text>
                                <Text className="text-purple-300 font-bold">Mixed</Text>
                            </View>
                        </View>

                        {/* Shimmer Effect */}
                        <View className="absolute top-0 left-0 right-0 h-32 opacity-30">
                            <LinearGradient
                                colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-full h-full"
                            />
                        </View>
                    </LinearGradient>
                </BlurView>
            </Animated.View>

            {/* Instruction Text */}
            <Text className="text-gray-400 text-sm mt-6 text-center">
                {isShaking ? 'Opening...' : 'Tap the pack to open'}
            </Text>
        </Pressable>
    );
}
