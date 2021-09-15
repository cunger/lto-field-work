import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

function BeachClean() {
  return (
    <View style={styles.view}>
      <Text>Yay, cleaning beaches!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default BeachClean;
