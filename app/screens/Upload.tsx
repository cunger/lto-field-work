import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, Button } from 'react-native';
import ScrollContainer from '../components/ScrollContainer';
import Heading from '../components/Heading';
import ListItem from '../components/ListItem';
import ConfirmPrompt from '../components/ConfirmPrompt';
import Datastore from '../components/data/LocalDatastore';
import Report from '../components/data/Report';
import GlobalContext from '../components/context/GlobalContext';
import { useTailwind } from 'tailwind-rn';

function Upload({ navigation }) {
  const tailwind = useTailwind();
  const [report, setReport] = useState(Report());
  const [confirmVisible, setConfirmVisible] = useState(false);

  async function loadData() {
    setReport(await Datastore.summary());
    GlobalContext.load();
  }

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  const upload = async () => {
    await Datastore.syncAll();
    await loadData();
  };

  const clearUploaded = async () => {
    await Datastore.clearSynced();
    await loadData();
  };

  const clearAll = async () => {
    await Datastore.clearAll();
    await loadData();
  };

  return (
    <ScrollContainer>
      <Heading title='Local data' actionTitle='Upload' actionOnPress={upload} />
      <ListItem><Text>{` 🗑️ ${report.Trash.unsynced} trash items`}</Text></ListItem>
      <ListItem><Text>{` 🎣 ${report.Catch.unsynced} catch items`}</Text></ListItem>

      <Heading title='Uploaded data' actionTitle='Clear' actionOnPress={clearUploaded} />
      <ListItem><Text>{` 🗑️ ${report.Trash.synced} trash items`}</Text></ListItem>
      <ListItem><Text>{` 🎣 ${report.Catch.synced} catch items`}</Text></ListItem>

      <Heading title='Local storage' actionTitle='🔥 Clear all' actionOnPress={() => {
        if (report.total == 0) return;
        setConfirmVisible(true);
      }} />
      <Text style={tailwind('m-2')}>
        There's a total of {report.total} items in your storage.
      </Text>
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase='clear all stored data entries'
        actionExplanation='This will also delete entries that were not yet uploaded.'
        actionButtonText='Delete all'
        action={clearAll}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default Upload;
