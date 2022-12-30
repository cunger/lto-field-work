import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage'; // https://react-native-async-storage.github.io/async-storage/docs/api/
import * as FileSystem from 'expo-file-system';
import Item from '../../model/Item';
import upload from './Uploader';

export default class Datastore {

  // ---- User information ----

  static async setUserName(name: string) {
    await AsyncStorage.setItem('@username', name);
  }

  static async setUserToken(token: string) {
    await AsyncStorage.setItem('@usertoken', token);
  }

  static async setUserVerified(verified: boolean) {
    await AsyncStorage.setItem('@userverified', verified.toString());
  }

  static async setUserEmail(email: string) {
    await AsyncStorage.setItem('@useremail', email);
  }

  static async getUserName() {
    return AsyncStorage.getItem('@username');
  }

  static async getUserToken() {
    return AsyncStorage.getItem('@usertoken');
  }

  static async getUserVerified() {
    return AsyncStorage.getItem('@userverified');
  }

  static async getUserEmail() {
    return AsyncStorage.getItem('@useremail');
  }

  // ---- Analytics ----

  static async numberOfUnsynced() {
    const items = await this.items();
    return items.filter(item => Item.signed(item) && !item.synced).length;
  }

  static async saveInStatistics(item: Item) {
    await AsyncStorage.setItem('@lastactivedate', item.date.toLocaleDateString());
    await AsyncStorage.setItem('@lastactivelocation', `${item.location}`);

    const statisticsString = await AsyncStorage.getItem('@statistics');
    const statistics = statisticsString ? JSON.parse(statisticsString) : {};
    
    if (item.type == 'Catch' && item.quantity > 0) {
      const species = `${item.species || 'Fish'}`;
      statistics.Catch = statistics.Catch || {};
      statistics.Catch[species] = (statistics.Catch[species] || 0) + item.quantity;
    }

    if (item.type == 'Trash') {
      const category = `${item.category.startsWith('Plastic') ? 'Plastic piece' : item.category}`;
      statistics.Trash = statistics.Trash || {};
      statistics.Trash[category] = (statistics.Trash[category] || 0) + item.quantity;
    }

    await AsyncStorage.setItem('@statistics', JSON.stringify(statistics));
  }

  static async lastActiveDate() {
    return AsyncStorage.getItem('@lastactivedate');
  }

  static async lastActiveLocation() {
    return AsyncStorage.getItem('@lastactivelocation');
  }

  static async statistics() {
    const statisticsString = await AsyncStorage.getItem('@statistics');
    return statisticsString ? JSON.parse(statisticsString) : {};
  }

  // ---- Colleced data and photos ----

  static async item(id: string): Promise<Item> {
    const value = await AsyncStorage.getItem(id);
    return value ? JSON.parse(value) : null;
  }

  static async items(): Promise<Item[]> {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys.filter(key => !key.startsWith('@')));
    return values.map((value) => JSON.parse(value[1]));
  }

  static async save(item: Item) {
    try {
      await AsyncStorage.setItem(item.id, JSON.stringify(item));
      await this.saveInStatistics(item);
    } catch (error) {
      showMessage({
        message: 'Could not save data.',
        description: `${error}`,
        type: 'warning',
        icon: 'danger'
      });
    }
  }

  static async syncAll() {
    try {
      const items: Item[] = [];
      const keys: string[] = await AsyncStorage.getAllKeys();

      for (let key of keys) {
        if (key.startsWith('@')) continue;

        const value = await AsyncStorage.getItem(key);
        const item = JSON.parse(value);

        // Signed items are uploaded.
        // Unsigned items are ignored. 
        if (!item.synced && Item.signed(item)) {
          items.push(item);
        }
      }

      const uploaded = await upload(items);
      for (let item of uploaded) {
        item.synced = true;
        await this.save(item);
      }
    } catch (error) {
      console.log(error);
      showMessage({
        message: 'Could not upload data.',
        description: `${error}`,
        type: 'warning',
        icon: 'warning'
      });
    }
  }

  static async removeItem(itemId: string) {
    try {
      await AsyncStorage.removeItem(itemId);
    } catch(error) {
      console.log(error);
      showMessage({
        message: 'There was an error when deleting data.',
        description: `${error}`,
        type: 'warning',
        icon: 'danger'
      });
    }
  }

  static async removeItems(items: Item[]) {
    for (const item of items) {
      try {
        await AsyncStorage.removeItem(item.id);
      } catch(error) {
        console.log(error);
        showMessage({
          message: 'There was an error when deleting data.',
          description: `${error}`,
          type: 'warning',
          icon: 'danger'
        });
      }
    }
  }

  // ---- Cleaning up ----
  
  static async clearSyncedItems() {
    try {
      const items = await this.items();
      const syncedItems = items.filter(item => item.synced);
      for (const item of syncedItems) {
        try {
          await AsyncStorage.removeItem(item.id);
        } catch(error) {
          console.log(error);
          showMessage({
            message: 'There was an error when cleaning up.',
            description: `${error}`,
            type: 'warning',
            icon: 'danger'
          });
        }
      }
    } catch(error) {
      console.log(error);
    }
  }
};
