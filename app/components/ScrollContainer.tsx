import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // https://github.com/APSL/react-native-keyboard-aware-scroll-view
import { useTailwind } from 'tailwind-rn';

function ScrollContainer({ children }) {
  const tailwind = useTailwind();

  return (
    <KeyboardAwareScrollView style={tailwind('h-full w-full')}>
      <View style={tailwind('p-8 content-start')}>
        {children}
      </View>
    </KeyboardAwareScrollView>
  );
}

export default ScrollContainer;
