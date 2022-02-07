import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

function ScrollContainer({ children }) {
  const tailwind = useTailwind();

  return (
    <ScrollView style={tailwind('h-full w-full')}>
      <View style={tailwind('p-8 content-start')}>
        {children}
      </View>
    </ScrollView>
  );
}

export default ScrollContainer;
