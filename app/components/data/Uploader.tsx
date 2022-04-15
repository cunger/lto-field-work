import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

const BASE_URL = 'https://lto-back-office.netlify.app/.netlify/functions/api';

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

  // First upload images (if there are any).
  for (let item of items) {
    let links = [];
    for (let photo of item.photos) {
      const link = await persistPhoto(photo);
      links.push(link);
    }

    item.photos = links;
  }

  const response = await axios.post(`${BASE_ULR}/data`,
    { items: items.filter((item) => item.signature && item.signature.token) },
    { headers: {
      'Content-Type': 'application/json',
      'X-Ship-Name': 'BeanWithBaconMegaRocket'
    }}
  );
  // Response body: { uploaded: [], errors: [] }

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

async function persistPhoto(image: Image) {
  const data = new FormData();
  data.append('file', {
    name: image.filename,
    type: image.type,
    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  const response = await axios.post(`${BASE_URL}/photo`,
    data,
    { headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'X-Ship-Name': 'BeanWithBaconMegaRocket'
    }}
  );
  // Response body: { link: '', errors: [] }

  const responseBody = response.data;

  if (responseBody.errors.length > 0) {
    showMessage({
      message: 'Backend error...',
      description: responseBody.errors.join(' | '),
      type: 'warning',
      icon: 'error'
    });
  }

  return responseBody.link || `<${image.filename}>`;
}

module.exports = { persist };
