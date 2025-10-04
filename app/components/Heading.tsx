import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

function Heading({ title, actionTitle, actionOnPress }) {
  const [actionIsInProgress, setActionIsInProgress] = useState(false);

  const actionOnPressWithActivityIndication = async () => {
    if (!actionOnPress || actionIsInProgress) return;
    // If we're not already in action, start it.
    try {
      setActionIsInProgress(true);
      await actionOnPress();
    } catch(error) {
      console.log(error);
    } finally {
      setActionIsInProgress(false);
    }
  };

  if (actionTitle) {
    const text = <Text className="text-sm text-gray-700 font-medium">{actionTitle}</Text>;
    const activity = <ActivityIndicator animating={true} size='small' color='#6ec1e4' />;

    return (
      <View className="('flex flex-row mt-4 pl-4 pr-2 py-2 justify-between items-center border-b border-gray-200 rounded-md">
        <Text className="('text-lg font-medium text-gray-900">
          {title}
        </Text>
        <TouchableOpacity onPress={actionOnPressWithActivityIndication} className="('px-4 py-2 border border-gray-300 rounded-md bg-white">
          {actionIsInProgress ? activity : text}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View className="('p-2 my-2 border-b border-gray-200">
        <Text className="('text-lg font-medium text-gray-900">
          {title}
        </Text>
      </View>
    );
  }
}

export default Heading;
