import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/design/tokens';
import { cn } from '@/lib/cn';

interface TextFieldProps extends TextInputProps {
  label: string;
}

/** S-21's "When" / "I will" fields — square inside the 4px card per the
 * nested-radius rule (padding floors the inner radius to 0, per the
 * mockup annotation), so this input has no radius of its own. */
export function TextField({ label, className, ...rest }: TextFieldProps & { className?: string }) {
  return (
    <View className={cn('gap-1.5', className)}>
      <Text className="font-heading text-h5 text-text">{label}</Text>
      <View className="rounded-default border border-neutral-700 px-3 py-3">
        <TextInput
          placeholderTextColor={colors.neutralRamp[600]}
          className="font-body text-body text-text"
          {...rest}
        />
      </View>
    </View>
  );
}
