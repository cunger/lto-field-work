import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from 'react-native';
import ScrollContainer from '../components/ScrollContainer';
import Heading from '../components/Heading';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../components/context/GlobalContext';
import { useTailwind } from 'tailwind-rn';
import ListItem from '../components/ListItem';
import { print } from '../components/utils/PrettyPrinter';
import Category from '../model/beachclean/Category';

function Dashboard() {
  const tailwind = useTailwind();

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
            👋 Welcome back, ocean hero!
          </Text>

          {
            GlobalContext.unsyncedItems > 0 && 
            <Text style={tailwind('m-2 text-blue')}>
              Don't forget! You have {GlobalContext.unsyncedItems} data item{GlobalContext.unsyncedItems > 1 ? 's ' : ' '}
              that ha{GlobalContext.unsyncedItems > 1 ? 've' : 's'} not yet been uploaded.
            </Text>
          }

          <Heading title='Last activity' actionTitle='' actionOnPress={() => {}} />
          <Text style={tailwind('m-2')}>
            🗓️ {lastActiveDate}
          </Text>
          <Text style={tailwind('m-2')}>
            📍 {lastActiveLocation || 'somewhere'}
          </Text>

          <Heading title='Summary of collected data' actionTitle='' actionOnPress={() => {}} />
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
            👋 Welcome, ocean hero!
          </Text>
          <Text style={tailwind('m-2')}>
            Great to have you onboard.
          </Text>
          <Text style={tailwind('m-2')}>
            Here are your first steps to get started:
          </Text>
          <Text style={tailwind('m-2')}>
            1. Go to <Text style={tailwind('text-blue')}>Settings</Text> and set up your user information. 
            (This is important so we know who collected the data we receive.)
          </Text>
          <Text style={tailwind('m-2')}>
            2. Click on <Text style={tailwind('text-blue')}>Data Entry</Text> and start collecting data. 
            (You don't need an internet connection. The data is stored locally on your phone.)
          </Text>
          <Text style={tailwind('m-2')}>
            3. When you have an internet connection, come back and go to <Text style={tailwind('text-blue')}>Upload</Text>. 
            Then click on the Upload button to send your collected data to us.
          </Text>
          <Text style={tailwind('m-2')}>
            🎉 Thanks!
          </Text>
        </View>
      }
    </ScrollContainer>
  );
}

export default Dashboard;
