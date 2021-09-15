import React from 'react';

import Start from '../../screens/Start';
import BeachClean from '../../screens/BeachClean';
import Fisheries from '../../screens/Fisheries';
import Observation from '../../screens/Observation';

import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

function DataEntryMenu() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='Start' component={Start} />
      <Drawer.Screen name='🗑️ Beach clean' component={BeachClean} />
      <Drawer.Screen name='🎣 Fisheries' component={Fisheries} />
      <Drawer.Screen name='🐋 Observation' component={Observation} />
    </Drawer.Navigator>
  );
}

export default DataEntryMenu;
