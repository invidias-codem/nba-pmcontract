import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketFeed from '@/components/MarketFeed';

export default function HomeScreen() {
  return (
    <View className="flex-1">
      {/* Dynamic Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        className="absolute w-full h-full"
      />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6 border-b border-white/10">
          <Text className="text-white text-3xl font-bold">NBA Markets</Text>
          <Text className="text-gray-400 mt-1">Trade on player performance & game outcomes</Text>
        </View>

        {/* Market Feed */}
        <MarketFeed />
      </SafeAreaView>
    </View>
  );
}
