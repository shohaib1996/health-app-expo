import { ScrollView, Text, View } from 'react-native';

import { Card, ConfidenceDot, HeroNumber } from '@/components/ui';

export default function Index() {
  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="gap-4 px-6 py-10">
      <Text className="font-heading text-h1 text-text">Hunch</Text>
      <Text className="font-body text-body text-neutral-400">Component kit wired.</Text>

      <Card className="gap-2">
        <HeroNumber value="+1.4" unit="mood points on longer-sleep nights" likelyRange="Likely range: +0.8 to +2.0" role="supported" />
        <View className="flex-row items-center gap-2 pt-2">
          <ConfidenceDot role="supported" />
          <Text className="font-body text-caption text-neutral-500">Sleep and mood move together on 24 nights.</Text>
        </View>
      </Card>
    </ScrollView>
  );
}
