import Datastore from '../components/data/LocalDatastore';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

let defaultLanguage = getLocales()[0].languageCode;
if (defaultLanguage !== 'en' && defaultLanguage !== 'pt') {
  defaultLanguage = 'en';
}

const translations = require('./translations.json');
const i18n = new I18n(translations);
i18n.enableFallback = true;

const GlobalContext = {
  i18n: i18n,
  language: () => i18n.locale,
  switchTo: (language: string) => { 
    i18n.locale = language;
    Datastore.setLanguage(language);
  },
  unsyncedItems: 0,
  load: function() {
    Datastore.getLanguage().then((language) => { i18n.locale = language || defaultLanguage; });
    Datastore.numberOfUnsynced().then((count) => { this.setUnsyncedItems(count); });
  },
  listeners: [],
  subscribe: function (listener) {
    this.listeners.push(listener);
  },
  unsubscribeAll: function () {
    this.listeners = [];
  },
  setUnsyncedItems: function (value) {
    this.unsyncedItems = value;
    this.listeners.forEach(update => update(value));
  },
};

export default GlobalContext;
