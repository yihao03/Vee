import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useChatContext } from '../../contexts/ChatContext';

// Color Palette
const COLOR_PRIMARY_DARK = '#120025';    // Very dark, rich indigo (Used for main background/card blocks)
const COLOR_TEXT_ACCENT = '#F5E8C7';     // Soft gold/cream for highlights and active state
const COLOR_TEXT_LIGHT = '#FFFFFF';      // Pure white for primary text

export default function TabLayout() {
  const { isChatMode } = useChatContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLOR_TEXT_ACCENT,
        tabBarInactiveTintColor: COLOR_TEXT_LIGHT,
        tabBarStyle: {
          backgroundColor: COLOR_PRIMARY_DARK,
          borderTopWidth: 0,
          height: 80,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          paddingBottom: 10,
          paddingTop: 10,
          display: isChatMode ? 'none' : 'flex',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
