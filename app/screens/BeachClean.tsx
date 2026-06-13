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
import Trash from '../model/beachclean/Trash';
import Catch from '../model/fisheries/Catch';

type Line = {
  quantity: number,
  category: string,
  key: string,
};

function BeachClean({ navigation, route }) {
  const i18n = GlobalContext.i18n;

  const now = DateTime();
  const [session, setSession] = useState<BeachCleanSession>(new BeachCleanSession(uuid.v4()));
  const [startDate, setStartDate] = useState<DateTime>(now);
  const [endDate, setEndDate] = useState<DateTime | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [numberOfPeople, setNumberOfPeople] = useState<number | undefined>(undefined);
  const [totalWeightInKg, setTotalWeightInKg] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [signingVisible, setSigningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [coordinatesResetTrigger, setCoordinatesResetTrigger] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.sessionId) {
        load(route.params.sessionId);
      } else {
        setLines(buildAllLinesFrom([]));
      }
      return () => {};
    }, [route])
  );

  const load = (sessionId: string) => {
    reset();

    Datastore.session(sessionId).then(session => {
      if (!session) return;
      if (session.type !== 'BeachCleanSession') return;

      setSession(session as BeachCleanSession);

      const startDate = session.startDate ? DateTime(new Date(session.startDate)) : DateTime();
      const endDate = session.endDate ? DateTime(new Date(session.endDate)) : undefined;

      setStartDate(startDate);
      setEndDate(endDate);
      setLocation(session.location);
      setTotalWeightInKg(session.totalWeightInKg);
      setNumberOfPeople(session.numberOfPeople);
      setAdditionalNotes(session.additionalNotes);
      setLines(buildAllLinesFrom(session.items));
    });
  } 

  const buildAllLinesFrom = (items: Trash[] | Catch[]): Line[] => {
    const allLines: Line[] = [];
    for (const category of Object.keys(Category)) {
      let quantity = 0;
      for (const item of items) {
        if (item.type === 'Trash' && item.category == category) {
          quantity = item.quantity;
          break;
        }
      }
      allLines.push({ 
        category,
        quantity,
        key: `${quantity}-${category}`
      });
    }
    return allLines;
  };

  const buildItemsFrom = (lines: Line[], session: BeachCleanSession): Trash[] => {
    const items: Trash[] = [];
    for (const line of lines) {
      if (line.quantity > 0) {
        items.push(new Trash(session.id, line.category as Category, line.quantity));
      }
    }
    return items;
  };

  const updateItem = (quantity: number, category: string) => {
    for (const line of lines) {
      if (line.category == category) {
        line.quantity = quantity;
        break;
      }
    }
  };

  const reset = () => {
    setCoordinatesResetTrigger(coordinatesResetTrigger + 1);
    setNumberOfPeople(undefined);
    setTotalWeightInKg('');
    setAdditionalNotes('');
    setSession(new BeachCleanSession(uuid.v4()));
    setLines(buildAllLinesFrom([]));
  };

  const openSigning = () => {
    // Open modal to sign the session.
    setSigningVisible(true);
  };

  const closeSigning = () => {
    reset();
    setSigningVisible(false);
    // You probably finished the beach clean, so go to Upload screen.
    navigation.navigate('Upload');
  };

  const updateSession = () => {
    session.startDate = startDate.toEpoch();
    session.endDate = (endDate || DateTime()).toEpoch();
    session.location = location;
    session.additionalNotes = additionalNotes;
    session.totalWeightInKg = totalWeightInKg;
    session.numberOfPeople = numberOfPeople;
    session.items = buildItemsFrom(lines, session);
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
                type="int"
                min={0}
                step={1}
                value={line.quantity}
                onChange={(value: number) => { updateItem(value, line.category); }}
                prepend={(<Text className="w-1/2"> {i18n.t(Category[line.category])} </Text>)}
                height={30}
                rounded={false}
                selectTextOnFocus={true}
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
          saveAction={() => { updateSession(); openSigning(); }}
          discardAction={() => setConfirmVisible(true)}
          resetAction={() => reset()}
        />
        <Signing visible={signingVisible} setVisible={setSigningVisible} data={session} closeAction={closeSigning} />
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
