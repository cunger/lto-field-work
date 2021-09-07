import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TabNavigator from './app/components/navigation/TabNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Love The Oceans ❤️🌊</Text>
      <TabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
