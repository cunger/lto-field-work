import React from 'react';
import { View } from 'react-native';
import { tailwind } from 'tailwind';

function ListItem({ children }) {
  return (
    <View style={tailwind('my-2 px-5')}>
      {children}
    </View>
  );
}

export default ListItem;
