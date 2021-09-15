import * as React from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet } from 'react-native';

function Selector({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('BeachClean')}>
        <Text style={styles.button}>🗑️ Beach clean</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Fisheries')}>
        <Text style={styles.button}>🎣 Fisheries data</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('HumpbackWhales')}>
        <Text style={styles.button}>🐋 Observation: humpback whales</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MantasAndCo')}>
        <Text style={styles.button}>🐢 Observation: manta rays, whale sharks, or turles</Text>
      </TouchableOpacity>
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

export default Selector;
