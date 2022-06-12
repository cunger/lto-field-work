import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from 'react-native';
import ScrollContainer from '../components/ScrollContainer';
import Heading from '../components/Heading';
import ListItem from '../components/ListItem';
import ConfirmPrompt from '../components/ConfirmPrompt';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../components/context/GlobalContext';
import { useTailwind } from 'tailwind-rn';
import Item from '../model/Item';

function Upload() {
  const tailwind = useTailwind();
  
  const [unsyncedItems, setUnsyncedItems] = useState<Item[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);

  async function loadData() {
    GlobalContext.load();
    setUnsyncedItems(await Datastore.items());
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

  const clearAll = async () => {
    await Datastore.clearAll();
    await loadData();
  };

  return (
    <ScrollContainer>
      <Heading title='Local data' actionTitle='Upload' actionOnPress={upload} />

      {
        unsyncedItems.length === 0 &&
        <Text style={tailwind('m-2')}>
          All data has been uploaded. Way to go!
        </Text>
      }
      {
        unsyncedItems.length > 0 && 
        <View>
          <Text style={tailwind('mx-4 my-2')}>The following data has not yet been uploaded:</Text>
          
          <ListItem><Text>{` 🗑️ ${unsyncedItems.filter(item => item.type == 'Trash').length} trash items`}</Text></ListItem>
          <ListItem><Text>{` 🎣 ${unsyncedItems.filter(item => item.type == 'Catch').length} catch items`}</Text></ListItem>
        </View>
      }

      <Heading title='Storage' actionTitle='🔥 Clear' actionOnPress={() => {
        setConfirmVisible(true);
        return Promise.resolve();
      }} />
      <Text style={tailwind('m-2')}>
        Only clear the app storage if you have nothing to upload. You will really lose all (!) data.
      </Text>
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase='clear the storage'
        actionExplanation='This will delete data that was not yet uploaded as well as your whole history.'
        actionButtonText='Delete all'
        action={clearAll}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default Upload;
