import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import Heading from '../components/Heading';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import ListItem from '../components/ListItem';
import { print, printDateLong } from '../components/utils/PrettyPrinter';
import Category from '../model/beachclean/Category';
import Species from '../model/fisheries/Species';
import { SafeAreaView } from 'react-native-safe-area-context';

function Dashboard() {
  const i18n = GlobalContext.i18n;

  const [lastActiveDate, setLastActiveDate] = useState('-');
  const [lastActiveLocation, setLastActiveLocation] = useState('-');
  const [statistics, setStatistics] = useState({});

  async function loadData() {
    GlobalContext.load();
    
    const date = await Datastore.lastActiveDate();
    if (date) {
      console.log(date);
      setLastActiveDate(printDateLong(date, i18n));
    }
    
    const location = await Datastore.lastActiveLocation();
    if (location) {
      console.log(typeof location);
      setLastActiveLocation(i18n.t(location));
    }

    Datastore.statistics().then(statistics => setStatistics(statistics));
  }

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-4">
        { 
          lastActiveDate && lastActiveLocation &&
          <View>
            <Text className="my-2">
              👋 { i18n.t('DASHBOARD_WELCOME_BACK') }
            </Text>

            {
              GlobalContext.unsyncedItems > 0 && 
              <Text className="m-2 text-blue">
                { GlobalContext.unsyncedItems == 1 
                ? i18n.t('DASHBOARD_DONT_FORGET_UPLOAD_SG') 
                : i18n.t('DASHBOARD_DONT_FORGET_UPLOAD_PL').replace('$COUNT', `${GlobalContext.unsyncedItems}`) }
              </Text>
            }

            <Heading title={ i18n.t('DASHBOARD_H_LAST_ACTIVITY') } actionTitle='' actionOnPress={() => {}} />
            <Text className="m-2">
              🗓️ {lastActiveDate}
            </Text>
            <Text className="m-2">
              📍 {lastActiveLocation}
            </Text>

            <Heading title={ i18n.t('DASHBOARD_H_SUMMARY') } actionTitle='' actionOnPress={() => {}} />
            <Text className="m-2">🎣 {i18n.t('DASHBOARD_CATCHES')}:</Text>
            {Object.entries(statistics.Catch || {})
              .filter((entry) => entry[1] > 0)
              .map((entry, index) => (
                <ListItem key={index}><Text>{` ️ ${print(entry[1], Species[entry[0]] || entry[0], i18n)}`}</Text></ListItem>
              ))
            }
            <Text className="m-2">🗑️ {i18n.t('DASHBOARD_TRASH')}:</Text>
            {Object.entries(statistics.Trash || {})
              .map((entry, index) => (
                <ListItem key={index}><Text>{` ️ ${print(entry[1], Category[entry[0]] || entry[0], i18n)}`}</Text></ListItem>
              ))
            }
          </View>
        }
        { 
          !(lastActiveDate && lastActiveLocation) &&
          <View>
            <Text className="my-10">
              👋 {i18n.t('DASHBOARD_WELCOME')}
            </Text>
            <Text className="m-2">
              {i18n.t('DASHBOARD_ONBOARDING_GREAT')}
            </Text>
            <Text className="m-2">
              {i18n.t('DASHBOARD_ONBOARDING_GET_STARTED')}
            </Text>
            <Text className="m-2">
              {i18n.t('DASHBOARD_ONBOARDING_STEP1').replace('$SETTINGS', `<Text className="text-blue">{i18n.t('MENU_SETTINGS')}</Text>`)}
            </Text>
            <Text className="m-2">
              {i18n.t('DASHBOARD_ONBOARDING_STEP2').replace('$DATA_ENTRY', `<Text className="text-blue">{i18n.t('MENU_DATA_ENTRY')}</Text>`)}
            </Text>
            <Text className="m-2">
              {i18n.t('DASHBOARD_ONBOARDING_STEP3').replace('$UPLOAD', `<Text className="text-blue">{i18n.t('MENU_UPLOAD')}</Text>`)}
            </Text>
            <Text className="m-2">
              🎉 {i18n.t('DASHBOARD_ONBOARDING_THANKS')}
            </Text>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

export default Dashboard;
