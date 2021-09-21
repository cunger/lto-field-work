import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, Button } from 'react-native';
import Styles from '../styles/shared';
import Datastore from '../components/data/LocalDatastore';

function History() {
  const [numberOfSyncedItems, setNumberOfSyncedItems] = useState(0);
  const [numberOfUnsyncedItems, setNumberOfUnsyncedItems] = useState(0);

  useFocusEffect(() => {
    async function loadData() {
      const syncedItems = await Datastore.numberOfSynced();
      const unsyncedItems = await Datastore.numberOfUnsynced();

      console.log('Loaded data!');
      console.log(syncedItems);

      setNumberOfSyncedItems(syncedItems);
      setNumberOfUnsyncedItems(unsyncedItems);
    }

    loadData();
  });

  const sync = () => {
    // TODO
    console.log('Uploading data...');
  };

  return (
    <View style={Styles.container}>

      <Button title='Sync all' onPress={sync} />

      <Text>{`🔖 ${numberOfUnsyncedItems} unsynced items`}</Text>
      <Text>{`✅ ${numberOfSyncedItems} synced items`}</Text>

      <Text>Want to free local storage?</Text>
      <Button title='🗑️ Clear synced' onPress={Datastore.clearSynced} />
      <Button title='🔥 Clear all' onPress={Datastore.clearAll} />
    </View>
  );
}

export default History;
