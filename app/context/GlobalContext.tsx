import Datastore from '../components/data/LocalDatastore';

const GlobalContext = {
  i18n: Datastore.i18n,
  language: () => Datastore.i18n.locale,
  switchTo: (language: string) => { 
    Datastore.setLanguage(language);
  },
  unsyncedItems: 0,
  load: function() {
    Datastore.loadLanguage();
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
