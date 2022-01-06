import React, { useState, useEffect } from 'react';
import { Text, Button, View } from 'react-native';
import Modal from 'react-native-modal';
import Signature from 'model/Signature';
import SubmitButtons from 'components/forms/SubmitButtons';
import Datastore from 'components/data/LocalDatastore';
import { tailwind } from 'tailwind';

function Signing({ visible, items, closeAction }) {
  const [userName, setUserName] = useState('');
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    (async () => {
      setUserName(await Datastore.getUserName());
      setUserToken(await Datastore.getUserToken());
    })();
  }, []);

  const sign = () => {
    items.forEach(item => item.signature = Signature(userName, userToken));
  };

  const save = async () => {
    for (let item of items) {
      await Datastore.save(item);
    }

    closeAction();
  };

  return (
    <Modal
      isVisible={visible}
      animationOut={'slideOutUp'}
      animationOutTiming={1000}>
      <View style={tailwind('bg-white p-4 rounded-md')}>
        <Text style={tailwind('my-4 font-bold')}>✏️ Signing as: {userName}</Text>
        <Text style={tailwind('my-2')}>
          In order for your data to be used in analytics, you need to sign it.
        </Text>
        <Text style={tailwind('my-2')}>
          If you're testing or simply fooling around, just skip this step.
        </Text>

        <SubmitButtons
          saveText='Sign'
          saveAction={() => { sign(); save(); }}
          discardText='Skip'
          discardAction={() => { save(); }} />
      </View>
    </Modal>
  );
}

export default Signing;
