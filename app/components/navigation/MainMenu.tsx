import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../../screens/Home';
import DataEntryMenu from './DataEntryMenu';
import Datastore from '../data/LocalDatastore';
import Sync from '../../screens/Sync';
import Settings from '../../screens/Settings';
import GlobalContext from '../context/GlobalContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const MainMenu = () => {
  const [count, setCount] = useState(GlobalContext.unsyncedItems);
  GlobalContext.registerUpdate(setCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: '#6ec1e4',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingVertical: 10,
          height: 66,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          padding: 6,
        }
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
        name='Data Entry'
        component={DataEntryMenu}
        options={{
          tabBarLabel: 'Data Entry',
          tabBarIcon: ({ color, size }) => (
            <Feather name='plus-circle' size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name='Sync data'
        component={Sync}
        options={{
          tabBarLabel: 'Sync',
          tabBarIcon: ({ color, size }) => (
            <Feather name='upload' size={size} color={color} />
          ),
          tabBarBadge: count > 0 ? count : null,
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
