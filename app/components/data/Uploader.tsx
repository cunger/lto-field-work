import { showMessage } from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo'; // https://github.com/react-native-netinfo/react-native-netinfo
import Session from '../../model/Session';
import Item from '../../model/Item';
import Image from '../../model/Image';
import Category from '../../model/beachclean/Category';
import { I18n } from 'i18n-js/typings';
import * as FileSystem from 'expo-file-system';
import Catch from '../../model/fisheries/Catch';

const BASE_URL = 'https://lto-back-office.netlify.app/.netlify/functions/api';

export default async function upload(sessions: Session[], i18n: I18n, increaseUploadProgress: (_ : number) => void, setUploadStatusText: (_: string) => void) {
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
  let errors: string[] = [];

  // For upload progess, determine the number of upload steps.
  // One step for each session.
  let steps = sessions.length;
  // One step for each photo (uploaded separately).
  sessions.forEach((session: Session) => 
    session.items.forEach((item: Item) => {
      if (item.type === 'Catch') {
        steps += ((item as Catch).photos || []).length 
      }
    })
  );
  // Equal upload progress for each step. (Upload progress is a float in [0,1].)
  const stepPercentage = 100 / steps;

  // First, upload the photos, so that the uploaded data contains the final image links.
  for (const session of sessions) {
    const items = session.items;

    // Upload images (if there are any).
    for (let item of items) {
      if (item.type === 'Catch') {
        for (let photo of ((item as Catch).photos || [])) {
          if (!photo.location) continue;

          setUploadStatusText(photo.filename);

          await uploadImage(photo, i18n, increaseUploadProgress, stepPercentage, setUploadStatusText);
          
          increaseUploadProgress(stepPercentage);
        }
      }
    }
  }

  // Then upload the session data.
  try {
    setUploadStatusText(sessions.length + (i18n.locale == 'pt' ? ' sessões...' : ' sessions...'));

    for (let session of sessions) {
      session.items = session.items.map(item => withPrettyPrintedItemValues(item, i18n));

      const response = await fetch(`${BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Ship-Name': 'BeanWithBaconMegaRocket'
        },
        body: JSON.stringify(withPrettyPrintedSessionValues(session, i18n))
      });

      const responseData = await response.json(); // { uploaded: [], errors: [] }
      const uploaded = responseData?.uploaded ?? [];
      
      if (uploaded.contains(session.id)) {
        session.synced = true;
      }

      for (let item of session.items) {
        if (uploaded.contains(item.id)) {
          item.synced = true;
        }
      }

      errors = [...errors, ...(responseData?.errors ?? [])];

      increaseUploadProgress(stepPercentage);
    }
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    showMessage({
      message: i18n.t('ERROR_DATA_UPLOAD'),
      description: errors.join(' | '),
      type: 'danger',
      icon: 'danger',
      duration: 6000
    });
  }

  setUploadStatusText('🗸');
}

async function uploadImage(image: Image, i18n: I18n) {
  const errors: string[] = [];

  try {
    const formData = new FormData();
    formData.append('file', {
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
      body: formData
    });

    if (response.status === 200) {
      const responseData = await response.json(); // { link: '', errors: [] }
      
      image.link = responseData.link;
    
      await FileSystem.deleteAsync(image.location);
    } else {
      errors.push(`Response status: ${response.status}`);
    }
  } catch (error) {
    errors.push(`${error}`);
  }

  if (errors.length > 0) {
    showMessage({
      message: i18n.t('ERROR_IMAGE_UPLOAD'),
      description: errors.join(' | '),
      type: 'danger',
      icon: 'danger',
      duration: 4000
    });
  }
}

function withPrettyPrintedSessionValues(session: Session, i18n: I18n) {
  const newsession = { ...session };

  if (session.location) newsession.location = i18n.t(session.location, { locale: 'en' });
  
  return newsession;
}

function withPrettyPrintedItemValues(item: Item, i18n: I18n) {
  const newitem = { ...item };

  if (item.date) newitem.date = new Date(item.date);
  if (item.location) newitem.location = i18n.t(item.location, { locale: 'en' });
  if (item.base) newitem.base = i18n.t(item.base, { locale: 'en' });
  if (item.method) newitem.method = i18n.t(item.method, { locale: 'en' });
  if (item.species) newitem.species = i18n.t(item.species, { locale: 'en' });
  if (item.sex) newitem.sex = i18n.t(item.sex, { locale: 'en' });
  if (item.category) newitem.category = i18n.t(Category[item.category], { locale: 'en' });
  
  return newitem;
}