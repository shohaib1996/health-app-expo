import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import { Button } from './Button';

interface VoiceNotePlayerProps {
  uri: string;
}

/** Play-back for a S-13 voice note (day detail, S-31). A single
 * expo-audio player per mounted instance; disposed automatically when
 * the screen unmounts (useAudioPlayer's own lifecycle management). */
export function VoiceNotePlayer({ uri }: VoiceNotePlayerProps) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  return (
    <Button
      label={status.playing ? 'Pause voice note' : 'Play voice note'}
      variant="secondary"
      onPress={() => {
        if (status.playing) {
          player.pause();
        } else {
          if (status.currentTime >= status.duration && status.duration > 0) {
            player.seekTo(0);
          }
          player.play();
        }
      }}
    />
  );
}
