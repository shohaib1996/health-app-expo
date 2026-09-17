import { ScrollView, View } from 'react-native';

import { Chip } from '@/components/ui';
import type { TagDefinition } from '@/features/tags/tagCatalog';

interface TagGridProps {
  tags: TagDefinition[];
  selected: string[];
  maxReached: boolean;
  onToggle: (key: string) => void;
}

/** The curated, fixed tag grid (S-11/S-12) — grouped in catalog order,
 * flowed as wrapping chips rather than per-category sections so the
 * most common tags never need a scroll on a typical phone. */
export function TagGrid({ tags, selected, maxReached, onToggle }: TagGridProps) {
  return (
    <ScrollView className="mt-4 flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selected.includes(tag.key);
          return (
            <Chip
              key={tag.key}
              label={tag.label}
              selected={isSelected}
              disabled={maxReached && !isSelected}
              onPress={() => onToggle(tag.key)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
