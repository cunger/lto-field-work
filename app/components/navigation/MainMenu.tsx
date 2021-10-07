import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../../screens/Home';
import DataEntryMenu from './DataEntryMenu';
import History from '../../screens/History';
import Settings from '../../screens/Settings';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const MainMenu = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: '#6ec1e4',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name='Dashboard'
        component={Home}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Feather name='clipboard' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='New'
        component={DataEntryMenu}
        options={{
          tabBarLabel: 'New',
          tabBarIcon: ({ color, size }) => (
            <Feather name='plus-circle' size={size} color={color} />
          ),
          headerTitle: 'Data Entry',
        }}
      />
      <Tab.Screen
        name='Sync data'
        component={History}
        options={{
          tabBarLabel: 'Sync',
          tabBarIcon: ({ color, size }) => (
            <Feather name='upload' size={size} color={color} />
          ),
          tabBarBadge: 2,
        }}
      />
      <Tab.Screen
        name='Settings'
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Feather name='settings' size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainMenu;
