import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';;
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "#8492c1",
        tabBarActiveTintColor: "#fbfdfd",
        tabBarStyle: {
          backgroundColor: "#5fadae",
          borderTopWidth: 1,
          borderTopColor: "#a9bcd4",
          height: 84,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.and.arrow.up" color={color} />,
        }}
      />
            <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.stack.3d.down.right" color={color} />,
        }}
        />
        <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info.circle.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}
