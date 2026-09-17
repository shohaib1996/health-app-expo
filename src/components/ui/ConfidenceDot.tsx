import { View } from 'react-native';

import { cn } from '@/lib/cn';

/** The engine's three states, 1:1 with the three confidence tokens.
 * Never used for anything else. See src/design/tokens.ts `confidence`. */
export type ConfidenceRole = 'supported' | 'noEffect' | 'insufficientData';

const DOT_CLASS: Record<ConfidenceRole, string> = {
  supported: 'bg-accent',
  noEffect: 'bg-neutral-300',
  insufficientData: 'bg-neutral-500',
};

export function ConfidenceDot({ role, className }: { role: ConfidenceRole; className?: string }) {
  return <View className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASS[role], className)} />;
}
