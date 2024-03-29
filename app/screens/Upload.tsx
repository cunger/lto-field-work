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
import * as Progress from 'react-native-progress';

function Upload({ navigation }) {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;
  
  const [signedUnsyncedItems, setSignedUnsyncedItems] = useState<Item[]>([]);
  const [unsignedUnsyncedItems, setUnsignedUnsyncedItems] = useState<Item[]>([]);
  const [confirmDeleteUnsignedItemsVisible, setConfirmDeleteUnsignedItemsVisible] = useState(false);
  const [uploadIsInProgress, setUploadIsInProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');

  const increaseUploadProgress = (n: number) => {
    setUploadProgress(uploadProgress + n);
  };

  async function loadData() {
    GlobalContext.load();

    const byDate = (i1: Item, i2: Item) => (i2.date || 0) - (i1.date || 0);
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
    setUploadIsInProgress(true);
    await Datastore.syncAll(increaseUploadProgress, setUploadStatusText);
    setUploadIsInProgress(false);
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
      <Heading title={i18n.t('UPLOAD_H_LOCAL_DATA')} actionTitle={i18n.t('BUTTON_UPLOAD')} actionOnPress={upload} />
      {
        uploadIsInProgress && 
        <View style={tailwind('mx-4 my-2')}>
          <Text style={tailwind('text-blue my-1')}>
            { i18n.t('UPLOAD_IN_PROGRESS') }
          </Text>
          <Progress.Bar progress={uploadProgress} width={null} color={"rgba(110, 193, 228, 1)"} borderColor={"rgba(110, 193, 228, 1)"} />
          <Text style={tailwind('text-gray-300 my-1')}>
            { uploadStatusText }
          </Text>
        </View>
      }
      {
        signedUnsyncedItems.length === 0 &&
        <Text style={tailwind('mx-4 my-2')}>
          {i18n.t('UPLOAD_NO_SIGNED_DATA')}
        </Text>
      }
      {
        signedUnsyncedItems.length > 0 &&
        <View>
          <Text style={tailwind('mx-4 my-2')}>{i18n.t('UPLOAD_TODO_SIGNED')}</Text>
          
          {signedUnsyncedItems.map((item, index) => (
            <ListItem key={index}>
              <View style={tailwind('flex flex-row items-center')}>
                <TouchableOpacity onPress={() => openItem(item)} disabled={uploadIsInProgress} style={tailwind('w-10 px-2 py-2 border border-gray-300 rounded-md bg-white')}>
                  <Text>{Item.logoFor(item)}</Text>
                </TouchableOpacity>
                <Text> {Item.prettyPrint(item, i18n)}</Text>
                <Text style={tailwind('text-gray-500')}> {Item.printDetails(item, i18n)}</Text>
              </View>
            </ListItem>          
          ))}
        </View>
      }
      <Heading title={i18n.t('UPLOAD_H_UNSIGNED_DATA')} actionTitle={`🔥 ${i18n.t('BUTTON_DELETE')}`} actionOnPress={() => {
        setConfirmDeleteUnsignedItemsVisible(true);
        return Promise.resolve();
      }} />
      {
        unsignedUnsyncedItems.length === 0 &&
        <Text style={tailwind('m-2')}>
          {i18n.t('UPLOAD_NO_UNSIGNED_DATA')}
        </Text>
      }
      {
        unsignedUnsyncedItems.length > 0 &&
        <View>
          <Text style={tailwind('mx-4 my-2')}>{i18n.t('UPLOAD_TODO_UNSIGNED')}</Text>

          {unsignedUnsyncedItems.map((item, index) => (
            <ListItem key={index}>
              <View style={tailwind('flex flex-row items-center')}>
                <TouchableOpacity onPress={() => openItem(item)} style={tailwind('w-10 px-2 py-2 border border-gray-300 rounded-md bg-white')}>
                  <Text>{Item.logoFor(item)}</Text>
                </TouchableOpacity>
                <Text> {Item.prettyPrint(item, i18n)}</Text>
                <Text style={tailwind('text-gray-500')}> {Item.printDetails(item, i18n)}</Text>
              </View>
            </ListItem>          
          ))}
          <ConfirmPrompt visible={confirmDeleteUnsignedItemsVisible}
            actionPhrase={i18n.t('UPLOAD_DELETE_ALL_UNSIGNED')}
            actionExplanation={i18n.t('UPLOAD_DELETE_ALL_UNSIGNED_EXPLANATION')}
            actionButtonText={i18n.t('UPLOAD_DELETE_ALL')}
            action={deleteUnsigned}
            hide={() => setConfirmDeleteUnsignedItemsVisible(false)}
          />
        </View>
      }
    </ScrollContainer>
  );
}

export default Upload;
