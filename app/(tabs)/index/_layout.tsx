import { COLOR_PRIMARY_DARK, COLOR_TEXT_ACCENT } from '@/constants/colors';
import { Stack } from 'expo-router';
import React from 'react';

export default function IndexLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="booking" 
        options={{
          presentation: 'card',
          headerShown: true,
          title: 'Booking Details',
          headerStyle: {
            backgroundColor: COLOR_PRIMARY_DARK,
          },
          headerTintColor: COLOR_TEXT_ACCENT,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}
