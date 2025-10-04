import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalContext from '../../context/GlobalContext';
import BeachClean from '../../screens/BeachClean';
import Fisheries from '../../screens/Fisheries';

const Stack = createStackNavigator();

function DataEntryMenu() {
  const i18n = GlobalContext.i18n;
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='DataEntry' 
        component={DataEntry} 
        options={{ 
          title: i18n.t('MENU_DATA_ENTRY'),
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name='BeachClean' 
        component={BeachClean} 
        options={{ title: `🗑️ ${i18n.t('MENU_BEACHCLEAN')}` }} 
      />
      <Stack.Screen 
        name='Fisheries' 
        component={Fisheries} 
        options={{ title: `🎣 ${i18n.t('MENU_FISHERIES')}` }} 
      />
    </Stack.Navigator>
  );
}

function DataEntry({ navigation }) {
  const i18n = GlobalContext.i18n;
  const buttonStyle = "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20";
  
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="p-4">
        <Text className="m-4">
          {i18n.t('DATA_ENTRY_PICK')}
        </Text>

        <TouchableOpacity
          key="BeachClean"
          className={buttonStyle}
          onPress={() => navigation.navigate('BeachClean', { screen: BeachClean })}
        >
          <Text>🗑️ {i18n.t('MENU_BEACHCLEAN')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key="Fisheries"
          className={buttonStyle}
          onPress={() => navigation.navigate('Fisheries', { screen: Fisheries })}
        >
          <Text>🎣 {i18n.t('MENU_FISHERIES')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DataEntryMenu;
