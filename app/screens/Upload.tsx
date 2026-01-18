import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Heading from '../components/Heading';
import ListItem from '../components/ListItem';
import ConfirmPrompt from '../components/ConfirmPrompt';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import BeachCleanSession from '../model/beachclean/BeachCleanSession';
import FisheriesSession from '../model/fisheries/FisheriesSession';

function Upload({ navigation }) {
  const i18n = GlobalContext.i18n;
  
  const [signedUnsyncedSessions, setSignedUnsyncedSessions] = useState<(BeachCleanSession | FisheriesSession)[]>([]);
  const [unsignedUnsyncedSessions, setUnsignedUnsyncedSessions] = useState<(BeachCleanSession | FisheriesSession)[]>([]);
  const [confirmDeleteUnsignedItemsVisible, setConfirmDeleteUnsignedItemsVisible] = useState(false);
  const [uploadIsInProgress, setUploadIsInProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');

  const increaseUploadProgress = (n: number) => {
    setUploadProgress(uploadProgress + n);
  };

  async function loadData() {
    GlobalContext.load();

    try {
      const byDate = (s1: BeachCleanSession | FisheriesSession, s2: BeachCleanSession | FisheriesSession) => (s2.startDate || 0) - (s1.startDate || 0);
      const sessions = await Datastore.sessions();
      console.log(sessions);

      setSignedUnsyncedSessions(sessions
        .filter(session => session.signed() && !session.synced)
        .sort(byDate)
      );
      
      setUnsignedUnsyncedSessions(sessions
        .filter(session => !session.signed() && !session.synced)
        .sort(byDate)
      );
    } catch (error) {
      console.log(error);
    }
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
    await Datastore.clearSyncedItems();
    setUploadIsInProgress(false);

    await loadData();
  };

  const deleteUnsigned = async () => {
    await Datastore.removeSessions(unsignedUnsyncedSessions);

    await loadData();
  };

  const openSession = (session: BeachCleanSession | FisheriesSession) => {
    if (session instanceof FisheriesSession) { 
      navigation.navigate('DataEntry', { 
        screen: 'Fisheries', 
        params: { sessionId: session.id }
      });
    }
    if (session instanceof BeachCleanSession) {
      navigation.navigate('DataEntry', { 
        screen: 'BeachClean', 
        params: { sessionId: session.id } 
      });
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="p-4">
        <Heading title={i18n.t('UPLOAD_H_LOCAL_DATA')} actionTitle={i18n.t('BUTTON_UPLOAD')} actionOnPress={upload} />
        {
          uploadIsInProgress && 
          <View className="mx-4 my-2">
            <Text className="text-blue my-1">
              { i18n.t('UPLOAD_IN_PROGRESS') }
            </Text>
            <Progress.Bar progress={uploadProgress} width={null} color={"rgba(110, 193, 228, 1)"} borderColor={"rgba(110, 193, 228, 1)"} />
            <Text className="text-gray-300 my-1">
              { uploadStatusText }
            </Text>
          </View>
        }
        {
          signedUnsyncedSessions.length === 0 &&
          <Text className="mx-4 my-2">
            {i18n.t('UPLOAD_NO_SIGNED_DATA')}
          </Text>
        }
        {
          signedUnsyncedSessions.length > 0 &&
          <View>
            <Text className="mx-4 my-2">{i18n.t('UPLOAD_TODO_SIGNED')}</Text>
            
            {signedUnsyncedSessions.map((session, index) => (
              <ListItem key={index}>
                <View className="flex flex-row items-center">
                  <TouchableOpacity onPress={() => openSession(session)} disabled={uploadIsInProgress} className="w-10 px-2 py-2 border border-gray-300 rounded-md bg-white">
                    <Text>{session.logo()}</Text>
                  </TouchableOpacity>
                  <Text> {session.printCoordinates(i18n)}</Text>
                  <Text className="text-gray-500"> {session.printDetails(i18n)}</Text>
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
          unsignedUnsyncedSessions.length === 0 &&
          <Text className="m-2">
            {i18n.t('UPLOAD_NO_UNSIGNED_DATA')}
          </Text>
        }
        {
          unsignedUnsyncedSessions.length > 0 &&
          <View>
            <Text className="mx-4 my-2">{i18n.t('UPLOAD_TODO_UNSIGNED')}</Text>

            {unsignedUnsyncedSessions.map((session, index) => (
              <ListItem key={index}>
                <View className="flex flex-row items-center">
                  <TouchableOpacity onPress={() => openSession(session)} className="w-10 px-2 py-2 border border-gray-300 rounded-md bg-white">
                    <Text>{session.logo()}</Text>
                  </TouchableOpacity>
                  <Text> {session.printCoordinates(i18n)}</Text>
                  <Text className="text-gray-500"> {session.printDetails(i18n)}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

export default Upload;
