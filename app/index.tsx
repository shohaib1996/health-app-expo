import { Text, View } from 'react-native';

import { colors, typeScale } from '@/design';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 }}>
      <Text style={{ ...typeScale.h1, fontFamily: 'Inter_500Medium', color: colors.text }}>Hunch</Text>
    </View>
  );
}
