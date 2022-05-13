import { showMessage } from 'react-native-flash-message';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import axios from 'axios';
import Item from '../../model/Item';
import Image from '../../model/Image';

const BASE_URL = 'https://lto-back-office.netlify.app/.netlify/functions/api';

async function persist(items: Item[]) {
  // First check for internet connection.
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    showMessage({
      message: 'No internet connection.',
      description: 'Please try again when connected.',
      type: 'warning',
      icon: 'danger'
    });

    return [];
  }

  // If there is a connection, upload data.
  // (If it's not signed, just pretend it was uploaded for testing and demo purposes.)

  // Upload images (if there are any).
  for (let item of items) {
    if (item.photos) {
      const links = await persistPhotos(item.photos);
      item.photos = links;
    }
  }

  // Upload data.
  let uploaded = []; 
  let errors = [];

  try {
    const response = await axios.post(`${BASE_URL}/data`,
      { items: items.filter((item) => item.signature && item.signature.token) },
      { headers: {
        'Content-Type': 'application/json',
        'X-Ship-Name': 'BeanWithBaconMegaRocket'
      }}
    );
    // Response body: { uploaded: [], errors: [] }

    uploaded = response.data.uploaded || [];
    errors = response.data.errors || [];
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    showMessage({
      message: 'Error when uploading data...',
      description: errors.join(' | '),
      type: 'warning',
      icon: 'danger'
    });
  }

  return uploaded;
}

async function persistPhotos(images: Image[]) {
  let links = [];

  for (let image of images) {
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
          icon: 'danger'
        });
      }
    } catch (error) {
      showMessage({
        message: 'Backend error...',
        description: error.message,
        type: 'warning',
        icon: 'danger'
      });
    }
  }

  return links;
}

module.exports = { persist };
