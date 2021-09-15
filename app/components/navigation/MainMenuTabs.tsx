import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import Home from '../../screens/Home';
import DataEntryStack from './DataEntryStack';
import History from '../../screens/History';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route);
  switch (routeName) {
    case 'Selector': return 'New Data Entry Clean';
    case 'BeachClean': return 'Beach Clean';
    case 'Fisheries': return 'Fisheries Data';
    case 'HumpbackWhales': return 'Observation';
    case 'MantasAndCo': return 'Observation';
    default: return 'New Data Entry';
  }
}

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
      <Tab.Screen name="New" component={DataEntryStack}
        options={({ route }) => ({ headerTitle: getHeaderTitle(route) })}
      />
      <Tab.Screen name="History" component={History}
        options={{ tabBarBadge: 2 }}
      />
    </Tab.Navigator>
  );
};


export default MainMenu;
