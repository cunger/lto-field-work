import React from 'react';
import RNPickerSelect from 'react-native-picker-select'; // https://github.com/lawnstarter/react-native-picker-select
import { InputLabel } from './Input';
import { useTailwind } from 'tailwind-rn';
import styles from '../../styles/select';

function SelectField({ label, value, type, items, updateAction }) {
  const tailwind = useTailwind();

  if (!items && type) {
    items = Object.keys(type).map(key => {
      return { label: type[key], value: key };
    });
  }

  return (
    <RNPickerSelect
      value={value}
      placeholder={{ label: label, value: undefined }}
      onValueChange={(value, _) => updateAction(value)}
      items={items}
      style={{
        inputAndroid: styles.input,
        inputAndroidContainer: styles.inputContainer,
        inputIOS: styles.input,
        inputIOSContainer: styles.inputContainer
      }}
    />
  );
}

export default SelectField;
