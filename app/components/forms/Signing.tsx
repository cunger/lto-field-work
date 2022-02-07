import React, { useState, useEffect } from 'react';
import { Text, Button, View } from 'react-native';
import Modal from 'react-native-modal';
import Signature from 'model/Signature';
import SubmitButtons from 'components/forms/SubmitButtons';
import Datastore from 'components/data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { useTailwind } from 'tailwind-rn';

function Signing({ visible, items, closeAction }) {
  const tailwind = useTailwind();
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

  const save = async (signed) => {
    for (let item of items) {
      await Datastore.save(item);
    }

    showMessage({
      message: 'Saved.',
      description: signed ? 'And signed. Yay!' : 'But without signature.',
      type: 'success',
      icon: 'success'
    });

    GlobalContext.load();

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
          If you're testing or simply fooling around, just skip this step. (The data will still be saved.)
        </Text>

        <SubmitButtons
          saveText='Sign'
          saveAction={() => { sign(); save(true); }}
          discardText='Skip'
          discardAction={() => { save(false); }} />
      </View>
    </Modal>
  );
}

export default Signing;
