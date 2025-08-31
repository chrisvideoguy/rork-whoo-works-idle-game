import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "@/providers/GameProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const GestureWrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <GameProvider>
          <GestureWrapper style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureWrapper>
        </GameProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}