import React from 'react';
import { Text, Button, View } from 'react-native';
import Modal from 'react-native-modal';
import { tailwind } from 'tailwind';

function Signing({ visible, action }) {
  if (!action) action = () => {};

  return (
    <Modal
      isVisible={visible}
      animationOut={'slideOutUp'}
      animationOutTiming={1000}>
      <View>
        <Text>Sign please!</Text>
        <Button title='Sign' onPress={action} />
      </View>
    </Modal>
  );
}

export default Signing;
