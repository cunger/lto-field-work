import React from 'react';
import { Text } from 'react-native';
import ContentContainer from '../components/ContentContainer';

function Start({ navigation }) {
  return (
    <ContentContainer>
      <Text>
        Click the menu above to select which kind of data entry you want to start.
      </Text>
    </ContentContainer>
  );
}

export default Start;
