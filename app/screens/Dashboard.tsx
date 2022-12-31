import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from 'react-native';
import ScrollContainer from '../components/ScrollContainer';
import Heading from '../components/Heading';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import { useTailwind } from 'tailwind-rn';
import ListItem from '../components/ListItem';
import { print } from '../components/utils/PrettyPrinter';
import Category from '../model/beachclean/Category';

function Dashboard() {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [lastActiveLocation, setLastActiveLocation] = useState(null);
  const [statistics, setStatistics] = useState({});

  async function loadData() {
    GlobalContext.load();
    Datastore.lastActiveDate().then(date => setLastActiveDate(date));
    Datastore.lastActiveLocation().then(location => setLastActiveLocation(location));
    Datastore.statistics().then(statistics => setStatistics(statistics));
  }

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  return (
    <ScrollContainer>
      { 
        lastActiveDate && lastActiveLocation &&
        <View>
          <Text style={tailwind('my-2')}>
            👋 { i18n.t('DASHBOARD_WELCOME_BACK') }
          </Text>

          {
            GlobalContext.unsyncedItems > 0 && 
            <Text style={tailwind('m-2 text-blue')}>
              { GlobalContext.unsyncedItems > 1 
              ? i18n.t('DASHBOARD_DONT_FORGET_UPLOAD_SG') 
              : i18n.t('DASHBOARD_DONT_FORGET_UPLOAD_PL').replace('$COUNT', `${GlobalContext.unsyncedItems}`) }
            </Text>
          }

          <Heading title={ i18n.t('DASHBOARD_H_LAST_ACTIVITY') } actionTitle='' actionOnPress={() => {}} />
          <Text style={tailwind('m-2')}>
            🗓️ {lastActiveDate}
          </Text>
          <Text style={tailwind('m-2')}>
            📍 {lastActiveLocation || 'somewhere'}
          </Text>

          <Heading title={ i18n.t('DASHBOARD_H_SUMMARY') } actionTitle='' actionOnPress={() => {}} />
          <Text style={tailwind('m-2')}>🎣 Catches:</Text>
          {Object.entries(statistics.Catch || {})
            .filter((entry, index) => entry[1] > 0)
            .map((entry, index) => (
              <ListItem key={index}><Text>{` ️ ${print(entry[1], entry[0])}`}</Text></ListItem>
            ))
          }
          <Text style={tailwind('m-2')}>🗑️ Trash:</Text>
          {Object.entries(statistics.Trash || {}).map((entry, index) => (
            <ListItem key={index}><Text>{` ️ ${print(entry[1], Category[entry[0]])}`}</Text></ListItem>
          ))}
        </View>
      }
      { 
        !(lastActiveDate && lastActiveLocation) &&
        <View>
          <Text style={tailwind('my-10')}>
            👋 {i18n.t('DASHBOARD_WELCOME')}
          </Text>
          <Text style={tailwind('m-2')}>
            {i18n.t('DASHBOARD_ONBOARDING_GREAT')}
          </Text>
          <Text style={tailwind('m-2')}>
            {i18n.t('DASHBOARD_ONBOARDING_GET_STARTED')}
          </Text>
          <Text style={tailwind('m-2')}>
            {i18n.t('DASHBOARD_ONBOARDING_STEP1').replace('$SETTINGS', `<Text style={tailwind('text-blue')}>{i18n.t('MENU_SETTINGS')}</Text>`)}
          </Text>
          <Text style={tailwind('m-2')}>
            {i18n.t('DASHBOARD_ONBOARDING_STEP1').replace('$DATA_ENTRY', `<Text style={tailwind('text-blue')}>{i18n.t('MENU_DATA_ENTRY')}</Text>`)}
          </Text>
          <Text style={tailwind('m-2')}>
            {i18n.t('DASHBOARD_ONBOARDING_STEP1').replace('$UPLOAD', `<Text style={tailwind('text-blue')}>{i18n.t('MENU_UPLOAD')}</Text>`)}
          </Text>
          <Text style={tailwind('m-2')}>
            🎉 {i18n.t('DASHBOARD_ONBOARDING_THANKS')}
          </Text>
        </View>
      }
    </ScrollContainer>
  );
}

export default Dashboard;
