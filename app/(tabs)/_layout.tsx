import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { GoldIcon } from '../../components/gold';
import { useI18n } from '../../i18n';
import { colors, fonts } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { useWishlist } from '../../utils/wishlistStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const icon =
  (outline: IconName, filled: IconName) =>
  ({ focused, size }: { focused: boolean; size: number }) =>
    focused ? <GoldIcon name={filled} size={size - 1} /> : <Ionicons name={outline} size={size - 1} color={colors.muted} />;

export default function TabsLayout() {
  const { t } = useI18n();
  const { ids } = useWishlist();
  return (
    <Tabs
      screenListeners={{ tabPress: () => tapLight() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.ivory,
          borderTopColor: colors.stone,
          borderTopWidth: Platform.OS === 'web' ? 1 : 0.5,
          minHeight: 60,
        },
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 9.5, letterSpacing: 1.4, textTransform: 'uppercase' },
        tabBarItemStyle: { paddingTop: 4 },
        sceneStyle: { backgroundColor: colors.ivory },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="shop" options={{ title: t('tabs.shop'), tabBarIcon: icon('search-outline', 'search') }} />
      <Tabs.Screen
        name="looks"
        options={{ title: t('tabs.looks'), tabBarIcon: icon('play-circle-outline', 'play-circle') }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: t('tabs.wishlist'),
          tabBarIcon: icon('heart-outline', 'heart'),
          tabBarBadge: ids.length ? ids.length : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.ink, color: colors.ivory, fontSize: 10, fontFamily: fonts.sansMedium },
        }}
      />
      <Tabs.Screen name="store" options={{ title: t('tabs.store'), tabBarIcon: icon('location-outline', 'location') }} />
    </Tabs>
  );
}
