import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

function Heading({ title, actionTitle, actionOnPress }) {
  const tailwind = useTailwind();
  const [actionIsInProgress, setActionIsInProgress] = useState(false);

  if (!actionOnPress) actionOnPress = () => Promise.resolve();
  const actionOnPressWithActivityIndication = () => {
    setActionIsInProgress(true);
    actionOnPress().finally(() => setActionIsInProgress(false));
  };

  if (actionTitle) {
    const text = <Text style={tailwind('text-sm text-gray-700 font-medium')}>{actionTitle}</Text>;
    const activity = <ActivityIndicator animating={true} size='small' color='#6ec1e4' />;

    return (
      <View style={tailwind('flex flex-row mt-4 pl-4 pr-2 py-2 justify-between items-center border-b border-gray-200 rounded-md')}>
        <Text style={tailwind('text-lg font-medium text-gray-900')}>
          {title}
        </Text>
        <TouchableOpacity onPress={actionOnPressWithActivityIndication} style={tailwind('px-4 py-2 border border-gray-300 rounded-md bg-white')}>
          {actionIsInProgress ? activity : text}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={tailwind('p-5 border-b border-gray-200 bg-white')}>
        <Text style={tailwind('text-lg font-medium text-gray-900')}>
          {title}
        </Text>
      </View>
    );
  }
}

export default Heading;
