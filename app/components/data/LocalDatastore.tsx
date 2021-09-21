import AsyncStorage from '@react-native-async-storage/async-storage';

const Datastore = {
  save: async (item) => {
    try {
      await AsyncStorage.setItem(item.id, JSON.stringify(item));
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
    }
  },
  numberOfUnsynced: async () => {
    let count = 0;
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (key in keys) {
        let value = await AsyncStorage.getItem(key);
        let item = JSON.parse(value);
        if (!item.synced) count = count + 1;
      }
    } catch (e) {
      // TODO Monitoring!
    }

    return count;
  },
  numberOfSynced: async () => {
    let count = 0;
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (key in keys) {
        let value = await AsyncStorage.getItem(key);
        let item = JSON.parse(value);
        if (item.synced) count = count + 1;
      }
    } catch (e) {
      // TODO Monitoring!
    }

    return count;
  },
  clearSynced: async () => {
    let items = {};
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (key in keys) {
        let value = await AsyncStorage.getItem(key);
        let item = JSON.parse(value);
        if (item.synced) {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (e) {
      // TODO Monitoring!
    }
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
