import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import tailwind from 'tailwind-rn';

export enum Theme {
  Go = 'Go',
  Warning = ' Warning',
  Danger = 'Danger',
  Disabled = 'Disabled',
}

export function ActionButton({ theme = Theme.Go, onPress, title }) {
  return (
    <TouchableOpacity onPress={onPress} style={tailwind('bg-blue w-full py-2 items-center rounded-md mt-6')}>
      <Text style={tailwind('text-white font-medium')}>{title}</Text>
    </TouchableOpacity>
  );
}
//
// const color = (theme) => {
//   switch (theme) {
//     case Theme.Go: return colors.ltoblue;
//     case Theme.Warning: return colors.warning;
//     case Theme.Danger: return colors.danger;
//     case Theme.Disabled: return '#ccc';
//   }
// };
//
// const styles = (theme) => StyleSheet.create({
//   button: {
//     width: '100%',
//     justifyContent: 'center',
//     textAlign: 'center',
//     padding: 10,
//     marginVertical: 6,
//     fontSize: 16,
//     backgroundColor: color(theme),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.23,
//     shadowRadius: 2.62,
//     elevation: 4,
//     borderRadius: 8,
//   },
// });
