import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { InputLabel } from './Input';
import { useTailwind } from 'tailwind-rn';

function TextField({ label, value, updateAction, hide=false }) {
  if (hide) return null;

  const tailwind = useTailwind();

  return (
    <View>
      <InputLabel text={label} />
      <TextInput
        value={value}
        onChangeText={updateAction}
        onEndEdition={updateAction}
        style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
      />
    </View>
  );
}

export default TextField;
