import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
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
    if (item.photos) {
      const links = await persistPhotos(item.photos);
      item.photos = links;
    }
  }

  const response = await axios.post(`${BASE_URL}/data`,
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

async function persistPhotos(images: Image[]) {
  let links = [];
  for (image of images) {
    if (!image.location) continue;
    try {
      let base64 = await FileSystem.readAsStringAsync(image.location, {
        encoding: FileSystem.EncodingType.Base64
      });

      const response = await axios.post(`${BASE_URL}/photo`,
        base64,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Ship-Name': 'BeanWithBaconMegaRocket'
          },
          params: {
            filename: image.filename
          }
        }
      );

      // Response body: { link: '', errors: [] }
      const responseBody = response.data;

      links.push(responseBody.link);

      if (responseBody.errors.length > 0) {
        showMessage({
          message: 'Backend error...',
          description: responseBody.errors.join(' | '),
          type: 'warning',
          icon: 'error'
        });
      }
    } catch (error) {
      showMessage({
        message: 'Backend error...',
        description: error.message,
        type: 'warning',
        icon: 'error'
      });
    }
  }

  return links;
}

module.exports = { persist };
