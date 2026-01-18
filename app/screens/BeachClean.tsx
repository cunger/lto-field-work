import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import Category from '../model/beachclean/Category';
import DateTime from '../model/DateTime';
import CoordinatesWithDuration from '../components/forms/CoordinatesWithDuration';
import TextField from '../components/forms/TextField';
import { InputGroup } from '../components/forms/Input';
import SubmitButtons from '../components/forms/SubmitButtons';
import Signing from '../components/forms/Signing';
import ConfirmPrompt from '../components/ConfirmPrompt';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/core';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import BeachCleanSession from '../model/beachclean/BeachCleanSession';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

function BeachClean({ navigation, route }) {
  const i18n = GlobalContext.i18n;

  const now = new DateTime();
  const [session, setSession] = useState<BeachCleanSession | null>(null);
  const [sessionId, setSessionId] = useState(uuid.v4());
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [items, setItems] = useState({});
  const [totalWeightInKg, setTotalWeightInKg] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [signingVisible, setSigningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [lines, setLines] = useState([]);
  const [coordinatesResetTrigger, setCoordinatesResetTrigger] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.sessionId) {
        load(route.params.sessionId);
      } else {
        setLines(buildAllLinesFrom(items));
      }
      return () => {};
    }, [route])
  );

  const load = (sessionId: string) => {
    Datastore.session(sessionId).then(session => {
      if (!session) return;

      const location = session.location
      const startDate = session.startDate ? new DateTime(new Date(session.startDate)) : new DateTime();
      const endDate = session.endDate ? new DateTime(new Date(session.endDate)) : null;
      const newItems = {};
      for (const item of session.items) {
        newItems[item.category] = item.quantity;
      }

      reset();
      setSessionId(session.id);
      setStartDate(startDate);
      setEndDate(endDate);
      setLocation(location);
      setTotalWeightInKg(session.totalWeightInKg);
      setNumberOfPeople(session.numberOfPeople);
      setAdditionalNotes(session.additionalNotes);
      setItems(newItems);
      setLines(buildAllLinesFrom(newItems));
      updateSession();
    });
  } 

  const buildAllLinesFrom = (items) => {
    const allLines = [];
    Object.keys(Category).forEach(category => {
      const quantity = items[category] || 0;
      allLines.push({ 
        category,
        quantity,
        key: `${quantity}-${category}`
      });
    });
    return allLines;
  };

  const updateItem = (quantity: number, category: Category) => {
    if (quantity == 0) {
      delete items[category];
    } else {
      items[category] = quantity;
    }
    setItems({ ...items });
    updateSession();
  };

  const reset = () => {
    setCoordinatesResetTrigger(coordinatesResetTrigger + 1);
    setTotalWeightInKg(null);
    setNumberOfPeople(null);
    setAdditionalNotes('');
    setSession(null);
    setItems({});
    setLines(buildAllLinesFrom({}));
  };

  const openSigning = () => {
    // If end date was not set manually, set it to now.
    if (endDate == null) {
      endDate = new DateTime();
    }
    // Open modal to sign the session.
    setSigningVisible(true);
  };

  const closeSigning = () => {
    try {
      reset();
    } catch (error) {
      console.log(error);
    }
    setSigningVisible(false);
    // You probably finished the beach clean, so go to upload screen.
    navigation.navigate('Upload');
  };

  const updateSession = () => {
    setSession(new BeachCleanSession(
      sessionId,
      startDate.toEpoch(),
      endDate?.toEpoch(),
      location,
      items,
      additionalNotes,
      totalWeightInKg,
      numberOfPeople
    ));
  };

  const discard = () => {
    reset();
    showMessage({
      message: i18n.t('DATA_WAS_DISCARDED'),
      type: 'warning',
      icon: 'info'
    });

    navigation.navigate('DataEntry', { screen: 'Select' });
  };

  return (
    <SafeAreaView className="flex-1 pl-4 pr-4">
      <ScrollView className="flex-1">
        <CoordinatesWithDuration
          key={`${startDate}-${endDate}-${location}`}
          inputStartDate={startDate}
          inputEndDate={endDate}
          inputLocation={location}
          setStartDateOnParent={setStartDate}
          setEndDateOnParent={setEndDate}
          setLocationOnParent={setLocation}
          resetTrigger={coordinatesResetTrigger}
        />

        <View>
          <InputGroup text={i18n.t('BEACHCLEAN_ITEMS')} />
          {lines.map(line => {
            return (
              <InputSpinner
                min={0}
                step={1}
                value={line.quantity}
                onChange={(value) => { updateItem(value, line.category); }}
                prepend={(<Text className="w-1/2"> {i18n.t(Category[line.category])} </Text>)}
                height={30}
                rounded={false}
                editable={true}
                key={line.key}
                className="mb-2 bg-white"
              />
            );
          })}
        </View>

        <View>
          <InputGroup text={i18n.t('ADDITIONAL_NOTES')} />
          <TextField
            numberOfLines={4}
            label={i18n.t('ADDITIONAL_NOTES_LABEL')}
            value={additionalNotes}
            updateAction={setAdditionalNotes}
          />
        </View>

        <View>
          <InputGroup text={i18n.t('SUMMARY')} />
          <TextField
            label={i18n.t('BEACHCLEAN_TOTAL_WEIGHT')}
            value={totalWeightInKg}
            updateAction={setTotalWeightInKg}
            keyboardType='numeric'
          />
          <TextField
            label={i18n.t('BEACHCLEAN_NUMBER_OF_PEOPLE')}
            value={numberOfPeople}
            updateAction={setNumberOfPeople}
            keyboardType='numeric'
          />
        </View>

        <SubmitButtons 
          saveAction={openSigning} discardAction={() => setConfirmVisible(true)} resetAction={() => reset()} />
        <Signing visible={signingVisible} setVisible={setSigningVisible} session={session} closeAction={closeSigning} />
        <ConfirmPrompt visible={confirmVisible}
          actionPhrase={i18n.t('CONFIRM_DISCARD')}
          actionButtonText={i18n.t('BUTTON_DISCARD')}
          action={discard}
          hide={() => setConfirmVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default BeachClean;
