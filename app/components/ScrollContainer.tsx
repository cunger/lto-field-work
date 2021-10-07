import React from 'react';
import { ScrollView, View } from 'react-native';
import tailwind from 'tailwind-rn';

function ScrollContainer({ children }) {
  return (
    <ScrollView style={tailwind('h-full w-full')}>
      <View style={tailwind('p-8 content-start')}>
        {children}
      </View>
    </ScrollView>
  );
}

export default ScrollContainer;
