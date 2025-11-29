import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage'; // https://react-native-async-storage.github.io/async-storage/docs/api/
import Item from '../../model/Item';
import upload from './Uploader';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import translations from './translations';
import DateTime from '../../model/DateTime';
import Session from '../../model/Session';
import FisheriesSession from '../../model/fisheries/FisheriesSession';
import BeachCleanSession from '../../model/beachclean/BeachCleanSession';

const languages = ['en', 'pt'];
const localLanguage = getLocales()[0].languageCode;
const defaultLanguage = languages.includes(localLanguage) ? localLanguage : 'en';
const i18n = new I18n(translations);
i18n.locale = defaultLanguage;
i18n.enableFallback = true;

export default class Datastore {

  static i18n = i18n;

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

  static async setLanguage(iso6391code: string) {
    i18n.locale = iso6391code;
    return AsyncStorage.setItem('@language', iso6391code);
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

  static async loadLanguage() {
    return AsyncStorage.getItem('@language').then(language => i18n.locale = language || defaultLanguage);
  }

  // ---- Analytics ----

  static async numberOfUnsynced() {
    const sessions = await this.sessions();
    return sessions.filter(session => session.signed() && !session.synced).length;
  }

  static async saveInStatistics(session: Session) {
    await AsyncStorage.setItem('@lastactivedate', `${session.startDate}`);
    await AsyncStorage.setItem('@lastactivelocation', `${session.location}`);

    const statisticsString = await AsyncStorage.getItem('@statistics');
    const statistics = statisticsString ? JSON.parse(statisticsString) : {};
    
    if (session.type == 'Fisheries') {
      statistics.fisheries = (statistics.fisheries || 0) + 1;
      statistics.catches = (statistics.catches || 0) + (session as FisheriesSession).items.length;
    }

    if (session.type == 'BeachClean') {
      statistics.beachcleans = (statistics.beachcleans || 0) + 1;
      statistics.trashitems = (statistics.trashitems || 0) + (session as BeachCleanSession).items.length;
      if ((session as BeachCleanSession).totalWeightInKg) {
        statistics.trashkg = (statistics.trashkg || 0) + (session as BeachCleanSession).totalWeightInKg;
      }
    }

    await AsyncStorage.setItem('@statistics', JSON.stringify(statistics));
  }

  static async lastActiveDate() {
    const epochString = await AsyncStorage.getItem('@lastactivedate');
    if (epochString === 'undefined') {
      return null;
    } else {
      return new DateTime(new Date(parseInt(epochString)));
    }
  }

  static async lastActiveLocation() {
    const location = await AsyncStorage.getItem('@lastactivelocation');
    if (location === 'undefined') {
      return null;
    } else {
      return location;
    }
  }

  static async statistics() {
    const statisticsString = await AsyncStorage.getItem('@statistics');
    return statisticsString ? JSON.parse(statisticsString) : {};
  }

  // ---- Colleced data and photos ----

  static async session(id: string): Promise<Session> {
    const value = await AsyncStorage.getItem(id);
    return value ? JSON.parse(value) : null;
  }

  static async sessions(): Promise<Session[]> {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys.filter(key => !key.startsWith('@')));
    return values.map((value) => JSON.parse(value[1]));
  }

  static async save(session: Session) {
    try {
      await AsyncStorage.setItem(session.id, JSON.stringify(session));
      await this.saveInStatistics(session);
    } catch (error) {
      showMessage({
        message: i18n.t('ERROR_FAILED_TO_SAVE_DATA'),
        description: `${error}`,
        type: 'warning',
        icon: 'danger'
      });
    }
  }

  static async syncAll(increaseUploadProgress: (_ : number) => void, setUploadStatusText: (_: string) => void) {
    try {
      const sessions: Session[] = [];
      const keys: readonly string[] = await AsyncStorage.getAllKeys();

      for (let key of keys) {
        // All keys for internal use start with '@', so simply skip them when uploading data.
        if (key.startsWith('@')) continue;

        const value = await AsyncStorage.getItem(key);
        if (!value) continue;

        const session = JSON.parse(value);

        // Signed sessions are uploaded.
        // Unsigned sessions are ignored. 
        if (session.signed() && !session.synced) {
          sessions.push(session);
        }
      }

      await upload(sessions, i18n, increaseUploadProgress, setUploadStatusText);

      for (let session of sessions) {
        await this.save(session);
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
          showMessage({
            message: i18n.t('ERROR_CLEANING_UP'),
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
