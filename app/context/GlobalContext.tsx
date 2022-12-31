import Datastore from '../components/data/LocalDatastore';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// TODO Load translations.
const translations = require('./translations.json');
let localLanguage = getLocales()[0].languageCode;
if (localLanguage !== 'pt') {
  localLanguage = 'en';
}
const i18n = new I18n(translations);
i18n.locale = localLanguage;
i18n.enableFallback = true;

const GlobalContext = {
  i18n: i18n,
  unsyncedItems: 0,
  load: function() {
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
