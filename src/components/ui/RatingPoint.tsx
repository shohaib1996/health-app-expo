import { Pressable, Text } from 'react-native';

import { cn } from '@/lib/cn';

/** Hollow-to-filled glyphs, five steps — matches the mockups' S-11/S-32
 * mood & energy control exactly (○ ◔ ◑ ◕ ●). */
const GLYPHS = ['○', '◔', '◑', '◕', '●'] as const;

interface RatingPointProps {
  index: 0 | 1 | 2 | 3 | 4;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

/**
 * One point in the 5-point mood/energy control. Sized for a thumb
 * (44px minimum, per S-11's "Done when") — selection is fill weight
 * and border, never colour, same rule as Chip.
 */
export function RatingPoint({ index, selected, onPress, accessibilityLabel }: RatingPointProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={cn(
        'aspect-square min-h-11 flex-1 items-center justify-center rounded-default border',
        selected ? 'border-text bg-neutral-800' : 'border-neutral-700 bg-transparent',
      )}
    >
      <Text className={cn('text-base', selected ? 'text-text' : 'text-neutral-500')}>{GLYPHS[index]}</Text>
    </Pressable>
  );
}
