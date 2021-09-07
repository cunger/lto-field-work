import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import BeachClean from './BeachClean';
import Fisheries from './Fisheries';
import HumpbackWhales from './HumpbackWhales';
import MantasAndCo from './MantasAndCo';

function Selector({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Lot's of work to do. Get started, shall we?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('BeachClean')}>
        <Text style={styles.button}>Beach clean</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Fisheries')}>
        <Text style={styles.button}>Fisheries data</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('HumpbackWhales')}>
        <Text style={styles.button}>Observation of humpback whales</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MantasAndCo')}>
        <Text style={styles.button}>Observation of manta rays, whale sharks, turles</Text>
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
    padding: 12,
    textAlign: 'left',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default Selector;
