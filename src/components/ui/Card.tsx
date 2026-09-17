import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

/** Surface-filled content card. Elevation is an edge + ambient darkness
 * on this dark ground, never a soft light-theme shadow — see elevation
 * tokens in src/design/tokens.ts. */
export function Card({ className, ...rest }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn('rounded-default border border-neutral-800 bg-surface p-4', className)}
      {...rest}
    />
  );
}
