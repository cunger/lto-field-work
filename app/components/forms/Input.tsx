import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export function InputGroup({ text }) {
  return (
    <View className="my-2 py-2 border-b border-gray-200">
      <Text className="font-bold">
        {text}
      </Text>
    </View>
  );
}

export function InputLabel({ text }) {
  return (
    <View className="my-2 text-sm font-medium">
      <Text>{text}</Text>
    </View>
  );
}

export function InputField({ text, textColor, action }) {
  if (!textColor) textColor = '#000000';

  return (
    <TouchableOpacity
      onPress={action}
      className="p-2 mb-2 rounded-md bg-white">
      <Text style={{ color: textColor }}>{text}</Text>
    </TouchableOpacity>
  );
}
