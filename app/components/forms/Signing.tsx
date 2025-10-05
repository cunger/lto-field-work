import React from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import Signature from '../../model/Signature';
import SubmitButtons from './SubmitButtons';
import Datastore from '../data/LocalDatastore';
import GlobalContext from '../../context/GlobalContext';
import { showMessage } from 'react-native-flash-message';

function Signing({ visible, setVisible, items, session, closeAction }) {
  const i18n = GlobalContext.i18n;

  const save = async (withSignature) => {
    if (withSignature) {
      const userName = await Datastore.getUserName();
      const userEmail = await Datastore.getUserEmail();
      const userToken = await Datastore.getUserToken();

      items.forEach(item =>
        item.signature = Signature(userName, userEmail, userToken)
      );

      if (session) {
        session.signature = Signature(userName, userEmail, userToken)
      }
    }

    await Datastore.save(session);
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
      <View className="bg-white p-4 rounded-md">
        <Text className="my-4 font-bold">✍️ {i18n.t('SIGN_PROMPT')}</Text>
        <Text className="my-2">
          {i18n.t('SIGN_EXPLANATION_1')}
        </Text>
        <Text className="my-2">
          {i18n.t('SIGN_EXPLANATION_2')}
        </Text>
        <Text className="my-2">
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
