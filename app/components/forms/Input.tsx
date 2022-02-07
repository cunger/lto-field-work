import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';

export function InputLabel({ text }) {
  const tailwind = useTailwind();

  return (
    <View style={tailwind('my-2 text-sm font-medium')}>
      <Text>{text}</Text>
    </View>
  );
}

export function InputField({ text, textColor, action }) {
  if (!textColor) textColor = '#000000';

  return (
    <TouchableOpacity
      onPress={action}
      style={tailwind('p-2 mb-2 rounded-md bg-white')}>
      <Text style={{ color: textColor }}>{text}</Text>
    </TouchableOpacity>
  );
}
