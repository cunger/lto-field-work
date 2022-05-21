import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
// import RNFetchBlob from 'rn-fetch-blob';
import Item from '../../model/Item';
import Report from './Report';
import persist from './Uploader';

const Datastore = {
  // User information
  setUserName: async (name: string) => {
    await AsyncStorage.setItem('@username', name);
  },
  setUserToken: async (token: string) => {
    await AsyncStorage.setItem('@usertoken', token);
  },
  setUserVerified: async (verified: boolean) => {
    await AsyncStorage.setItem('@userverified', verified.toString());
  },
  setUserEmail: async (email: string) => {
    await AsyncStorage.setItem('@useremail', email);
  },
  getUserName: () => {
    return AsyncStorage.getItem('@username');
  },
  getUserToken: () => {
    return AsyncStorage.getItem('@usertoken');
  },
  getUserVerified: () => {
    return AsyncStorage.getItem('@userverified');
  },
  getUserEmail: () => {
    return AsyncStorage.getItem('@useremail');
  },
  // Analytics
  saveInAnalytics(item: Item) {
    // TODO
  },
  // Storing photos and collected data
  save: async (item: Item) => {
    try {
      await AsyncStorage.setItem(item.id, JSON.stringify(item));
    } catch (error) {
      showMessage({
        message: 'Could not save data.',
        description: `${error}`,
        type: 'warning',
        icon: 'danger'
      });
    }
  },
  savePhoto: async (photo, filename: string) => {
    let location;
    try {
      location = `${FileSystem.documentDirectory}${filename}`;
      location = location.replaceAll(' ', '-');

      await FileSystem.writeAsStringAsync(location, photo.base64, {
        encoding: FileSystem.EncodingType.Base64
      });

      return location;
    } catch(error) {
      showMessage({
        message: 'Could not save photo.',
        description: error.message,
        type: 'warning',
        icon: 'danger'
      });
      console.log(location);
      console.log(error);
    }
  },
  summary: async () => {
    let report = Report();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys.filter(key => !key.startsWith('@')));
      values.forEach((value) => {
        report.countItem(JSON.parse(value[1]));
      });
    } catch (error) {
    }

    return report;
  },
  numberOfUnsynced: async () => {
    let count = 0;
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (key of keys) {
        if (key.startsWith('@')) continue;
        let value = await AsyncStorage.getItem(key);
        let item = JSON.parse(value);
        if (!item.synced) count += (item.quantity || 1);
      }
    } catch (error) {
    }

    return count;
  },
  syncAll: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys.filter(key => !key.startsWith('@')));
      const items = values
        .map((value) => JSON.parse(value[1]))
        .filter((item) => !item.synced);

      // uploaded: [ <id>, <id>, ... ]
      const uploaded = await persist(items);
      items.forEach((item) => {
        if (uploaded.includes(item.id) || !item.signature || !item.signature.token) {
          item.synced = true;
          AsyncStorage.setItem(item.id, JSON.stringify(item));
        }
      });
    } catch (error) {
      showMessage({
        message: 'Could not upload data.',
        description: `${error}`,
        type: 'warning',
        icon: 'warning'
      });
    }
  },
  clearSynced: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (let key of keys) {
        if (key.startsWith('@')) continue;
        let value = await AsyncStorage.getItem(key);
        let item = JSON.parse(value);
        if (item.synced) await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      showMessage({
        message: 'There was an error when clearing uploaded data.',
        description: `${error}`,
        type: 'warning',
        icon: 'danger'
      });
    }
  },
  clearAll: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys.filter(key => !key.startsWith('@')));
    } catch(e) {
      showMessage({
        message: 'There was an error when deleting data.',
        description: `${error}`,
        type: 'warning',
        icon: 'danger'
      });
    }
  }
};

export default Datastore;
