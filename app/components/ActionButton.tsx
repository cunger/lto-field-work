import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export enum Theme {
  Go = 'Go',
  Warning = ' Warning',
  Danger = 'Danger',
  Disabled = 'Disabled',
}

export function ActionButton({ theme = Theme.Go, onPress, title }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles(theme).button}>{title}</Text>
    </TouchableOpacity>
  );
}

const color = (theme) => {
  switch (theme) {
    case Theme.Go: return 'green';
    case Theme.Warning: return 'yellow';
    case Theme.Danger: return 'red';
    case Theme.Disabled: return '#ccc';
  }
};

const styles = (theme) => StyleSheet.create({
  button: {
    fontSize: 14,
    padding: 4,
    paddingLeft: 10,
    marginTop: 4,
    backgroundColor: color(theme),
  },
});
