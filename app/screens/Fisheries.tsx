import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import FisheriesSession from '../model/fisheries/FisheriesSession';

type Line = {
  quantity: number,
  category: string,
  key: string,
};

function Fisheries({ navigation, route }) {
  const i18n = GlobalContext.i18n;

  const now = DateTime();
  const [session, setSession] = useState<FisheriesSession>(new FisheriesSession(uuid.v4()));
  const [startDate, setStartDate] = useState<DateTime>(now);
  const [endDate, setEndDate] = useState<DateTime | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [numberOfPeople, setNumberOfPeople] = useState<number | undefined>(undefined);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [signingVisible, setSigningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [coordinatesResetTrigger, setCoordinatesResetTrigger] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.sessionId) {
        load(route.params.sessionId);
      } else {
        reset();
      }
      return () => {};
    }, [route])
  );

  const load = (sessionId: string) => {
    reset();

    Datastore.session(sessionId).then(session => {
      if (!session) return;
      if (session.type !== 'FisheriesSession') return;

      setSession(session as FisheriesSession);

      const startDate = session.startDate ? DateTime(new Date(session.startDate)) : DateTime();
      const endDate = session.endDate ? DateTime(new Date(session.endDate)) : undefined;

      setStartDate(startDate);
      setEndDate(endDate);
      setLocation(session.location);
      setNumberOfPeople(session.numberOfPeople);
      setAdditionalNotes(session.additionalNotes);
    });
  } 

  const reset = () => {
    setCoordinatesResetTrigger(coordinatesResetTrigger + 1);
    setNumberOfPeople(undefined);
    setAdditionalNotes('');
    setSession(new FisheriesSession(uuid.v4()));
  };

  const openSigning = () => {
    // Open modal to sign the session.
    setSigningVisible(true);
  };

  const closeSigning = () => {
    reset();
    setSigningVisible(false);
    // You probably finished the session, so go to Upload screen.
    navigation.navigate('Upload');
  };

  const updateSession = () => {
    session.startDate = startDate.toEpoch();
    session.endDate = (endDate || DateTime()).toEpoch();
    session.location = location;
    session.additionalNotes = additionalNotes;
    session.numberOfPeople = numberOfPeople;
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
          <InputGroup text={i18n.t('SUMMARY')} />
          <TextField
            label={i18n.t('BEACHCLEAN_NUMBER_OF_PEOPLE')}
            value={numberOfPeople}
            updateAction={setNumberOfPeople}
            keyboardType='numeric'
          />
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

        <SubmitButtons 
          saveAction={() => { updateSession(); openSigning(); }}
          discardAction={() => setConfirmVisible(true)}
          resetAction={() => reset()}
        />
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

export default Fisheries;
