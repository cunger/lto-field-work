import * as React from 'react';
import { SafeAreaView, Text } from 'react-native';
import styles from '../styles/containerStyles';

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home sweet home!</Text>
    </SafeAreaView>
  );
}

export default Home;
