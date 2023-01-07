import * as React from 'react';
import { Text, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import GlobalContext from '../context/GlobalContext';

function DataEntry() {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  return (
    <View>
      <Text style={tailwind('m-4')}>
        ☝️ {i18n.t('DATA_ENTRY_PICK')}
      </Text>
    </View>
  );
}

export default DataEntry;
