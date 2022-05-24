import { showMessage } from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import axios from 'axios';
import Item from '../../model/Item';
import Image from '../../model/Image';
import * as FileSystem from 'expo-file-system';
import toBlob from './Base64';

const https = axios.create({
  baseURL: 'https://lto-back-office.netlify.app/.netlify/functions/api/',
  timeout: 4000,
  headers: {
    'X-Ship-Name': 'BeanWithBaconMegaRocket'
  }
});

export default async function upload(items: Item[]) {
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
      await uploadPhotos(item.photos);
    }
  }

  // Upload data.
  let uploaded = [];
  let errors = [];

  try {
    const response = await https.post('data',
      { items: items.filter((item) => item.signature && item.signature.token) },
      { headers: {
        'Content-Type': 'application/json',
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
      type: 'danger',
      icon: 'danger'
    });
  }

  return uploaded;
}

async function uploadPhotos(images: Image[]) {
  let errors: string[] = [];

  for (let image of images) {
    if (!image.location) continue;

    let info = await FileSystem.getInfoAsync(image.location);
    if (!info) console.log('no info!');
    info && console.log(info);

    try {
      // const base64 = await FileSystem.readAsStringAsync(image.location, {
      //   encoding: FileSystem.EncodingType.Base64
      // });
      const formdata = new FormData();
      // formdata.append('file', toBlob(base64, image.mimetype), image.filename);
      formdata.append('file', {
        path: image.location,
        name: image.filename,
        type: image.mimetype
      } as any);

      const response = await axios.post('photo', formdata);
      // Note: Axios sets the content type header, because it also needs to specify boundary information.
      // 'Content-Type': 'multipart/form-data; boundary=...',

      // Response body: { link: '', errors: [] }

      image.link = response.data.link;
      errors = [...errors, ...response.data.errors];

      await FileSystem.deleteAsync(image.location);
    } catch (error) {
      console.log(error);
      errors.push(error.message);
    }

    if (errors.length > 0) {
      showMessage({
        message: 'Backend error...',
        description: errors.join(' | '),
        type: 'danger',
        icon: 'danger'
      });
    }
  }
}
