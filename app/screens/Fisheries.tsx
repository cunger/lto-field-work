import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import InputSpinner from 'react-native-input-spinner';

import Catch from '../model/fisheries/Catch';
import Location from '../model/fisheries/Location';
import Species from '../model/fisheries/Species';

function Fisheries() {
  const [item, setItem] = useState(Catch());

  const update = (fields) => {
    setItem({ ...item, ...fields });
  };

  const save = () => {
    console.log('Saving data');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Date</Text>
      <DateTimePicker
        value={item.date}
        onChange={(_, value) => { update({ date: value }); }}
        mode='date'
        is24Hour={true}
        display='default'
      />

      <Text>Location</Text>
      <Picker
        selectedValue={item.location}
        onValueChange={(value, _) => { update({ location: value }); }}>
        {Object.keys(Location).map(key => (
          <Picker.Item key={key} label={Location[key]} value={key} />
        ))}
      </Picker>

      <Text>Quantity</Text>
      <InputSpinner
      	max={20}
      	min={1}
      	step={1}
      	value={item.quantity}
      	onChange={(value) => { update({ quantity: value }); }}
        height={30}
        rounded={false}
      />

      <Text>Species</Text>
      <Picker
        selectedValue={item.species}
        onValueChange={(value, _) => { update({ species: value }); }}>
        {Object.keys(Species).map(key => (
          <Picker.Item key={key} label={Species[key]} value={key} />
        ))}
      </Picker>

      <Text>Estimated size: {item.size} cm</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={item.size}
        onValueChange={(value) => { update({ size: value }); }}
      />

      <Text>Picture</Text>
      <Text>Coming soon!</Text>
      // TODO Allow:
      // * Upload from photo library
      // * Take picture with camera app

      <Button
        onPress={save}
        title='Save'
        color="#ccc"
      />
    </View>
  );
}

export default Fisheries;
