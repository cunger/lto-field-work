import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import ScrollContainer from '../components/ScrollContainer';
import Heading from '../components/Heading';
import ListItem from '../components/ListItem';
import ConfirmPrompt from '../components/ConfirmPrompt';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../components/context/GlobalContext';
import { useTailwind } from 'tailwind-rn';
import Item from '../model/Item';

function Upload({ navigation }) {
  const tailwind = useTailwind();
  
  const [signedUnsyncedItems, setSignedUnsyncedItems] = useState<Item[]>([]);
  const [unsignedUnsyncedItems, setUnsignedUnsyncedItems] = useState<Item[]>([]);
  const [confirmDeleteAllVisible, setConfirmDeleteAllVisible] = useState(false);
  const [confirmDeleteUnsignedVisible, setConfirmDeleteUnsignedVisible] = useState(false);

  async function loadData() {
    GlobalContext.load();
    const items = await Datastore.items();
    setSignedUnsyncedItems(items.filter(item => Item.signed(item) && !item.synced));
    setUnsignedUnsyncedItems(items.filter(item => !Item.signed(item) && !item.synced));
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

  const deleteUnsigned = async () => {
    await Datastore.remove(unsignedUnsyncedItems);
    await loadData();
  };

  const clearAll = async () => {
    await Datastore.clearAll();
    await loadData();
  };

  // TODO Bundle beachclean items per date, location and note?
  const openItem = (item: Item) => {
    if (item.type == 'Catch') { 
      navigation.navigate('DataEntry', { 
        screen: 'Fisheries', 
        params: {
          item,
          date: new Date(item.date),
          location: item.location,
          // TODO photos
        }
      });
    }
    if (item.type == 'Trash') { 
      navigation.navigate('DataEntry', { 
        screen: 'BeachClean', 
        params: {
          items: { [item.category]: item.quantity },
          date: new Date(item.date),
          location: item.location,
          additionalNotes: item.additionalNotes
        } 
      });
    }
  };

  return (
    <ScrollContainer>
      <Heading title='Local data' actionTitle='Upload' actionOnPress={upload} />
      {
        signedUnsyncedItems.length === 0 &&
        <Text style={tailwind('m-2')}>
          All data has been uploaded. Way to go!
        </Text>
      }
      {
        signedUnsyncedItems.length > 0 &&
        <View>
          <Text style={tailwind('mx-4 my-2')}>The following data has not yet been uploaded:</Text>
          
          {signedUnsyncedItems.map((item, index) => (
            <ListItem key={index}>
              <View style={tailwind('flex flex-row items-center')}>
                <TouchableOpacity onPress={() => openItem(item)} style={tailwind('w-10 px-2 py-2 border border-gray-300 rounded-md bg-white')}>
                  <Text>{Item.logoFor(item)}</Text>
                </TouchableOpacity>
                <Text> {Item.prettyPrint(item)}</Text>
                <Text style={tailwind('text-gray-500')}> {Item.printDetails(item)}</Text>
              </View>
            </ListItem>          
          ))}
        </View>
      }
      <Heading title='Unsigned data' actionTitle='🔥 Delete' actionOnPress={() => {
        setConfirmDeleteUnsignedVisible(true);
        return Promise.resolve();
      }} />
      {
        unsignedUnsyncedItems.length === 0 &&
        <Text style={tailwind('m-2')}>
          You have no unsigned data. Looks good!
        </Text>
      }
      {
        unsignedUnsyncedItems.length > 0 &&
        <View>
          <Text style={tailwind('mx-4 my-2')}>The following entries are unsigned (and will not be uploaded unless you sign them):</Text>

          {unsignedUnsyncedItems.map((item, index) => (
            <ListItem key={index}>
              <View style={tailwind('flex flex-row items-center')}>
                <TouchableOpacity onPress={() => openItem(item)} style={tailwind('w-10 px-2 py-2 border border-gray-300 rounded-md bg-white')}>
                  <Text>{Item.logoFor(item)}</Text>
                </TouchableOpacity>
                <Text> {Item.prettyPrint(item)}</Text>
                <Text style={tailwind('text-gray-500')}> {Item.printDetails(item)}</Text>
              </View>
            </ListItem>          
          ))}
          <ConfirmPrompt visible={confirmDeleteUnsignedVisible}
            actionPhrase='delete all unsigned data'
            actionExplanation='This will delete all data you collected but did not sign.'
            actionButtonText='Delete all'
            action={deleteUnsigned}
            hide={() => setConfirmDeleteUnsignedVisible(false)} />
        </View>
      }

      <Heading title='App storage' actionTitle='🔥 Clear' actionOnPress={() => {
        setConfirmDeleteAllVisible(true);
        return Promise.resolve();
      }} />
      <Text style={tailwind('m-2')}>
        Only clear the app storage if you have nothing to upload. You will really lose all (!) data.
      </Text>
      <ConfirmPrompt visible={confirmDeleteAllVisible}
        actionPhrase='clear the storage'
        actionExplanation='This will delete data that was not yet uploaded as well as your whole history.'
        actionButtonText='Delete all'
        action={clearAll}
        hide={() => setConfirmDeleteAllVisible(false)} />
    </ScrollContainer>
  );
}

export default Upload;
