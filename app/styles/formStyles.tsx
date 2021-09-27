import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  label: {
    fontSize: 16,
    paddingVertical: 16,
    borderBottom: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  field: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
