import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

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
  const response = await axios.post(`https://lto-back-office.netlify.app/.netlify/functions/api/data`,
    { items: items.filter((item) => item.signature && item.signature.token) },
    { headers: {
      'Content-Type': 'application/json',
      'X-Ship-Name': 'BeanWithBaconMegaRocket'
    }}
  );

  const responseBody = response.data;

  if (responseBody.errors.length > 0) {
    showMessage({
      message: 'Backend error...',
      description: responseBody.errors.join(' | '),
      type: 'warning',
      icon: 'error'
    });
  }

  return responseBody.uploaded || [];
}

module.exports = { persist };
