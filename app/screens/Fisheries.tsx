import React, { useState } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import InputSpinner from 'react-native-input-spinner';
import Catch from 'model/fisheries/Catch';
import Species from 'model/fisheries/Species';
import Signature from 'model/Signature';
import ScrollContainer from 'components/ScrollContainer';
import Datastore from 'components/data/LocalDatastore';
import Coordinates from 'components/forms/Coordinates';
import InputLabel from 'components/forms/InputLabel';
import SubmitButtons from 'components/forms/SubmitButtons';
import Signing from 'components/forms/Signing';

function Fisheries({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(Location.Guinjata);
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
    navigation.navigate('DataEntry');
  };

  return (
    <ScrollContainer>
      <Coordinates
        setDateOnParent={setDate}
        setLocationOnParent={setLocation}
      />

      <View>
        <InputLabel text='Quantity' />
        <InputSpinner
        	max={20}
        	min={1}
        	step={1}
        	value={item.quantity}
        	onChange={(value) => { update({ quantity: value }); }}
          height={30}
          rounded={false}
        />

        <InputLabel text='Species' />
        <Picker
          selectedValue={item.species}
          onValueChange={(value, _) => { update({ species: value }); }}>
          {Object.keys(Species).map(key => (
            <Picker.Item key={key} label={Species[key]} value={key} />
          ))}
        </Picker>
      </View>

      <View>
        <InputLabel text="Estimated size: {item.size} cm" />
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
        <Text>Coming soon!</Text>
      </View>

      <SubmitButtons saveAction={sign} discardAction={discard} />
      <Signing visible={signatureVisible} action={save} />
    </ScrollContainer>
  );
}

export default Fisheries;
