import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, Button } from 'react-native';
import Heading from '../components/Heading';
import { ActionButton, Theme } from '../components/ActionButton';
import Datastore from '../components/data/LocalDatastore';
import Report from '../components/data/Report';
import styles from '../styles/containerStyles';

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

  const sync = async () => {
    await Datastore.syncAll();
    await loadData();
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
    <View style={styles.container}>
      <ActionButton title='🔄 Sync all' onPress={sync} theme={Theme.Go} />

      <Heading title='❌ Unsynced data' />
      <Text>{` 🗑️ ${report.Trash.unsynced} trash items`}</Text>
      <Text>{` 🎣 ${report.Catch.unsynced} catch items`}</Text>

      <Heading title='✅ Synced data' />
      <Text>{` 🗑️ ${report.Trash.synced} trash items`}</Text>
      <Text>{` 🎣 ${report.Catch.synced} catch items`}</Text>

      <Heading title='Want to free local storage?' />
      <ActionButton title='🗑️ Clear synced' onPress={clearSynced} theme={Theme.Warning} />
      <ActionButton title='🔥 Clear all' onPress={clearAll} theme={Theme.Danger} />
    </View>
  );
}

export default History;
