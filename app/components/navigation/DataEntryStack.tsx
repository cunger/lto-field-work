import React from 'react';

import Selector from '../../screens/Selector';
import BeachClean from '../../screens/BeachClean';
import Fisheries from '../../screens/Fisheries';
import HumpbackWhales from '../../screens/HumpbackWhales';
import MantasAndCo from '../../screens/MantasAndCo';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

function DataEntryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Selector' component={Selector} />
      <Stack.Screen name='BeachClean' component={BeachClean} />
      <Stack.Screen name='Fisheries' component={Fisheries} />
      <Stack.Screen name='HumpbackWhales' component={HumpbackWhales} />
      <Stack.Screen name='MantasAndCo' component={MantasAndCo} />
    </Stack.Navigator>
  );
}

export default Selector;
