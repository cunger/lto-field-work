import React from 'react';
import { View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

function ListItem({ children }) {
  const tailwind = useTailwind();

  return (
    <View style={tailwind('my-2 px-5')}>
      {children}
    </View>
  );
}

export default ListItem;
