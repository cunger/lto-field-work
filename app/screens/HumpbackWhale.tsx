import * as React from 'react';
import { Text, View } from 'react-native';
import GlobalContext from '../context/GlobalContext';

function HumpbackWhale() {
  const i18n = GlobalContext.i18n;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{i18n.t('HUMPBACKS')}</Text>
      <Text>{i18n.t('NOT_AVAILABLE_YET')}</Text>
    </View>
  );
}

export default HumpbackWhale;
