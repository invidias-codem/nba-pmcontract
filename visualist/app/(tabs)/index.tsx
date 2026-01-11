import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <View className="flex-1">
      {/* Dynamic Background */}
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="absolute w-full h-full"
      />

      <SafeAreaView className="flex-1 items-center justify-center p-4">
        <Text className="text-white text-3xl font-bold mb-8">The Visualist</Text>

        {/* Glassmorphism Card */}
        <BlurView intensity={20} tint="light" className="overflow-hidden rounded-2xl w-full border border-white/20">
          <View className="p-6 bg-white/10">
            <Text className="text-white text-xl font-bold mb-2">Glass Effect</Text>
            <Text className="text-gray-200">
              This card uses the BlurView component and NativeWind for styling.
              The background is a LinearGradient.
            </Text>

            <View className="mt-4 flex-row gap-4">
              <View className="bg-white/20 p-3 rounded-lg flex-1 items-center">
                <Text className="text-white font-bold">Stat 1</Text>
              </View>
              <View className="bg-white/20 p-3 rounded-lg flex-1 items-center">
                <Text className="text-white font-bold">Stat 2</Text>
              </View>
            </View>
          </View>
        </BlurView>

        <View className="mt-8 bg-black/50 p-4 rounded-xl border border-white/10 w-full">
          <Text className="text-white font-mono">Debugging Info:</Text>
          <Text className="text-green-400 mt-2">NativeWind V4 Active</Text>
          <Text className="text-blue-400">Reanimated Ready</Text>
        </View>

      </SafeAreaView>
    </View>
  );
}
