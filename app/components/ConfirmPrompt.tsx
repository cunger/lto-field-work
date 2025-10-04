import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import GlobalContext from '../context/GlobalContext';

function ConfirmPrompt({ visible, actionPhrase, actionExplanation, actionButtonText, action, hide }) {
  const i18n = GlobalContext.i18n;

  return (
    <Modal
      isVisible={visible}
      animationOut={'slideOutUp'}
      animationOutTiming={1000}>
      <View className="bg-white p-4 rounded-md">
        <Text className="my-2">
          {actionPhrase}
        </Text>
        <Text className="my-2">
          {actionExplanation}
        </Text>
        <View className="flex flex-row items-stretch my-6">
          <TouchableOpacity
            className="px-4 py-2 mr-4 rounded-md bg-blue"
            onPress={() => { hide(); action(); }}>
            <Text className="text-sm text-white font-medium">
              {actionButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-2 rounded-md bg-danger"
            onPress={hide}>
            <Text className="text-sm text-white font-medium">
              {i18n.t('BUTTON_CANCEL')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmPrompt;
