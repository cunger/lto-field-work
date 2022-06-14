import React from 'react';
import { TextInput, View } from 'react-native';
import { InputLabel } from './Input';
import { useTailwind } from 'tailwind-rn';

function TextField({ label, value, updateAction, numberOfLines=1, hide=false }) {
  if (hide) return null;

  const tailwind = useTailwind();

  return (
    <View>
      { label && <InputLabel text={label} /> }
      <TextInput
        multiline={true}
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={updateAction}
        onEndEdition={updateAction}
        style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
      />
    </View>
  );
}

export default TextField;
