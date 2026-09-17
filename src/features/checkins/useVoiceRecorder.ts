import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

/** S-13's 20-second cap. */
const MAX_DURATION_MS = 20_000;

interface UseVoiceRecorderResult {
  isRecording: boolean;
  remainingSeconds: number;
  hasPermission: boolean | null;
  uri: string | null;
  start: () => Promise<void>;
  stop: () => Promise<string | null>;
  reset: () => void;
}

/**
 * S-13 recording — audio is written to disk as it records (expo-audio
 * streams to file, not a memory buffer), so losing a recording on an
 * interruption isn't possible the way an in-memory approach could
 * lose one (spec's "audio is written to disk before transcription is
 * attempted" requirement, satisfied trivially since there's no
 * transcription step yet — see the note below).
 *
 * On-device transcription (the mockup's "recording -> transcribing ->
 * editable transcript" flow) is deferred: it needs a speech-to-text
 * engine this project hasn't picked yet. The recording itself is
 * fully real and playable; the user types a note separately if they
 * want text alongside it.
 */
export function useVoiceRecorder(): UseVoiceRecorderResult {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 200);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const autoStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoStopTimer.current) clearTimeout(autoStopTimer.current);
    };
  }, []);

  const start = useCallback(async () => {
    const permission = await requestRecordingPermissionsAsync();
    setHasPermission(permission.granted);
    if (!permission.granted) return;

    setUri(null);
    await recorder.prepareToRecordAsync();
    recorder.record();

    autoStopTimer.current = setTimeout(() => {
      void recorder.stop().then(() => setUri(recorder.uri));
    }, MAX_DURATION_MS);
  }, [recorder]);

  const stop = useCallback(async (): Promise<string | null> => {
    if (autoStopTimer.current) {
      clearTimeout(autoStopTimer.current);
      autoStopTimer.current = null;
    }
    await recorder.stop();
    const finalUri = recorder.uri;
    setUri(finalUri);
    return finalUri;
  }, [recorder]);

  const reset = useCallback(() => setUri(null), []);

  const remainingMs = Math.max(0, MAX_DURATION_MS - state.durationMillis);

  return {
    isRecording: state.isRecording,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    hasPermission,
    uri,
    start,
    stop,
    reset,
  };
}
