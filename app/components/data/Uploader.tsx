import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

require('dotenv').config();
const API_KEY = process.env.LTO_BACK_OFFICE_API_KEY;
const API_URL = process.env.LTO_BACK_OFFICE_API_URL;

async function persist(items): void {
  // First check for internet connection.
  NetInfo.fetch().then(async (state) => {
    if (!state.isConnected) {
      showMessage({
        message: 'No internet connection.',
        description: 'Please try again when connected.',
        type: 'warning',
        icon: 'error'
      });

      return false;
    }

    // If there is a connection, upload data.
    // (If it's not signed, just pretend it was uploaded for testing and demo purposes.)
    const response = await axios.post(`${API_URL}/data`,
      { items: items.filter((item) => item.signature && item.signature.token) },
      { headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': API_KEY
      }}
    );

    if (response.body.errors) {
      // TODO showMessage({})
    }

    if (response.status == 200) {
      response.body.uploaded.forEach((id) => {
        // TODO find item in items and set item.synced = true
      });
    }
  });
}

module.exports = { persist };
