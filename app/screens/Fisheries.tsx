import React, { useState } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import InputSpinner from 'react-native-input-spinner';
import Modal from 'react-native-modal';
import Catch from 'model/fisheries/Catch';
import Location from 'model/Location';
import Species from 'model/fisheries/Species';
import Signature from 'model/Signature';
import Datastore from 'components/data/LocalDatastore';
import ScrollContainer from 'components/ScrollContainer';
import InputLabel from 'components/forms/InputLabel';
import SubmitButtons from 'components/forms/SubmitButtons';

function Fisheries({ navigation }) {
  const [item, setItem] = useState(Catch());
  const [signatureVisible, setSignatureVisible] = useState(false);

  const update = (fields) => {
    setItem({ ...item, ...fields });
  };

  const reset = () => {
    setItem(Catch());
  };

  const sign = () => {
    setSignatureVisible(true);
  };

  const save = () => {
    console.log(`Saving data: ${JSON.stringify(item)}`);
    Datastore.save(item);
    reset();
    setSignatureVisible(false);
  };

  const discard = () => {
    reset();
    navigation.navigate('Start');
  };

  return (
    <ScrollContainer>
      <View>
        <InputLabel>Date</InputLabel>
        <DateTimePicker
          value={item.date}
          onChange={(_, value) => { update({ date: value }); }}
          mode='date'
          is24Hour={true}
          display='default'
        />

        <InputLabel>Location</InputLabel>
        <Picker
          selectedValue={item.location}
          onValueChange={(value, _) => { update({ location: value }); }}>
          {Object.keys(Location).map(key => (
            <Picker.Item key={key} label={Location[key]} value={key} />
          ))}
        </Picker>
      </View>

      <View>
        <InputLabel>Quantity</InputLabel>
        <InputSpinner
        	max={20}
        	min={1}
        	step={1}
        	value={item.quantity}
        	onChange={(value) => { update({ quantity: value }); }}
          height={30}
          rounded={false}
        />

        <InputLabel>Species</InputLabel>
        <Picker
          selectedValue={item.species}
          onValueChange={(value, _) => { update({ species: value }); }}>
          {Object.keys(Species).map(key => (
            <Picker.Item key={key} label={Species[key]} value={key} />
          ))}
        </Picker>
      </View>

      <View>
        <InputLabel>Estimated size: {item.size} cm</InputLabel>
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
        <InputLabel>Picture</InputLabel>
        <Text>Coming soon!</Text>
      </View>

      <SubmitButtons saveAction={sign} discardAction={discard} />

      <Modal
        isVisible={signatureVisible}
        animationOut={'slideOutUp'}
        animationOutTiming={1000}>
        <View>
          <Text>Sign please!</Text>
          <Button title='Sign' onPress={save} />
        </View>
      </Modal>
    </ScrollContainer>
  );
}

export default Fisheries;
