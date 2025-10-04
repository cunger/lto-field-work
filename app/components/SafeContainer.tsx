import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function SafeContainer({ children }) {
  return (
    <SafeAreaView className="h-full w-full">
      <View className="p-8 content-start">
        {children}
      </View>
    </SafeAreaView>
  );
}

export default SafeContainer;
