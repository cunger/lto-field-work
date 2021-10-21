import AsyncStorage from '@react-native-async-storage/async-storage';
import Report from './Report';

const Datastore = {
  save: async (item) => {
    try {
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
      const values = await AsyncStorage.multiGet(keys);
      values.forEach((value) => {
        report.countItem(JSON.parse(value[1]));
      });
    } catch (e) {
      // TODO Monitoring!
    }

    return report;
  },
  numberOfUnsynced: async () => {
    let count = 0;
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (key of keys) {
        let value = await AsyncStorage.getItem(key);
        let item = JSON.parse(value);
        if (!item.synced) count = count + 1;
      }
    } catch (e) {
      // TODO Monitoring!
    }

    return count;
  },
  syncAll: async () => {
    let syncedItems = [];
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);
      values.forEach((value) => {
        let item = JSON.parse(value[1]);
        if (!item.synced) {
          // TODO Send to API.
          // TODO if successful:
          item.synced = true;
          syncedItems.push([item.id, JSON.stringify(item)]);
        }
      });

      await AsyncStorage.multiSet(syncedItems);
    } catch (e) {
      // TODO Monitoring!
    }
  },
  clearSynced: async () => {
    let keysOfSyncedItems = [];
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (key of keys) {
        let value = await AsyncStorage.getItem(key);
        let item = JSON.parse(value);
        if (item.synced) keysOfSyncedItems.push(key);
      }
    } catch (e) {
      // TODO Monitoring!
    }

    await AsyncStorage.multiRemove(keysOfSyncedItems);
  },
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      // TODO Monitoring!
    }
  }
};

export default Datastore;
