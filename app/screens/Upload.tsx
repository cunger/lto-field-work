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

  const print = (count, noun) => {
    if (noun == 'undefined') noun = 'other';

    const plural = (noun) => {
      if (noun.endsWith('cm')) return noun;
      if (noun.endsWith('gear')) return noun;
      return `${noun}s`;
    };

    return (count == 1)
      ? `${count} ${noun}`
      : `${count} ${plural(noun)}`;
  };

  return (
    <ScrollContainer>
      <Heading title='Local data' actionTitle='Upload' actionOnPress={upload} />
      <ListItem><Text>{` 🗑️ ${report.local.Trash} trash items`}</Text></ListItem>
      <ListItem><Text>{` 🎣 ${report.local.Catch} catch items`}</Text></ListItem>

      <Heading title='Uploaded data' actionTitle='Clear' actionOnPress={clearUploaded} />
      <Text style={tailwind('m-2')}>🎣 Catch:</Text>
      {Object.entries(report.uploaded.Catch).map((entry, index) => (
        <ListItem key={index}><Text>{` ️ ${print(entry[1], entry[0])}`}</Text></ListItem>
      ))}
      <Text style={tailwind('m-2')}>🗑️ Trash:</Text>
      {Object.entries(report.uploaded.Trash).map((entry, index) => (
        <ListItem key={index}><Text>{` ️ ${print(entry[1], entry[0])}`}</Text></ListItem>
      ))}

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
