import React from 'react';
import GlobalContext from '../../context/GlobalContext';
import DataEntry from '../../screens/DataEntry';
import BeachClean from '../../screens/BeachClean';
import Fisheries from '../../screens/Fisheries';
import HumpbackWhale from '../../screens/HumpbackWhale';
import Turtle from '../../screens/Turtle';

import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();
const i18n = GlobalContext.i18n;

function DataEntryMenu() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='Select' component={DataEntry} options={{ title: i18n.t('MENU_DATA_ENTRY') }} />
      <Drawer.Screen name='BeachClean' component={BeachClean} options={{ title: `🗑️ ${i18n.t('MENU_BEACHCLEAN')}` }} />
      <Drawer.Screen name='Fisheries' component={Fisheries} options={{ title: `🎣 ${i18n.t('MENU_FISHERIES')}` }} />
      <Drawer.Screen name='HumpbackWhale' component={HumpbackWhale} options={{ title: `🐋 ${i18n.t('MENU_WHALE')}` }} />
      <Drawer.Screen name='Turtle' component={Turtle} options={{ title: `🐢 ${i18n.t('MENU_TURTLE')}` }} />
    </Drawer.Navigator>
  );
}

export default DataEntryMenu;
