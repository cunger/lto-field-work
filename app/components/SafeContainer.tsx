import React from 'react';
import { SafeAreaView, View } from 'react-native';
import tailwind from 'tailwind-rn';

function SafeContainer({ children }) {
  return (
    <SafeAreaView style={tailwind('h-full w-full')}>
      <View style={tailwind('p-8 content-start')}>
        {children}
      </View>
    </SafeAreaView>
  );
}

export default SafeContainer;
