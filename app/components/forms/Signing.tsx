import React from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import Signature from '../../model/Signature';
import SubmitButtons from './SubmitButtons';
import Datastore from '../data/LocalDatastore';
import GlobalContext from '../../context/GlobalContext';
import { showMessage } from 'react-native-flash-message';
import { useTailwind } from 'tailwind-rn';

function Signing({ visible, setVisible, items, closeAction }) {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  const save = async (withSignature) => {
    if (withSignature) {
      const userName = await Datastore.getUserName();
      const userEmail = await Datastore.getUserEmail();
      const userToken = await Datastore.getUserToken();

      items.forEach(item =>
        item.signature = Signature(userName, userEmail, userToken)
      );
    }

    for (let item of items) {
      await Datastore.save(item);
    }

    showMessage({
      message: i18n.t('MESSAGE_SAVED'),
      description: withSignature ? i18n.t('MESSAGE_READY_TO_UPLOAD') : i18n.t('MESSAGE_NOT_SIGNED'),
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
        <Text style={tailwind('my-4 font-bold')}>✍️ {i18n.t('SIGN_PROMPT')}</Text>
        <Text style={tailwind('my-2')}>
          {i18n.t('SIGN_EXPLANATION_1')}
        </Text>
        <Text style={tailwind('my-2')}>
          {i18n.t('SIGN_EXPLANATION_2')}
        </Text>
        <Text style={tailwind('my-2')}>
          ({i18n.t('SIGN_EXPLANATION_3')})
        </Text>

        <SubmitButtons
          saveText={i18n.t('BUTTON_SIGN')}
          saveAction={() => { save(true); }}
          discardText={i18n.t('BUTTON_SKIP')}
          discardAction={() => { save(false); }}
          resetText={i18n.t('BUTTON_CANCEL')}
          resetAction={() => { setVisible(false); }}
        />
      </View>
    </Modal>
  );
}

export default Signing;
