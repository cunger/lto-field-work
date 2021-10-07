import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, Button } from 'react-native';
import ScrollContainer from 'components/ScrollContainer';
import Heading from 'components/Heading';
import ListItem from 'components/ListItem';
import Datastore from 'components/data/LocalDatastore';
import Report from 'components/data/Report';
import { tailwind } from 'tailwind';

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
    <ScrollContainer>
      <Heading title='Unsynced data' actionTitle='Sync' actionOnPress={sync} />
      <ListItem><Text>{` 🗑️ ${report.Trash.unsynced} trash items`}</Text></ListItem>
      <ListItem><Text>{` 🎣 ${report.Catch.unsynced} catch items`}</Text></ListItem>

      <Heading title='Synced data' actionTitle='Clear' actionOnPress={clearSynced} />
      <ListItem><Text>{` 🗑️ ${report.Trash.synced} trash items`}</Text></ListItem>
      <ListItem><Text>{` 🎣 ${report.Catch.synced} catch items`}</Text></ListItem>

      <Heading title='Local storage' actionTitle='🔥 Clear all' actionOnPress={clearAll}  />
      <Text>
        ... using XX kB of your storage.
      </Text>
    </ScrollContainer>
  );
}

export default History;
