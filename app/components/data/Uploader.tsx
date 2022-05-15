import { showMessage } from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import axios from 'axios';
import Item from '../../model/Item';
import Image from '../../model/Image';
import { Platform } from 'react-native';

const BASE_URL = 'https://lto-back-office.netlify.app/.netlify/functions/api';

export default async function persist(items: Item[]) {
  // First check for internet connection.
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    showMessage({
      message: 'No internet connection.',
      description: 'Please try again when connected.',
      type: 'warning',
      icon: 'warning'
    });

    return [];
  }

  // If there is a connection, upload data.
  // (If it's not signed, just pretend it was uploaded for testing and demo purposes.)

  // Upload images (if there are any).
  for (let item of items) {
    if (item.photos) {
      await persistPhotos(item.photos);
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
  let errors: string[] = [];

  for (let image of images) {
    if (!image.location) continue;

    try {
      const formdata = new FormData();
      formdata.append('file', { 
        path: image.location,
        name: image.filename,
        type: image.mimetype 
      } as any);

      const response = await axios.post(`${BASE_URL}/photo`,
        formdata,
        { 
          headers: {
            // Note: Axios sets the content type header, because it also needs to specify boundary information. 
            // 'Content-Type': 'multipart/form-data; boundary=...',
            'X-Ship-Name': 'BeanWithBaconMegaRocket'
          }
        }
      );
      // Response body: { link: '', errors: [] }

      image.link = response.data.link;
      
      errors = [...errors, ...response.data.errors];
    } catch (error) {
      errors.push(error.message);
    }

    if (errors.length > 0) {
      showMessage({
        message: 'Backend error...',
        description: errors.join(' | '),
        type: 'warning',
        icon: 'danger'
      });
    }
  }
}