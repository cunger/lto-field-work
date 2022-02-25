import React, { useState, useEffect } from 'react';
import { Text, Button, View } from 'react-native';
import Modal from 'react-native-modal';
import Signature from '../../model/Signature';
import SubmitButtons from './SubmitButtons';
import Datastore from '../data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { useTailwind } from 'tailwind-rn';

function Signing({ visible, items, closeAction }) {
  const tailwind = useTailwind();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    (async () => {
      setUserName(await Datastore.getUserName());
      setUserEmail(await Datastore.getUserEmail());
      setUserToken(await Datastore.getUserToken());
    })();
  }, []);

  const sign = () => {
    items.forEach(item => item.signature = Signature(userName, userEmail, userToken));
  };

  const save = async (signed) => {
    for (let item of items) {
      await Datastore.save(item);
    }

    showMessage({
      message: 'Saved.',
      description: signed ? 'And signed. Thanks!' : 'But not signed.',
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
        <Text style={tailwind('my-4 font-bold')}>✍️ Do you want to sign?</Text>
        <Text style={tailwind('my-2')}>
          Signing means you confirm that you collected the data as entered. We can then use the data for our studies.
        </Text>
        <Text style={tailwind('my-2')}>You would sign as: {userName}</Text>
        <Text style={tailwind('my-2')}>(Go to Settings to change that.)</Text>
        <Text style={tailwind('my-2')}>
          If you're testing or simply fooling around, please skip this step. The data will still be saved; we just won't use it as real data.
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
