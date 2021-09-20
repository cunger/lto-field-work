import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import InputSpinner from 'react-native-input-spinner';
import Modal from 'react-native-modal';
import Styles from '../styles/shared';
import Catch from '../model/fisheries/Catch';
import Location from '../model/fisheries/Location';
import Species from '../model/fisheries/Species';
import Signature from '../model/Signature';
import Datastore from '../components/data/LocalDatastore';

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
    console.log(`Saving data: ${item}`);
    Datastore.save(item);
    reset();
    setSignatureVisible(false);
  };

  const discard = () => {
    reset();
    navigation.navigate('Start');
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.formLabel}>Date</Text>
      <DateTimePicker
        value={item.date}
        onChange={(_, value) => { update({ date: value }); }}
        mode='date'
        is24Hour={true}
        display='default'
      />

      <Text style={Styles.formLabel}>Location</Text>
      <Picker
        selectedValue={item.location}
        onValueChange={(value, _) => { update({ location: value }); }}>
        {Object.keys(Location).map(key => (
          <Picker.Item key={key} label={Location[key]} value={key} />
        ))}
      </Picker>

      <Text style={Styles.formLabel}>Quantity</Text>
      <InputSpinner
      	max={20}
      	min={1}
      	step={1}
      	value={item.quantity}
      	onChange={(value) => { update({ quantity: value }); }}
        height={30}
        rounded={false}
      />

      <Text style={Styles.formLabel}>Species</Text>
      <Picker
        selectedValue={item.species}
        onValueChange={(value, _) => { update({ species: value }); }}>
        {Object.keys(Species).map(key => (
          <Picker.Item key={key} label={Species[key]} value={key} />
        ))}
      </Picker>

      <Text style={Styles.formLabel}>Estimated size: {item.size} cm</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={item.size}
        onValueChange={(value) => { update({ size: value }); }}
      />

      <Text style={Styles.formLabel}>Picture</Text>
      <Text>Coming soon!</Text>

      <Button
        onPress={sign}
        title='Save'
        color="#ccc"
      />
      <Button
        onPress={discard}
        title='Discard'
        color="#ccc"
      />

      <Modal
        isVisible={signatureVisible}
        animationOut={'slideOutUp'}
        animationOutTiming={1000}>
        <View>
          <Text>Sign please!</Text>
          <Button title='Sign' onPress={save} />
        </View>
      </Modal>
    </View>
  );
}

export default Fisheries;
