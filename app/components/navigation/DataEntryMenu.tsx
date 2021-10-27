import React from 'react';

import DataEntry from '../../screens/DataEntry';
import BeachClean from '../../screens/BeachClean';
import Fisheries from '../../screens/Fisheries';
import Observation from '../../screens/Observation';
import HumpbackWhale from '../../screens/HumpbackWhale';
import MantaAndCo from '../../screens/MantaAndCo';

import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

function DataEntryMenu() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='Data entry' component={DataEntry} />
      <Drawer.Screen name='🗑️ Beach clean' component={BeachClean} />
      <Drawer.Screen name='🎣 Fisheries' component={Fisheries} />
      <Drawer.Screen name='🐋 Humpback whale' component={HumpbackWhale} />
      <Drawer.Screen name='🦈 Whale shark' component={MantaAndCo} />
      <Drawer.Screen name='🛸 Manta ray' component={MantaAndCo} />
      <Drawer.Screen name='🐢 Turtle' component={MantaAndCo} />
    </Drawer.Navigator>
  );
}

export default DataEntryMenu;
