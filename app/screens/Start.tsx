import React from 'react';
import { Text } from 'react-native';
import SafeContainer from 'components/SafeContainer';

function Start({ navigation }) {
  return (
    <SafeContainer>
      <Text>
        Click the menu above to select which kind of data entry you want to start.
      </Text>
    </SafeContainer>
  );
}

export default Start;
