import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import { showMessage } from 'react-native-flash-message';

async function verify(userName: string, userToken: string): Promise<boolean> {
  return Promise.resolve(true);
}

async function persist(data): Promise<boolean> {
  // If data is not signed, don't upload it,
  // but pretend it was uploaded (for testing and demo purposes).
  if (!data.signature || !data.signature.token) {
    return Promise.resolve(true);
  }

  // First check for internet connection.
  NetInfo.fetch().then(state => {
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
    let url;
    switch (data.type) {
      case 'Catch': url = 'https://hooks.zapier.com/hooks/catch/11890168/bi4k39c/silent/'; break;
      case 'Trash': url = 'https://hooks.zapier.com/hooks/catch/11890168/brivnb2/silent/'; break;
    }

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asSheetRow(data))
    });
  });
}

function asSheetRow(data) {
  data.signature = data.signature || {};

  if (data.type == 'Trash') {
    return {
      name: data.signature.name || '',
      email: data.signature.email || '',
      token: data.signature.token || '',
      date: data.date.toLocaleString('en-GB'),
      location: data.location,
      quantity: data.quantity,
      category: data.category
    };
  }

  if (data.type == 'Catch') {
    return {
      name: data.signature.name || '',
      email: data.signature.email || '',
      token: data.signature.token || '',
      date: data.date.toLocaleString('en-GB'),
      location: data.location,
      reason: data.reason,
      method: data.method,
      base: data.base,
      quantity: data.quantity,
      species: data.species,
      common_name: data.common_name,
      sex: data.sex,
      length: data.length,
      weight: data.weight,
      fork_length: data.fork_length,
      tail_length: data.tail_length,
      head_length: data.head_length,
      head_width: data.head_width,
      precaudal_length: data.precaudal_length,
      carapace_width: data.carapace_width,
      carapace_length: data.carapace_length,
      wingspan: data.wingspan,
      pictures: ''
    };
  }
};

module.exports = {
  verify,
  persist
};
