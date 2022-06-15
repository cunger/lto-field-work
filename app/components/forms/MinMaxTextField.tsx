import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { InputLabel } from './Input';
import { useTailwind } from 'tailwind-rn';

function MinMaxTextField({ label, minValue, maxValue, minUpdateAction, maxUpdateAction, keyboardType='numeric', hide=false }) {
  if (hide) return null;

  const tailwind = useTailwind();

  return (
    <View>
      { label && <InputLabel text={label} /> }
      <View style={{ flex: 2, flexDirection: 'row' }}>
        <TextInput
          value={minValue}
          onChangeText={minUpdateAction}
          onEndEdition={minUpdateAction}
          keyboardType={keyboardType}
          placeholder='smallest'
          style={tailwind('w-1/2 mb-2 mr-1 p-2 bg-white border-gray rounded-md')}
        />
        <TextInput
          value={maxValue}
          onChangeText={maxUpdateAction}
          onEndEdition={maxUpdateAction}
          keyboardType={keyboardType}
          placeholder='biggest'
          style={tailwind('w-1/2 mb-2 ml-1 p-2 bg-white border-gray rounded-md')}
        />
      </View>
    </View>
  );
}

export default MinMaxTextField;
