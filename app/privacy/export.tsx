import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/ui';
import { privacyApi } from '@/features/privacy/privacyApi';
import type { ExportJobResponse } from '@/features/privacy/privacyTypes';

/**
 * S-54 — everything, JSON and CSV, one tap, no paywall (G-6, §5.12).
 * The backend export is synchronous today (no blob storage wired up),
 * so this screen just shows completion rather than a real progress
 * state — see docs/PROGRESS.md.
 */
export default function ExportScreen() {
  const [exporting, setExporting] = useState(false);
  const [job, setJob] = useState<ExportJobResponse | null>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await privacyApi.createExport();
      setJob(result);
    } catch {
      Alert.alert("Couldn't export", 'Check your connection and try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">Export your data</Text>
        <Text className="mt-2 font-body text-body-sm text-neutral-400">
          Download everything you have logged, nights, tags, notes, experiments and findings, as
          JSON and CSV. Free, always.
        </Text>

        {job?.status === 'completed' && (
          <Text className="mt-6 font-body text-body-sm text-text">
            Export ready. In a finished build this hands you a file; for now the job completed on
            the server (id {job.id.slice(0, 8)}…).
          </Text>
        )}
      </View>
      <View className="gap-2 pb-4">
        <Button label={exporting ? 'Exporting…' : 'Export as JSON and CSV'} onPress={handleExport} disabled={exporting} block />
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}
