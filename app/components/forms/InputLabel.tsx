import React from 'react';
import { Text, View } from 'react-native';
import { tailwind } from 'tailwind';

function InputLabel({ text }) {
  return (
    <View style={tailwind('my-2 text-sm font-medium')}>
      <Text>{text}</Text>
    </View>
  );
}

export default InputLabel;
