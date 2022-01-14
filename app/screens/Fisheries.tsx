import React, { useState } from 'react';
import { ScrollView, View, Text, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import InputSpinner from 'react-native-input-spinner'; // https://github.com/marcocesarato/react-native-input-spinner
import RNPickerSelect from 'react-native-picker-select'; // https://github.com/lawnstarter/react-native-picker-select
import Catch from 'model/fisheries/Catch';
import Species from 'model/fisheries/Species';
import Location from 'model/Location';
import Signature from 'model/Signature';
import ScrollContainer from 'components/ScrollContainer';
import Datastore from 'components/data/LocalDatastore';
import Coordinates from 'components/forms/Coordinates';
import { InputLabel, InputField } from 'components/forms/Input';
import SubmitButtons from 'components/forms/SubmitButtons';
import Signing from 'components/forms/Signing';
import ConfirmPrompt from 'components/ConfirmPrompt';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'; // https://github.com/react-native-image-picker/react-native-image-picker
import { tailwind } from 'tailwind';
import styles from '../styles/select';

function Fisheries({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(Location.Guinjata);
  const [item, setItem] = useState(Catch());
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const update = (fields) => {
    setItem({ ...item, ...fields });
  };

  const takePhoto = async () => {
    try {
      const photo = await launchCamera({ mediaType: 'photo' });
      if (photo) {
        console.log(photo);
        update({ picture: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri });
        // or base64?
      }
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
    }
  };

  const choosePhoto = async () => {
    try {
      const photo = await launchImageLibrary({ mediaType: 'photo' });
      if (photo) {
        console.log(photo);
        update({ picture: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri });
        // or base64?
      }
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
    }
  };

  const reset = () => {
    setItem(Catch());
  };

  const openSigning = () => {
    setSignatureVisible(true);
  };

  const closeSigning = () => {
    reset();
    setSignatureVisible(false);
  };

  const discard = () => {
    reset();
    navigation.navigate('Data Entry', { screen: 'Data entry' });
  };

  return (
    <ScrollContainer>
      <Coordinates
        setDateOnParent={setDate}
        setLocationOnParent={setLocation}
      />

      <View>
        <InputLabel text='Catch' />
        <View style={tailwind('flex flex-row items-stretch')}>
          <InputSpinner
            min={1}
            step={1}
            value={item.quantity}
            onChange={(value) => { update({ quantity: value }); }}
            height={26}
            width={100}
            rounded={false}
            style={tailwind('mr-4')}
          />
          <RNPickerSelect
            value={item.species}
            placeholder={{ label: 'Which species?', value: undefined }}
            onValueChange={(value, _) => update({ species: value })}
            items={Object.keys(Species).map(key => {
              return { label: Species[key], value: key };
            })}
            style={{
              inputAndroid: styles.input,
              inputAndroidContainer: styles.inputContainer,
              inputIOS: styles.input,
              inputIOSContainer: styles.inputContainer
            }}
          />
        </View>
      </View>

      <View>
        <InputLabel text={`Estimated size: ${item.size} cm`} />
        <Slider
          style={{ padding: 20, height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={item.size}
          onValueChange={(value) => { update({ size: value }); }}
        />
      </View>

      <View>
        <InputLabel text='Picture' />
        <InputField
          text='Take photo with camera'
          textColor={'#cccccc'}
          action={takePhoto} />
        <InputField
          text='Pick photo from gallery'
          textColor={'#cccccc'}
          action={choosePhoto} />
      </View>

      <SubmitButtons saveAction={openSigning} discardAction={() => setConfirmVisible(true)} />
      <Signing visible={signatureVisible} items={[item]} closeAction={closeSigning} />
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase='discard this data entry'
        actionButtonText='Discard'
        action={discard}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default Fisheries;
