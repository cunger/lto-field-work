import React, { useContext, createContext, useState, useEffect } from 'react';
import Datastore from '../data/LocalDatastore';

const GlobalContext = {
  unsyncedItems: 0,
  load: function() {
    Datastore.numberOfUnsynced().then((count) => { this.setUnsyncedItems(count); });
  },
  listeners: [],
  registerUpdate: function (listener) {
    this.listeners.push(listener);
  },
  setUnsyncedItems: function (value) {
    this.unsyncedItems = value;
    this.listeners.forEach(update => update(value));
  }
};

export default GlobalContext;
