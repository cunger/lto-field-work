import React, { useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Dashboard from '../../screens/Dashboard';
import DataEntryMenu from './DataEntryMenu';
import Upload from '../../screens/Upload';
import Settings from '../../screens/Settings';
import GlobalContext from '../../context/GlobalContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTailwind } from 'tailwind-rn';

const Tab = createBottomTabNavigator();
const MainMenu = () => {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  const [count, setCount] = useState(GlobalContext.unsyncedItems);
  const [locale, setLocale] = useState(GlobalContext.language());
  GlobalContext.subscribeToCount(setCount);
  GlobalContext.subscribeToLanguage(setLocale);

  return (
    <SafeAreaView style={tailwind('flex-1')}>
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
          component={Dashboard}
          options={{
            tabBarLabel: i18n.t('MENU_DASHBOARD', { locale: locale }),
            tabBarIcon: ({ color, size }) => (
              <Feather name='clipboard' size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='DataEntry'
          component={DataEntryMenu}
          options={{
            tabBarLabel: i18n.t('MENU_DATA_ENTRY', { locale: locale }),
            tabBarIcon: ({ color, size }) => (
              <Feather name='plus-circle' size={size} color={color} />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen
          name='Upload'
          component={Upload}
          options={{
            tabBarLabel: i18n.t('MENU_UPLOAD', { locale: locale }),
            tabBarIcon: ({ color, size }) => (
              <Feather name='upload' size={size} color={color} />
            ),
            tabBarBadge: count > 0 ? count : undefined,
          }}
        />
        <Tab.Screen
          name='Settings'
          component={Settings}
          options={{
            tabBarLabel: i18n.t('MENU_SETTINGS', { locale: locale }),
            tabBarIcon: ({ color, size }) => (
              <Feather name='settings' size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainMenu;
