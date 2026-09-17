import type { ColorValue } from 'react-native';

import { Tabs } from 'expo-router';
import { ClockCounterClockwiseIcon, GearIcon, HouseIcon } from 'phosphor-react-native';

import { colors } from '@/design/tokens';

/**
 * Three tabs, not four — every feature request for a fourth tab belongs
 * inside one of these or in the backlog (nav map, §2). The bar itself
 * never carries the accent: it's chrome, not a produced result — active
 * state reads by icon weight and text color only, same rule as Chip.
 */

type TabIconProps = { color: ColorValue; focused: boolean };

const asHex = (color: ColorValue): string => color as string;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.neutralRamp[500],
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.neutralRamp[800],
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <HouseIcon color={asHex(color)} weight={focused ? 'fill' : 'regular'} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <ClockCounterClockwiseIcon color={asHex(color)} weight={focused ? 'fill' : 'regular'} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <GearIcon color={asHex(color)} weight={focused ? 'fill' : 'regular'} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
