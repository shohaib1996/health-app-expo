import { Pressable, Text } from 'react-native';

import { cn } from '@/lib/cn';

interface ChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

/**
 * Curated tag chip (S-12, S-11 tags step). Selection reads by fill
 * weight and border only, never colour — S-11's rule: mood/energy and
 * tag selection must read the same for anyone with a colour deficiency,
 * and no accent appears anywhere on the check-in flow (nothing has
 * produced a result yet).
 */
export function Chip({ label, selected, disabled, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'rounded-default border px-3 py-2.5',
        selected ? 'border-text bg-neutral-800' : 'border-neutral-700 bg-transparent',
        disabled && !selected && 'opacity-50',
      )}
    >
      <Text
        className={cn(
          'font-body text-caption',
          disabled && !selected ? 'text-neutral-700' : selected ? 'text-text' : 'text-neutral-300',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
