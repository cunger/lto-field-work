import React from 'react';
import { View } from 'react-native';

function ListItem({ children }) {
  return (
    <View className="my-2 px-5">
      {children}
    </View>
  );
}

export default ListItem;
