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
      duration: 4000
    });

    return [];
  }

  // If there is a connection, upload data.

  // Upload images (if there are any).
  for (let item of items) {
    if (item.photos) {
      const uploads: Promise<void>[] = item.photos
        .filter(image => image.location)
        .map(image => uploadImage(image, i18n));

      await Promise.allSettled(uploads);
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
        body: JSON.stringify({ items: items.map(item => withTranslatedValues(item, i18n)) })
      });

      const responseData = await response.json(); // { uploaded: [], errors: [] }

      uploaded = responseData.uploaded || [];
      errors = responseData.errors || [];
    } catch (error) {
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

function uploadImage(image: Image, i18n: I18n): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image.location,
        name: image.filename,
        type: image.mimetype
      });

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/photo`);

      if (xhr.upload) {
        xhr.upload.onprogress = (event: ProgressEvent) => {
          console.log(event.loaded + ' / ' + event.total);
          // TODO
        };
      }

      xhr.onload = () => {
        const responseData = JSON.parse(xhr.response || xhr.responseText); // { link: '', errors: [] }
        image.link = responseData.link;
        resolve();
      };

      xhr.onerror = () => {
        showMessage({
          message: i18n.t('ERROR_UPLOAD'),
          description: xhr.responseText,
          type: 'danger',
          icon: 'danger',
          duration: 6000
        });
        reject();
      };

      xhr.ontimeout = () => {
        // Image was not uploaded, so the item is not uploaded and marked as sync.
        // The user can just try to upload again later.
        reject();
      }

      xhr.onabort = () => {
        // Image was not uploaded, so the item is not uploaded and marked as sync.
        // The user can just try to upload again later.
        reject();
      };

      // The 'Content-Type': 'multipart/form-data' header should be set automatically, 
      // because it needs a boundary string.
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Ship-Name', 'BeanWithBaconMegaRocket');
      
      xhr.send(formData);
    } catch (error) {
      showMessage({
        message: i18n.t('ERROR_UPLOAD'),
        description: `${error}`,
        type: 'danger',
        icon: 'danger',
        duration: 6000
      });
      reject();
    }
  });
}

function withTranslatedValues(item: Item, i18n: I18n) {
  const newitem = { ...item };
  if (item.location) newitem.location = i18n.t(item.location, 'en');
  if (item.base) newitem.base = i18n.t(item.base, 'en');
  if (item.method) newitem.method = i18n.t(item.method, 'en');
  if (item.species) newitem.species = i18n.t(item.species, 'en');
  if (item.sex) newitem.sex = i18n.t(item.sex, 'en');
  if (item.category) newitem.category = i18n.t(item.category, 'en');
  return newitem;
}