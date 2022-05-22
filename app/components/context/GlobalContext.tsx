import Datastore from '../data/LocalDatastore';

const GlobalContext = {
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
  }
};

export default GlobalContext;
