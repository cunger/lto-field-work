import Datastore from '../components/data/LocalDatastore';

const GlobalContext = {
  i18n: Datastore.i18n,
  unsyncedItems: 0,
  countListeners: [],
  languageListeners: [],
  language: () => Datastore.i18n.locale,
  switchTo: function (language: string) { 
    Datastore.setLanguage(language);
    this.languageListeners.forEach(update => update(language));
  },
  load: function() {
    Datastore.loadLanguage();
    Datastore.numberOfUnsynced().then((count) => { this.setUnsyncedItems(count); });
  },
  subscribeToCount: function (listener) {
    this.countListeners.push(listener);
  },
  subscribeToLanguage: function (listener) {
    this.languageListeners.push(listener);
  },
  unsubscribeAll: function () {
    this.countListeners = [];
    this.languageListeners = [];
  },
  setUnsyncedItems: function (value) {
    this.unsyncedItems = value;
    this.countListeners.forEach(update => update(value));
  },
};

export default GlobalContext;
