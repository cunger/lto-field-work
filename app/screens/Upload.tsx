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
  
  const [unsyncedItems, setUnsyncedItems] = useState<Item[]>([]);
  const [unsignedItems, setUnsignedItems] = useState<Item[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);

  async function loadData() {
    GlobalContext.load();
    const items = await Datastore.items();
    setUnsyncedItems(items.filter(item => Item.signed(item) && !item.synced));
    setUnsignedItems(items.filter(item => !Item.signed(item)));
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

  // TODO extra inspect screens?
  const openItem = (item: Item) => {
    // if (item.type == 'Catch') { 
    //   navigation.navigate('Data Entry', { 
    //     screen: 'Fisheries', 
    //     params: {
    //       item,
    //       date: item.date,
    //       location: item.location,
    //       // TODO photos
    //     }
    //   });
    // }
    // if (item.type == 'Trash') { 
    //   navigation.navigate('Data Entry', { 
    //     screen: 'BeachClean', 
    //     params: {
    //       items: [item],
    //       date: item.date,
    //       location: item.location,
    //       additionalNotes: item.additionalNotes
    //     } 
    //   });
    // }
  };

  // TODO Bundle beachclean items per date, location and note?
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
          
          {unsyncedItems.map((item, index) => (
            <ListItem key={index}>
              <View style={tailwind('flex flex-row items-center')}>
                <TouchableOpacity onPress={() => openItem(item)} style={tailwind('w-10 px-2 py-2 border border-gray-300 rounded-md bg-white')}>
                  <Text>{Item.logoFor(item)}</Text>
                </TouchableOpacity>
                <Text> {Item.prettyPrint(item)}</Text>
                <Text style={tailwind('text-gray-900')}> {Item.printDetails(item)}</Text>
              </View>
            </ListItem>          
          ))}

          <Text style={tailwind('mx-4 my-2')}>The following entries are unsigned (and will not be uploaded):</Text>

          {unsignedItems.map((item, index) => (
            <ListItem key={index}>
              <View style={tailwind('flex flex-row items-center')}>
                <TouchableOpacity onPress={() => openItem(item)} style={tailwind('w-10 px-2 py-2 border border-gray-300 rounded-md bg-white')}>
                  <Text>{Item.logoFor(item)}</Text>
                </TouchableOpacity>
                <Text> {Item.prettyPrint(item)}</Text>
                <Text style={tailwind('text-gray-900')}> {Item.printDetails(item)}</Text>
              </View>
            </ListItem>          
          ))}
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
