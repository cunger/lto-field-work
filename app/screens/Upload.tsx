import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import ScrollContainer from '../components/ScrollContainer';
import Heading from '../components/Heading';
import ListItem from '../components/ListItem';
import ConfirmPrompt from '../components/ConfirmPrompt';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import { useTailwind } from 'tailwind-rn';
import Item from '../model/Item';

function Upload({ navigation }) {
  const tailwind = useTailwind();
  
  const [signedUnsyncedItems, setSignedUnsyncedItems] = useState<Item[]>([]);
  const [unsignedUnsyncedItems, setUnsignedUnsyncedItems] = useState<Item[]>([]);
  const [confirmDeleteUnsignedItemsVisible, setConfirmDeleteUnsignedItemsVisible] = useState(false);

  async function loadData() {
    GlobalContext.load();

    const byDate = (i1: Item, i2: Item) => new Date(i2.date).getTime() - new Date(i1.date).getTime();
    const items = await Datastore.items();

    setSignedUnsyncedItems(items
      .filter(item => Item.signed(item) && !item.synced)
      .sort(byDate)
    );

    setUnsignedUnsyncedItems(items
      .filter(item => !Item.signed(item) && !item.synced)
      .sort(byDate)
    );

    await Datastore.clearSyncedItems();
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
    await Datastore.removeItems(unsignedUnsyncedItems);
    await loadData();
  };

  const openItem = (item: Item) => {
    if (item.type == 'Catch') { 
      navigation.navigate('DataEntry', { 
        screen: 'Fisheries', 
        params: { itemId: item.id }
      });
    }
    if (item.type == 'Trash') {
      navigation.navigate('DataEntry', { 
        screen: 'BeachClean', 
        params: { itemId: item.id } 
      });
    }
  };

  return (
    <ScrollContainer>
      <Heading title='Local data' actionTitle='Upload' actionOnPress={upload} />
      {
        signedUnsyncedItems.length === 0 &&
        <Text style={tailwind('m-2')}>
          You have no data waiting to be uploaded.
        </Text>
      }
      {
        signedUnsyncedItems.length > 0 &&
        <View>
          <Text style={tailwind('mx-4 my-2')}>The following data has not yet been uploaded. (Click on the logo to open it.)</Text>
          
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
        setConfirmDeleteUnsignedItemsVisible(true);
        return Promise.resolve();
      }} />
      {
        unsignedUnsyncedItems.length === 0 &&
        <Text style={tailwind('m-2')}>
          You have no unsigned data.
        </Text>
      }
      {
        unsignedUnsyncedItems.length > 0 &&
        <View>
          <Text style={tailwind('mx-4 my-2')}>The following entries are unsigned and will not be uploaded unless you sign them. (Click on the logo to open it.)</Text>

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
          <ConfirmPrompt visible={confirmDeleteUnsignedItemsVisible}
            actionPhrase='delete all unsigned data'
            actionExplanation='This will delete all data you collected but did not sign.'
            actionButtonText='Delete all'
            action={deleteUnsigned}
            hide={() => setConfirmDeleteUnsignedItemsVisible(false)}
          />
        </View>
      }
    </ScrollContainer>
  );
}

export default Upload;
