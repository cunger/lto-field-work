import React from 'react';
import RNPickerSelect from 'react-native-picker-select'; // https://github.com/lawnstarter/react-native-picker-select
import styles from '../../styles/select';
import GlobalContext from '../../context/GlobalContext';

const i18n = GlobalContext.i18n;

function SelectField({ label, value, type, items, updateAction }) {
  if (!items && type) {
    items = Object.keys(type).map(key => {
      return { label: i18n.t(type[key]), value: type[key] };
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
