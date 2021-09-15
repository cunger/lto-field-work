import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

function Start({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>
        Click the menu above to select which kind of data entry you want to start.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6ec1e4',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    color: 'white',
    padding: 10,
    marginTop: 6,
    marginBottom: 6,
    textAlign: 'left',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});

export default Start;
