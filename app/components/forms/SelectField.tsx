import React from 'react';
import { Picker } from '@react-native-picker/picker';
import GlobalContext from '../../context/GlobalContext';

const i18n = GlobalContext.i18n;

function SelectField({ label, value, type, items, updateAction }) {
  if (!items && type) {
    items = Object.keys(type).map(key => {
      return { label: i18n.t(type[key]), value: type[key], key: key };
    });
  }

  return (
    <Picker
      selectedValue={value}
      onValueChange={(value, _) => updateAction(value)}
    >
      <Picker.Item label={label} value={undefined} />

      {items.map((item) => (
        <Picker.Item 
          label={item.label} 
          value={item.value} 
        />
      ))}
    </Picker>
  );
}

export default SelectField;
