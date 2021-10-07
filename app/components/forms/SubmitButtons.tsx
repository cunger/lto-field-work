import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { tailwind } from 'tailwind';

function SubmitButtons({ saveAction, discardAction }) {
  return (
    <View style={tailwind('flex flex-row items-stretch my-6')}>
      <TouchableOpacity onPress={saveAction} style={tailwind('px-4 py-2 mr-4 border border-gray-300 rounded-md bg-white')}>
        <Text style={tailwind('text-sm text-gray-700 font-medium')}>
          Save
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={discardAction} style={tailwind('px-4 py-2 border border-white rounded-md bg-danger')}>
        <Text style={tailwind('text-sm text-white font-medium')}>
          Discard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SubmitButtons;
