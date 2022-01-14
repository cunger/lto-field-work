import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { tailwind } from 'tailwind';

function ConfirmPrompt({ visible, actionPhrase, actionExplanation, actionButtonText, action, hide }) {
  return (
    <Modal
      visible={visible}
      animationOut={'slideOutUp'}
      animationOutTiming={1000}
      onRequestClose={hide}>
      <View style={tailwind('bg-white p-4 rounded-md')}>
        <Text style={tailwind('my-4 font-bold')}>
          Do you really want to {actionPhrase}?
        </Text>
        <Text style={tailwind('my-2')}>
          {actionExplanation}
        </Text>
        <View style={tailwind('flex flex-row items-stretch my-6')}>
          <TouchableOpacity
            style={tailwind('px-4 py-2 mr-4 rounded-md bg-blue')}
            onPress={() => { hide(); action(); }}>
            <Text style={tailwind('text-sm text-white font-medium')}>
              {actionButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tailwind('px-4 py-2 rounded-md bg-danger')}
            onPress={hide}>
            <Text style={tailwind('text-sm text-white font-medium')}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmPrompt;
