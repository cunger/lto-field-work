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
  clearSynced: async () => {
    try {
      // TODO
    } catch(e) {
      // TODO Monitoring!
      console.log(e);
    }
  },
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      // TODO Monitoring!
      console.log(e);
    }
  }
};

export default Datastore;
