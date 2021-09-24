import React from 'react';
import { Text, StyleSheet } from 'react-native';

function Heading({ title }) {
  return (
    <Text style={styles.text}>{title}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    marginBottom: 4,
    padding: 6,
    backgroundColor: 'white',
  },
});

export default Heading;
