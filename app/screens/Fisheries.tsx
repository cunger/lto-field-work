import React, { useState } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import InputSpinner from 'react-native-input-spinner';
import Modal from 'react-native-modal';
import Catch from '../model/fisheries/Catch';
import Location from '../model/Location';
import Species from '../model/fisheries/Species';
import Signature from '../model/Signature';
import Datastore from '../components/data/LocalDatastore';
import { ActionButton, Theme } from '../components/ActionButton';
import formStyles from '../styles/formStyles';
import containerStyles from '../styles/containerStyles';

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
    <ScrollView style={containerStyles.content}>
      <View style={formStyles.field}>
        <Text style={formStyles.label}>Date</Text>
        <DateTimePicker
          value={item.date}
          onChange={(_, value) => { update({ date: value }); }}
          mode='date'
          is24Hour={true}
          display='default'
        />

        <Text style={formStyles.label}>Location</Text>
        <Picker
          selectedValue={item.location}
          onValueChange={(value, _) => { update({ location: value }); }}>
          {Object.keys(Location).map(key => (
            <Picker.Item key={key} label={Location[key]} value={key} />
          ))}
        </Picker>
      </View>

      <View style={formStyles.field}>
        <Text style={formStyles.label}>Quantity</Text>
        <InputSpinner
        	max={20}
        	min={1}
        	step={1}
        	value={item.quantity}
        	onChange={(value) => { update({ quantity: value }); }}
          height={30}
          rounded={false}
        />

        <Text style={formStyles.label}>Species</Text>
        <Picker
          selectedValue={item.species}
          onValueChange={(value, _) => { update({ species: value }); }}>
          {Object.keys(Species).map(key => (
            <Picker.Item key={key} label={Species[key]} value={key} />
          ))}
        </Picker>
      </View>

      <View style={formStyles.field}>
        <Text style={formStyles.label}>Estimated size: {item.size} cm</Text>
        <Slider
          style={{ padding: 20, height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={item.size}
          onValueChange={(value) => { update({ size: value }); }}
        />
      </View>

      <View style={formStyles.field}>
        <Text style={formStyles.label}>Picture</Text>
        <Text>Coming soon!</Text>
      </View>

      <ActionButton title='Save' onPress={sign} theme={Theme.Go} />
      <ActionButton title='Discard' onPress={discard} theme={Theme.Danger} />

      <Modal
        isVisible={signatureVisible}
        animationOut={'slideOutUp'}
        animationOutTiming={1000}>
        <View>
          <Text>Sign please!</Text>
          <Button title='Sign' onPress={save} />
        </View>
      </Modal>
    </ScrollView>
  );
}

export default Fisheries;
