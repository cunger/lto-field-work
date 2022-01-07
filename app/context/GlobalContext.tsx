import React from 'react';
import Datastore from 'components/data/LocalDatastore';

const GlobalContext = React.createContext({
  unsyncedItems: 0
});

export default GlobalContext;
