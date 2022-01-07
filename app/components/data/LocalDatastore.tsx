import AsyncStorage from '@react-native-async-storage/async-storage';
import Report from './Report';
import Backend from './API';

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
  getUserName: () => {
    return AsyncStorage.getItem('@username');
  },
  getUserToken: () => {
    return AsyncStorage.getItem('@usertoken');
  },
  getUserVerified: () => {
    return AsyncStorage.getItem('@userverified');
  },
  save: async (item) => {
    try {
      console.log(JSON.stringify(item));
      await AsyncStorage.setItem(item.id, JSON.stringify(item));
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
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
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
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
        if (!item.synced) count += 1;
      }
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
    }

    return count;
  },
  syncAll: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys.filter(key => !key.startsWith('@')));
      for (let value of values) {
        let item = JSON.parse(value[1]);
        if (!item.synced) {
          await Backend.persist(item);
          item.synced = true;
          await AsyncStorage.setItem(item.id, JSON.stringify(item));
        }
      }
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
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
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
    }
  },
  clearAll: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys.filter(key => !key.startsWith('@')));
    } catch(e) {
      // TODO Monitoring!
      console.log(e);
    }
  }
};

export default Datastore;
