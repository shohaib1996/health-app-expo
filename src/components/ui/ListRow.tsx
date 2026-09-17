import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

interface ListRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
}

/** A settings/menu row — label, optional trailing value, optional
 * chevron when it navigates. Disabled rows (screen not built yet)
 * dim rather than disappear, so the section list stays honest about
 * what's coming (S-50). */
export function ListRow({ label, value, onPress, disabled }: ListRowProps) {
  const isInteractive = !!onPress && !disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      accessibilityRole={isInteractive ? 'button' : undefined}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityState={{ disabled: !isInteractive }}
      className={cn(
        'flex-row items-center justify-between border-b border-neutral-800 py-3.5',
        disabled && 'opacity-45',
      )}
    >
      <Text className="font-body text-body-sm text-text">{label}</Text>
      <View className="flex-row items-center gap-2">
        {value && <Text className="font-body text-caption text-neutral-500">{value}</Text>}
        {isInteractive && (
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="font-body text-caption text-neutral-500"
          >
            ›
          </Text>
        )}
      </View>
    </Pressable>
  );
}
