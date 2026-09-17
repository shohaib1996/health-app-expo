import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

import type { ConfidenceRole } from './ConfidenceDot';

const HERO_TEXT_CLASS: Record<ConfidenceRole, string> = {
  supported: 'text-accent',
  noEffect: 'text-neutral-300',
  insufficientData: 'text-neutral-500',
};

interface HeroNumberProps {
  /** e.g. "+38", "0", "6 of 14" — a pre-formatted string, never computed here. */
  value: string;
  unit: string;
  /** "Likely range: +21 to +54 min" — always present, never a bare point estimate (G-4 / S-24). */
  likelyRange: string;
  role: ConfidenceRole;
  size?: 'hero' | 'h2';
}

/**
 * The hero number slot shared by S-16 (pattern detail) and S-24
 * (verdict) — same type scale, same token roles, same likely-range line
 * under every number so no single value overstates its precision.
 */
export function HeroNumber({ value, unit, likelyRange, role, size = 'hero' }: HeroNumberProps) {
  return (
    // Grouped into one accessible element — otherwise a screen reader
    // announces "+38", then a pause, then "minutes of sleep", then
    // another pause, then the likely-range line, as three unrelated
    // fragments instead of one statement (G-9).
    <View accessible accessibilityLabel={`${value} ${unit}. ${likelyRange}`}>
      <Text
        className={cn(
          'font-heading tabular-nums',
          size === 'hero' ? 'text-hero' : 'text-h2',
          HERO_TEXT_CLASS[role],
        )}
      >
        {value}
      </Text>
      <Text className="mt-1 font-body text-body-sm text-neutral-400">{unit}</Text>
      <Text className="mt-1 font-body text-caption text-neutral-500">{likelyRange}</Text>
    </View>
  );
}
