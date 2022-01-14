import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { tailwind } from 'tailwind';

function SubmitButtons({ saveAction, discardAction, saveText, discardText }) {
  if (!saveText) saveText = 'Save';
  if (!discardText) discardText = 'Discard';
  if (!saveAction) saveAction = () => {};
  if (!discardAction) discardAction = () => {};

  return (
    <View>
      <View style={tailwind('flex flex-row items-stretch my-6')}>
        <TouchableOpacity onPress={saveAction} style={tailwind('px-4 py-2 mr-4 rounded-md bg-blue')}>
          <Text style={tailwind('text-sm text-white font-medium')}>
            {saveText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={discardAction} style={tailwind('px-4 py-2 rounded-md bg-danger')}>
          <Text style={tailwind('text-sm text-white font-medium')}>
            {discardText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SubmitButtons;
