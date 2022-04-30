import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
// import RNFetchBlob from 'rn-fetch-blob';
import Report from './Report';
import Uploader from './Uploader';

const Datastore = {
  setUserName: async (name) => {
    await AsyncStorage.setItem('@username', name);
  },
  setUserToken: async (token) => {
    await AsyncStorage.setItem('@usertoken', token);
  },
  setUserVerified: async (verified) => {
    await AsyncStorage.setItem('@userverified', verified.toString());
  },
  setUserEmail: async (email) => {
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
  save: async (item) => {
    try {
      await AsyncStorage.setItem(item.id, JSON.stringify(item));
    } catch (error) {
      showMessage({
        message: 'Could not save data.',
        description: `${error}`,
        type: 'warning',
        icon: 'error'
      });
    }
  },
  savePhoto: async (photo, filename) => {
    try {
      const location = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(location, 'data:image/jpeg;base64,' + photo.base64);

      console.log(location);
      photo.location = location;
    } catch(error) {
      showMessage({
        message: 'Could not save photo.',
        description: error.message,
        type: 'warning',
        icon: 'error'
      });
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
      const uploaded = await Uploader.persist(items);
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
        icon: 'error'
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
        icon: 'error'
      });
    }

    // TODO remove images
    // remove file by specifying a path
    // RNFetchBlob.fs.unlink('some-file-path').then(() => {
    //   // ...
    // });
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
        icon: 'error'
      });
    }
  }
};

export default Datastore;
