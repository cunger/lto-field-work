import { showMessage } from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import Item from '../../model/Item';
import Image from '../../model/Image';
import * as FileSystem from 'expo-file-system';

const BASE_URL = 'https://lto-back-office.netlify.app/.netlify/functions/api';

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
  items = items.filter(item => item.signature && item.signature.token);

  // Upload images (if there are any).
  // TODO Include again once it works.
  // for (let item of items) {
  //   if (item.photos) {
  //     await uploadPhotos(item.photos);
  //   }
  // }

  // Upload data.
  
  // (But only if its photos have been uploaded successfully.)
  // items = items.filter(item => item.photos.every(photo => photo.link));

  let uploaded = [];
  let errors = [];

  if (items.length > 1) {
    try {
      console.log('uploading items:');
      console.log(items);
      const response = await fetch(`${BASE_URL}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Ship-Name': 'BeanWithBaconMegaRocket'
        },
        body: JSON.stringify({ items: items })
      });
      console.log(response.status);
      const responseData = await response.json(); // { uploaded: [], errors: [] }

      uploaded = responseData.uploaded || [];
      errors = responseData.errors || [];
    } catch (error) {
      console.log(`${error}`);
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
  }

  return uploaded;
}

async function uploadPhotos(images: Image[]) {
  let errors: string[] = [];

  for (let image of images) {
    if (!image.location) continue;

    try {
      const formdata = new FormData();
      formdata.append('file', {
        uri: image.location,
        name: image.filename,
        type: image.mimetype
      });

      console.log(formdata);

      const response = await fetch(`${BASE_URL}/photo`, {
        method: 'POST',
        headers: {
          // Let fetch set the content type header, because it knows the boundary string.
          // 'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'X-Ship-Name': 'BeanWithBaconMegaRocket'
        },
        body: formdata
      });

      if (response.status === 200) {
        const responseData = await response.json(); // { link: '', errors: [] }

        image.link = responseData.link;
        errors = [...errors, ...responseData.errors];

        await FileSystem.deleteAsync(image.location);
      } else {
        errors = [...errors, `Response status: ${response.status}`];
      }
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
