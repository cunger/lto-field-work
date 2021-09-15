import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import Home from '../../screens/Home';
import DataEntryMenu from './DataEntryMenu';
import History from '../../screens/History';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const MainMenu = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': {
              iconName = 'home';
              break;
            }
            case 'New': {
              iconName = 'plus-circle';
              break;
            }
            case 'History': {
              iconName = 'list';
              break;
            }
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6ec1e4',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="New" component={DataEntryMenu}
        options={{ headerTitle: 'Data Entry' }}
      />
      <Tab.Screen name="History" component={History}
        options={{ tabBarBadge: 2 }}
      />
    </Tab.Navigator>
  );
};


export default MainMenu;
