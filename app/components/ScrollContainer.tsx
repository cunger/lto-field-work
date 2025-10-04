import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // https://github.com/APSL/react-native-keyboard-aware-scroll-view

function ScrollContainer({ children }) {
  return (
    <KeyboardAwareScrollView className="h-full w-full"
      enableResetScrollToCoords={false}
    >
      <View className="p-8 content-start">
        {children}
      </View>
    </KeyboardAwareScrollView>
  );
}

export default ScrollContainer;
