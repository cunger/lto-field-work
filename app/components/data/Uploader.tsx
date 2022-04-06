import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import {
  LTO_BACK_OFFICE_API_URL,
  LTO_BACK_OFFICE_API_KEY
} from 'react-native-dotenv';

async function persist(items): void {
  // First check for internet connection.
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    showMessage({
      message: 'No internet connection.',
      description: 'Please try again when connected.',
      type: 'warning',
      icon: 'error'
    });

    return [];
  }

  // If there is a connection, upload data.
  // (If it's not signed, just pretend it was uploaded for testing and demo purposes.)
  const response = await axios.post(`${LTO_BACK_OFFICE_API_URL}/data`,
    { items: items.filter((item) => item.signature && item.signature.token) },
    { headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': LTO_BACK_OFFICE_API_KEY
    }}
  );

  const responseBody = response.data;

  if (responseBody.errors.length > 0) {
    showMessage({
      message: 'Backend errors....',
      description: responseBody.errors.join(' | '),
      type: 'warning',
      icon: 'error'
    });
  }

  return responseBody.uploaded || [];
}

module.exports = { persist };
