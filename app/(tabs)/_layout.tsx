import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { COLOR_TEXT_ACCENT } from '../../constants/colors';
import { useChatContext } from '../../contexts/ChatContext';

export default function TabLayout() {
  const { isChatMode } = useChatContext();

  return (
      <Tabs
      screenOptions={{
        headerShown: false,
          tabBarActiveTintColor: COLOR_TEXT_ACCENT,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
          tabBarBackground: () => (
            <LinearGradient
              colors={[
                'rgba(11, 21, 69, 0.92)',
                'rgba(10, 10, 10, 0.96)'
              ]}
              style={{ flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
            />
          ),
        tabBarStyle: {
            backgroundColor: 'transparent',
          borderTopWidth: 0,
            borderTopColor: 'rgba(20, 52, 203, 0.25)',
            height: 84,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          position: 'absolute',
          paddingBottom: 10,
          paddingTop: 10,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 12,
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
