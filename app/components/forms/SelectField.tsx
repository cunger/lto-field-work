import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import GlobalContext from '../../context/GlobalContext';

const i18n = GlobalContext.i18n;

function SelectField({ label, value, type, items, updateAction, style }) {
  if (!style) style = {};
  if (!items && type) {
    items = Object.keys(type).map(key => {
      return { label: i18n.t(type[key]), value: type[key], key: key };
    });
  }

  return (
    <Dropdown
      data={items}
      labelField="label"
      valueField="value"
      placeholder={label}
      value={value}
      onChange={(item) => updateAction(item.value)}
      placeholderStyle={{ color: 'gray' }}
      style={{
        backgroundColor: 'white',
        borderWidth: 0,
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginHorizontal: 4,
        ...style
      }}
    />
  );
}

export default SelectField;
