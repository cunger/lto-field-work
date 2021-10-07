import React from 'react';
import { SafeAreaView, View } from 'react-native';
import tailwind from 'tailwind-rn';

function ContentContainer({ children }) {
  return (
    <SafeAreaView style={tailwind('h-full')}>
      <View style={tailwind('pt-12 items-center')}>
        {children}
      </View>
    </SafeAreaView>
  );
}

export default ContentContainer;
