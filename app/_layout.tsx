import {
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import { Jost_300Light, Jost_400Regular, Jost_500Medium } from '@expo-google-fonts/jost';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplash } from '../components/AnimatedSplash';
import { I18nProvider } from '../i18n';
import { colors } from '../theme/theme';
import { WishlistProvider } from '../utils/wishlistStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
  });
  const [splashDone, setSplashDone] = useState(false);
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.black }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <SafeAreaProvider>
        <I18nProvider>
          <WishlistProvider>
            <StatusBar style={splashDone ? 'dark' : 'light'} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.ivory },
                animation: 'fade_from_bottom',
                animationDuration: 380,
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="personal-shopper" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </Stack>
            {!splashDone && <AnimatedSplash onDone={() => setSplashDone(true)} />}
          </WishlistProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
