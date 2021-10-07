import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { tailwind } from 'tailwind';

function Heading({ title, actionTitle, actionOnPress }) {
  if (!actionOnPress) actionOnPress = () => {};

  if (actionTitle) {
    return (
      <View style={tailwind('flex flex-row mt-4 pl-4 pr-2 py-2 justify-between items-center border-b border-gray-200 rounded-md')}>
        <Text style={tailwind('text-lg font-medium text-gray-900')}>
          {title}
        </Text>
        <TouchableOpacity onPress={actionOnPress} style={tailwind('px-4 py-2 border border-gray-300 rounded-md bg-white')}>
          <Text style={tailwind('text-sm text-gray-700 font-medium')}>
            {actionTitle}
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={tailwind('p-5 border-b border-gray-200 bg-white')}>
        <Text style={tailwind('text-lg font-medium text-gray-900')}>
          {title}
        </Text>
      </View>
    );
  }
}

export default Heading;
