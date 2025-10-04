import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import GlobalContext from '../../context/GlobalContext';

function SubmitButtons({ saveAction, discardAction, saveText, discardText, resetAction, resetText }) {
  const i18n = GlobalContext.i18n;

  if (!saveText) saveText = i18n.t('BUTTON_SAVE');
  if (!discardText) discardText = i18n.t('BUTTON_DISCARD');
  if (!resetText) resetText = i18n.t('BUTTON_RESET');
  if (!saveAction) saveAction = () => {};
  if (!discardAction) discardAction = () => {};
  if (!resetAction) resetAction = () => {};

  return (
    <View>
      <View className="flex flex-row items-stretch my-6">
        <TouchableOpacity onPress={saveAction} className="px-4 py-2 mr-4 rounded-md bg-blue">
          <Text className="text-sm text-white font-medium">
            {saveText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={discardAction} className="px-4 py-2 mr-4 rounded-md bg-danger">
          <Text className="text-sm text-white font-medium">
            {discardText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetAction} className="px-4 py-2 rounded-md bg-white">
          <Text className="text-sm text-black font-medium">
            {resetText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SubmitButtons;
