import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Datastore from 'components/data/LocalDatastore';
import Home from '../../screens/Home';
import DataEntryMenu from './DataEntryMenu';
import History from '../../screens/History';
import Settings from '../../screens/Settings';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const MainMenu = async () => {
  const numberOfUnsynced = await Datastore.numberOfUnsynced();
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
        name='New'
        component={DataEntryMenu}
        options={{
          tabBarLabel: 'Data Entry',
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
          tabBarBadge: 0,
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
