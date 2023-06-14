import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { InputLabel } from './Input';
import { useTailwind } from 'tailwind-rn';
import GlobalContext from '../../context/GlobalContext';

function MinMaxTextField({ label, minValue, maxValue, avgValue, minUpdateAction, maxUpdateAction, avgUpdateAction, helpText='', keyboardType='numeric', hide=false }) {
  if (hide) return null;

  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  return (
    <View>
      { label && <InputLabel text={label} /> }
      { helpText && <Text style={tailwind('mb-2 text-gray')}>{helpText}</Text> }
      <View style={{ flex: 2, flexDirection: 'row' }}>
        <TextInput
          value={minValue}
          onChangeText={(text: string) => minUpdateAction(text)}
          keyboardType={keyboardType}
          placeholder={i18n.t('FISHERIES_SMALLEST')}
          style={tailwind('w-1/2 mb-2 mr-1 p-2 bg-white border-gray rounded-md')}
        />
        <TextInput
          value={maxValue}
          onChangeText={(text: string) => maxUpdateAction(text)}
          keyboardType={keyboardType}
          placeholder={i18n.t('FISHERIES_BIGGEST')}
          style={tailwind('w-1/2 mb-2 ml-1 p-2 bg-white border-gray rounded-md')}
        />
      </View>
      <View>
        <TextInput
          value={avgValue}
          onChangeText={(text: string) => avgUpdateAction(text)}
          keyboardType={keyboardType}
          placeholder={i18n.t('FISHERIES_AVERAGE')}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
      </View>
    </View>
  );
}

export default MinMaxTextField;
