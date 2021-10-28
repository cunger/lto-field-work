import React from 'react';
import { Text, Button, View } from 'react-native';
import Modal from 'react-native-modal';
import Signature from 'model/Signature';
import SubmitButtons from 'components/forms/SubmitButtons';
import Datastore from 'components/data/LocalDatastore';
import { tailwind } from 'tailwind';

function Signing({ visible, item, closeAction }) {

  const sign = async () => {
    const userName = await Datastore.getUserName();
    const userToken = await Datastore.getUserToken();
    await Datastore.save({ ...item, signature: Signature(userName, userToken) });
    closeAction();
  };

  return (
    <Modal
      isVisible={visible}
      animationOut={'slideOutUp'}
      animationOutTiming={1000}>
      <View style={tailwind('bg-white p-4 rounded-md')}>

        <Text>Signing as: TODO: User name!</Text>

        <Text>In order for your data to be used in analytics, you need to sign it.</Text>
        <Text>If you're testing or simply fooling around, just skip this step.</Text>

        <SubmitButtons
          saveText='Sign'
          saveAction={sign}
          discardText='Skip'
          discardAction={closeAction} />
      </View>
    </Modal>
  );
}

export default Signing;
