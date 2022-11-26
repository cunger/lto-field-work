import React from 'react';

import DataEntry from '../../screens/DataEntry';
import BeachClean from '../../screens/BeachClean';
import Fisheries from '../../screens/Fisheries';
import HumpbackWhale from '../../screens/HumpbackWhale';
import MantaAndCo from '../../screens/MantaAndCo';

import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

function DataEntryMenu() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='DataEntry' component={DataEntry} options={{ title: 'Data entry' }} />
      <Drawer.Screen name='BeachClean' component={BeachClean} options={{ title: '🗑️ Beach clean' }} />
      <Drawer.Screen name='Fisheries' component={Fisheries} options={{ title: '🎣 Fisheries' }} />
      <Drawer.Screen name='HumpbackWhale' component={HumpbackWhale} options={{ title: '🐋 Humpback whale' }} />
      <Drawer.Screen name='Turtle' component={MantaAndCo} options={{ title: '🐢 Turtle' }} />
    </Drawer.Navigator>
  );
}

export default DataEntryMenu;
