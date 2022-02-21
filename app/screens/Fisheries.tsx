import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import InputSpinner from 'react-native-input-spinner'; // https://github.com/marcocesarato/react-native-input-spinner
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
import TextField from '../components/forms/TextField';
import SelectField from '../components/forms/SelectField';
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

  // Species-specific fields get visible only once you select that species.
  const [hideForkLength, setHideForkLength] = useState(true);
  const [hideTailLength, setHideTailLength] = useState(true);
  const [hideHeadLength, setHideHeadLength] = useState(true);
  const [hideHeadWidth, setHideHeadWidth] = useState(true);
  const [hidePrecaudalLength, setHidePrecaudalLength] = useState(true);
  const [hideCarapaceLength, setHideCarapaceLength] = useState(true);
  const [hideCarapaceWidth, setHideCarapaceWidth] = useState(true);
  const [hideWingspan, setHideWingspan] = useState(true);
  const hideAllSpeciesSpecificFields = () => {
    setHideForkLength(true);
    setHideTailLength(true);
    setHideHeadLength(true);
    setHideHeadWidth(true);
    setHidePrecaudalLength(true);
    setHideCarapaceWidth(true);
    setHideCarapaceLength(true);
    setHideWingspan(true);
  };

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
          <SelectField
            label='Which method?'
            value={item.method}
            type={Method}
            updateAction={(value) => update({ method: value })}
          />
          <SelectField
            label='From where?'
            value={item.base}
            type={Base}
            updateAction={(value) => update({ base: value })}
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
          <SelectField
            label='Which sex?'
            value={item.sex}
            type={Sex}
            updateAction={(value) => update({ sex: value })}
          />
          <SelectField
            label='Which species?'
            value={item.species}
            type={Species}
            updateAction={(value) => {
              update({ species: value });
              hideAllSpeciesSpecificFields();
              if (value == 'TeleostFish') {
                setHideHeadLength(false);
                setHideHeadWidth(false);
              } else
              if (value == 'GameFish') {
                setHideHeadLength(false);
                setHideHeadWidth(false);
                setHideForkLength(false);
                setHidePrecaudalLength(false);
              } else
              if (value == 'Shark') {
                setHideForkLength(false);
                setHidePrecaudalLength(false);
              } else
              if (value == 'Ray') {
                setHidePrecaudalLength(false);
                setHideWingspan(false);
              } else
              if (value == 'Cephalopod') {
                setHideHeadLength(false);
              } else
              if (value == 'Crustacean') {
                setHideCarapaceLength(false);
                setHideCarapaceWidth(false);
                setHideTailLength(false);
              }
            }}
          />
        </View>

        <TextField
          label='Common name'
          updateKey='common_name'
          value={item.common_name}
        />
        <TextField
          label='Total length (cm)'
          updateKey='length'
          value={item.length}
        />
        <TextField
          label='Head length (cm)'
          updateKey='head_length'
          value={item.head_length}
          hide={hideHeadLength}
        />
        <TextField
          label='Head width (cm)'
          updateKey='head_width'
          value={item.head_width}
          hide={hideHeadWidth}
        />
        <TextField
          label='Fork length (cm)'
          updateKey='fork_length'
          value={item.fork_length}
          hide={hideForkLength}
        />
        <TextField
          label='Precaudal length (cm)'
          updateKey='precaudal_length'
          value={item.precaudal_length}
          hide={hidePrecaudalLength}
        />
        <TextField
          label='Carapace length (cm)'
          updateKey='carapace_length'
          value={item.carapace_length}
          hide={hideCarapaceLength}
        />
        <TextField
          label="Carapace width (cm) if it's a crab"
          updateKey='carapace_width'
          value={item.carapace_width}
          hide={hideCarapaceWidth}
        />
        <TextField
          label='Tail length (cm)'
          updateKey='tail_length'
          value={item.tail_length}
          hide={hideTailLength}
        />
        <TextField
          label='Wingspan (cm)'
          updateKey='wingspan'
          value={item.wingspan}
          hide={hideWingspan}
        />
        <TextField
          label='Weight (g)'
          updateKey='weight'
          value={item.weight}
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
