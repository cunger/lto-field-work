import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import styles from '../styles/containerStyles';

function Start({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>
        Click the menu above to select which kind of data entry you want to start.
      </Text>
    </View>
  );
}

export default Start;
