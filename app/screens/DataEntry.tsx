import * as React from 'react';
import { Text, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

function DataEntry() {
  const tailwind = useTailwind();

  return (
    <View>
      <Text style={tailwind('m-4')}>
        ☝️ Please open the menu and pick what data you want to enter.
      </Text>
    </View>
  );
}

export default DataEntry;
