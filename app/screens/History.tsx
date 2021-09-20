import * as React from 'react';
import { Text, View, Button } from 'react-native';
import Styles from '../styles/shared';
import Datastore from '../components/data/LocalDatastore';

function History() {
  const sync = () => {
    // TODO
    console.log('Uploading data...');
  };

  return (
    <View style={Styles.container}>
      <Text>You have X unsynced data entries.</Text>
      <Button title='Sync all' onPress={sync} />

      <Text>Want to free local storage?</Text>
      <Button title='🗑️ Clear synced' onPress={Datastore.clearSynced} />
      <Button title='🔥 Clear all' onPress={Datastore.clearAll} />
    </View>
  );
}

export default History;
