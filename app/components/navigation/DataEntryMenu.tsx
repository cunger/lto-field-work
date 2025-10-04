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
        name='Fisheries' 
        component={Fisheries} 
        options={{ title: `🎣 ${i18n.t('MENU_FISHERIES')}` }} 
      />
    </Stack.Navigator>
  );
}

function DataEntry({ navigation }) {
  const i18n = GlobalContext.i18n;
  const buttonStyle = "px-4 py-2 border border-gray-300 rounded-md bg-white";
  
  return (
    <SafeAreaView className="flex-1 gap-10 p-4">
      <TouchableOpacity
        key="BeachClean"
        className="p-4 border border-gray-300 rounded-md bg-white"
        onPress={() => navigation.navigate('BeachClean')}
      >
        <Text>🗑️ {i18n.t('MENU_BEACHCLEAN')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key="Fisheries"
        className="p-4 border border-gray-300 rounded-md bg-white"
        onPress={() => navigation.navigate('Fisheries')}
      >
        <Text>🎣 {i18n.t('MENU_FISHERIES')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default DataEntryMenu;
