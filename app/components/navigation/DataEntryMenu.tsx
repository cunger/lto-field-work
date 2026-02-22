import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import GlobalContext from '../../context/GlobalContext';
import BeachClean from '../../screens/BeachClean';
import FisheriesCatch from '../../screens/FisheriesCatch';
import Fisheries from '../../screens/Fisheries';

const Stack = createStackNavigator(); 

function DataEntryMenu() {
  const i18n = GlobalContext.i18n;
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='DataEntrySelection' 
        component={DataEntry} 
        options={{ 
          title: i18n.t('MENU_DATA_ENTRY'),
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name='BeachClean' 
        component={BeachClean} 
        options={{ title: `🗑️ ${i18n.t('MENU_BEACHCLEAN')}` }} 
      />
      <Stack.Screen 
        name='FisheriesCatch' 
        component={FisheriesCatch} 
        options={{ title: `🐠 ${i18n.t('MENU_FISHERIES_CATCH')}` }} 
      />
      <Stack.Screen 
        name='Fisheries' 
        component={Fisheries} 
        options={{ title: `⏱️ ${i18n.t('MENU_FISHERIES_HOURS')}` }} 
      />
    </Stack.Navigator>
  );
}

function DataEntry({ navigation }) {
  const i18n = GlobalContext.i18n;
  
  return (
    <SafeAreaView className="flex-1 gap-8 pl-4 pr-4">
      <TouchableOpacity
        key="BeachClean"
        className="px-4 py-2 rounded-md bg-white"
        onPress={() => navigation.navigate('BeachClean')}
      >
        <Text>🗑️ {i18n.t('MENU_BEACHCLEAN')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key="FisheriesCatch"
        className="px-4 py-2 rounded-md bg-white"
        onPress={() => navigation.navigate('FisheriesCatch')}
      >
        <Text>🐠 {i18n.t('MENU_FISHERIES_CATCH')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key="Fisheries"
        className="px-4 py-2 rounded-md bg-white"
        onPress={() => navigation.navigate('Fisheries')}
      >
        <Text>⏱️ {i18n.t('MENU_FISHERIES_HOURS')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default DataEntryMenu;
