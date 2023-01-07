import { showMessage } from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import Item from '../../model/Item';
import Image from '../../model/Image';
import { I18n } from 'i18n-js/typings';

const BASE_URL = 'https://lto-back-office.netlify.app/.netlify/functions/api';

export default async function upload(items: Item[], i18n: I18n) {
  // First check for internet connection.
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    showMessage({
      message: i18n.t('ERROR_NO_INTERNET'),
      description: i18n.t('ERROR_TRY_AGAIN_WHEN_ONLINE'),
      type: 'warning',
      icon: 'warning',
      duration: 3000
    });

    return [];
  }

  // If there is a connection, upload data.
  
  // (If it's not signed, just pretend it was uploaded for testing and demo purposes.)
  items = items.filter(item => Item.signed(item));

  // Upload images (if there are any).
  for (let item of items) {
    if (item.photos) {
      await uploadPhotos(item.photos, i18n);
    }
  }

  // Upload data.
  
  // (But only if its photos have been uploaded successfully.)
  items = items.filter(item => item.photos.every(photo => photo.link));

  let uploaded = [];
  let errors = [];

  if (items.length > 0) {
    try {
      const response = await fetch(`${BASE_URL}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Ship-Name': 'BeanWithBaconMegaRocket'
        },
        body: JSON.stringify({ items: items })
      });

      const responseData = await response.json(); // { uploaded: [], errors: [] }

      uploaded = responseData.uploaded || [];
      errors = responseData.errors || [];
    } catch (error) {
      console.log(`${error}`);
      errors.push(error.message);
    }

    if (errors.length > 0) {
      showMessage({
        message: i18n.t('ERROR_UPLOAD'),
        description: errors.join(' | '),
        type: 'danger',
        icon: 'danger',
        duration: 6000
      });
    }
  }

  return items.filter(item => uploaded.indexOf(item.id) >= 0);
}

async function uploadPhotos(images: Image[], i18n: I18n) {
  let errors: string[] = [];

  for (let image of images) {
    console.log('Trying to upload: ' + JSON.stringify(image));
    if (!image.location) continue;

    try {
      const formdata = new FormData();
      formdata.append('file', {
        uri: image.location,
        name: image.filename,
        type: image.mimetype
      });

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

      console.log('Response status: ' + response.status);

      if (response.status === 200) {
        const responseData = await response.json(); // { link: '', errors: [] }
        console.log(responseData)

        image.link = responseData.link;
        errors = [...errors, ...responseData.errors];

        // TODO clear image from cache?
      } else {
        errors = [...errors, `Response status: ${response.status}`];
      }
    } catch (error) {
      console.log(error);
      errors.push(error.message);
    }

    if (errors.length > 0) {
      showMessage({
        message: i18n.t('ERROR_BACKEND'),
        description: errors.join(' | '),
        type: 'danger',
        icon: 'danger',
        duration: 6000
      });
    }
  }
}
