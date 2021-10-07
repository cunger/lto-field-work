import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { tailwind } from 'tailwind';

function SubmitButtons({ saveAction, discardAction }) {
  if (!saveAction) saveAction = () => {};
  if (!discardAction) discardAction = () => {};

  return (
    <View style={tailwind('flex flex-row items-stretch my-6')}>
      <TouchableOpacity onPress={saveAction} style={tailwind('px-4 py-2 mr-4 rounded-md bg-blue')}>
        <Text style={tailwind('text-sm text-white font-medium')}>
          Save
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={discardAction} style={tailwind('px-4 py-2 rounded-md bg-danger')}>
        <Text style={tailwind('text-sm text-white font-medium')}>
          Discard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SubmitButtons;
