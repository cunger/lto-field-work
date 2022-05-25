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
    return items.length;
  }

  static async saveInStatistics(item: Item) {
    await AsyncStorage.setItem('@lastactivedate', item.date.toLocaleDateString());
    await AsyncStorage.setItem('@lastactivelocation', `${item.location}`);

    const statisticsString = await AsyncStorage.getItem('@statistics');
    const statistics = statisticsString ? JSON.parse(statisticsString) : {};
    
    if (item.type == 'Catch') {
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

  static async savePhoto(photo, filename: string) {
    let location;
    try {
      filename = filename.replaceAll(' ', '-');
      location = `${FileSystem.documentDirectory}${filename}`;

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
  }

  static async syncAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys.filter(key => !key.startsWith('@')));
      const items = values.map((value) => JSON.parse(value[1]));
      
      // Unsigned items are simply removed. 
      // (For testing purposes we pretend that we uploaded them.)
      const skipped = items.filter(item => !item.signature || !item.signature.token);
      skipped.forEach(id => AsyncStorage.removeItem(id));
      
      // Signed items are uploaded, and removed if the upload was successful.
      // (They're part of the analytics, so no reason to keep all details.) 
      const signed = items.filter(item => item.signature && item.signature.token);
      const uploaded = await upload(signed); // [ <id>, <id>, ... ]
      uploaded.forEach(id => AsyncStorage.removeItem(id));
    } catch (error) {
      showMessage({
        message: 'Could not upload data.',
        description: `${error}`,
        type: 'warning',
        icon: 'warning'
      });
    }
  }
  
  static async clearAll() {
    try {
      // Delete all entries in database.
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys); // keys.filter(key => !key.startsWith('@'))
      
      // Delete all photos stored in local filesystem.
      const localFiles = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}`);
      localFiles.forEach(filename => {
        FileSystem.deleteAsync(`${FileSystem.documentDirectory}${filename}`);
      });
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
};
