import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, Button } from 'react-native';
import Styles from '../styles/shared';
import Datastore from '../components/data/LocalDatastore';
import Report from '../components/data/Report';

function History({ navigation }) {
  const [report, setReport] = useState(Report());

  async function loadData() {
    const report = await Datastore.summary();
    setReport(report);
  }

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  const sync = () => {
    console.log('Uploading data...');
    // TODO Send unsynced items to API and set them to synced if successful.
  };

  const clearSynced = async () => {
    await Datastore.clearSynced();
    await loadData();
  };

  const clearAll = async () => {
    await Datastore.clearAll();
    await loadData();
  };

  return (
    <View style={Styles.container}>
      <Button title='Sync all' onPress={sync} />

      <Text>❌ Unsynced data</Text>
      <Text>{`🗑️ ${report.Trash.unsynced} trash items`}</Text>
      <Text>{`🎣 ${report.Catch.unsynced} catch items`}</Text>

      <Text>✅ Synced data</Text>
      <Text>{`🗑️ ${report.Trash.synced} trash items`}</Text>
      <Text>{`🎣 ${report.Catch.synced} catch items`}</Text>

      <Text>Want to free local storage?</Text>
      <Button title='🗑️ Clear synced' onPress={clearSynced} />
      <Button title='🔥 Clear all' onPress={clearAll} />
    </View>
  );
}

export default History;
