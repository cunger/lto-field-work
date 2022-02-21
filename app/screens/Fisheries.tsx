import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputSpinner from 'react-native-input-spinner'; // https://github.com/marcocesarato/react-native-input-spinner
import RNPickerSelect from 'react-native-picker-select'; // https://github.com/lawnstarter/react-native-picker-select
import Catch from '../model/fisheries/Catch';
import Species from '../model/fisheries/Species';
import Sex from '../model/fisheries/Sex';
import Method from '../model/fisheries/Method';
import Base from '../model/fisheries/Base';
import Location from '../model/Location';
import Signature from '../model/Signature';
import ScrollContainer from '../components/ScrollContainer';
import Datastore from '../components/data/LocalDatastore';
import Coordinates from '../components/forms/Coordinates';
import { InputLabel, InputField, InputGroup } from '../components/forms/Input';
import SubmitButtons from '../components/forms/SubmitButtons';
import Signing from '../components/forms/Signing';
import ConfirmPrompt from '../components/ConfirmPrompt';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'; // https://github.com/react-native-image-picker/react-native-image-picker
import { useTailwind } from 'tailwind-rn';
import styles from '../styles/select';

function Fisheries({ navigation }) {
  const tailwind = useTailwind();
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(Location.Guinjata);
  const [item, setItem] = useState(Catch());
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const update = (fields) => {
    setItem({ ...item, ...fields });
  };

  const photoOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxWidth: 800,
    maxWidth: 800
  };

  const takePhoto = async () => {
    try {
      const result = await launchCamera(photoOptions);
      for (asset of result.assets) {
        update({ picture_filename: asset.fileName || asset.uri });
        update({ picture_data: asset.base64 });
      }
    } catch (e) {
      // TODO Monitoring!
      console.log(e);
    }
  };

  const choosePhoto = async () => {
    try {
      const result = await launchImageLibrary(photoOptions);
      for (asset of result.assets) {
        update({ picture_filename: asset.fileName || asset.uri });
        update({ picture_data: asset.base64 });
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
        <InputGroup text='Fishing method' />
        <View style={tailwind('flex flex-row items-stretch my-2')}>
          <RNPickerSelect
            value={item.method}
            placeholder={{ label: 'Which method?', value: undefined }}
            onValueChange={(value, _) => update({ method: value })}
            items={Object.keys(Method).map(key => {
              return { label: Method[key], value: key };
            })}
            style={{
              inputAndroid: styles.input,
              inputAndroidContainer: styles.inputContainer,
              inputIOS: styles.input,
              inputIOSContainer: styles.inputContainer
            }}
          />
          <Text> </Text>
          <RNPickerSelect
            value={item.base}
            placeholder={{ label: 'From where?', value: undefined }}
            onValueChange={(value, _) => update({ base: value })}
            items={Object.keys(Base).map(key => {
              return { label: Base[key], value: key };
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
        <InputGroup text='Catch' />
        <View style={tailwind('flex flex-row items-stretch my-2')}>
          <InputSpinner
            min={1}
            step={1}
            value={item.quantity}
            onChange={(value) => { update({ quantity: value }); }}
            height={26}
            width={80}
            rounded={false}
            style={tailwind('mr-4')}
          />
          <RNPickerSelect
            value={item.sex}
            placeholder={{ label: 'Which sex?', value: undefined }}
            onValueChange={(value, _) => update({ sex: value })}
            items={Object.keys(Sex).map(key => {
              return { label: Sex[key], value: key };
            })}
            style={{
              inputAndroid: styles.input,
              inputAndroidContainer: styles.inputContainer,
              inputIOS: styles.input,
              inputIOSContainer: styles.inputContainer
            }}
          />
          <Text> </Text>
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
        <InputLabel text='Common name' />
        <TextInput
          value={item.common_name}
          onChangeText={(value) => update({ common_name: value })}
          onEndEdition={(value) => update({ common_name: value })}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
        <InputLabel text='Total length (cm)' />
        <TextInput
          value={item.length}
          onChangeText={(value) => update({ length: value })}
          onEndEdition={(value) => update({ length: value })}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
        <InputLabel text='Weight (g)' />
        <TextInput
          value={item.weight}
          onChangeText={(value) => update({ weight: value })}
          onEndEdition={(value) => update({ weight: value })}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
      </View>

      <View>
        <InputGroup text='Picture' />
        <Text style={tailwind('my-2')}>
          { item.picture_filename || 'None selected yet.' }
        </Text>
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
