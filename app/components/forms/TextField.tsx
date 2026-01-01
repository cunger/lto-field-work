import React from 'react';
import { Text,TextInput, View } from 'react-native';
import { InputLabel } from './Input';

function TextField({ label, value, updateAction, helpText='', numberOfLines=1, keyboardType='default', hide=false }) {
  if (hide) return null;

  return (
    <View>
      { label && <InputLabel text={label} /> }
      { helpText && <Text className="mb-2 text-gray">{helpText}</Text> }
      <TextInput
        multiline={true}
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={updateAction}
        onEndEdition={updateAction}
        keyboardType={keyboardType}
        returnKeyType="done"
        blurOnSubmit={true}
        className="mb-2 p-2 bg-white border-gray rounded-md"
      />
    </View>
  );
}

export default TextField;
