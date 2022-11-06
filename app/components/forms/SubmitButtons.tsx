import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

function SubmitButtons({ saveAction, discardAction, saveText, discardText, resetAction, resetText }) {
  const tailwind = useTailwind();

  if (!saveText) saveText = 'Save';
  if (!discardText) discardText = 'Discard';
  if (!resetText) resetText = 'Reset';
  if (!saveAction) saveAction = () => {};
  if (!discardAction) discardAction = () => {};
  if (!resetAction) resetAction = () => {};

  return (
    <View>
      <View style={tailwind('flex flex-row items-stretch my-6')}>
        <TouchableOpacity onPress={saveAction} style={tailwind('px-4 py-2 mr-4 rounded-md bg-blue')}>
          <Text style={tailwind('text-sm text-white font-medium')}>
            {saveText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={discardAction} style={tailwind('px-4 py-2 mr-4 rounded-md bg-danger')}>
          <Text style={tailwind('text-sm text-white font-medium')}>
            {discardText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetAction} style={tailwind('px-4 py-2 rounded-md bg-white')}>
          <Text style={tailwind('text-sm text-black font-medium')}>
            {resetText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SubmitButtons;
