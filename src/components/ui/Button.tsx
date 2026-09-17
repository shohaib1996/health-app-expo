import { Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  /** Full-width block button (S-11 Save, S-24 primary action, etc). */
  block?: boolean;
}

/**
 * Outline-only button per the Nocturne system: "Buttons are outlined
 * (1px accent border on transparent), not solid-filled." Never carries
 * the accent color itself — accent means "the data supports this," and
 * a CTA is a request, not a result (see S-10/S-20 annotations).
 */
export function Button({ label, variant = 'primary', block, disabled, className, ...rest }: ButtonProps & { className?: string }) {
  const base = 'h-11 items-center justify-center rounded-default border px-4';
  const variantClass =
    variant === 'primary'
      ? 'border-neutral-300 bg-transparent active:bg-neutral-800'
      : variant === 'secondary'
        ? 'border-neutral-700 bg-transparent active:bg-neutral-800'
        : 'border-transparent bg-transparent active:bg-neutral-800';
  const textClass =
    variant === 'ghost' ? 'text-neutral-400' : variant === 'secondary' ? 'text-neutral-300' : 'text-text';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={cn(base, variantClass, block && 'w-full', disabled && 'opacity-45', className)}
      {...rest}
    >
      <Text className={cn('font-heading text-body-sm', textClass)}>{label}</Text>
    </Pressable>
  );
}
