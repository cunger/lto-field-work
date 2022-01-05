import * as React from 'react';
import { Text, View } from 'react-native';
import { tailwind } from 'tailwind';

function DataEntry() {
  return (
    <View>
      <Text style={tailwind('m-4')}>
        ☝️ Please open the menu (in the top left) and pick what data you want to enter.
      </Text>
    </View>
  );
}

export default DataEntry;
