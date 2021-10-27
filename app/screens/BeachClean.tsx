import React, { useState } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import InputSpinner from 'react-native-input-spinner';
import Trash from 'model/beachclean/Trash';
import Category from 'model/beachclean/Category';
import Signature from 'model/Signature';
import Location from 'model/Location';
import Datastore from 'components/data/LocalDatastore';
import ScrollContainer from 'components/ScrollContainer';
import Coordinates from 'components/forms/Coordinates';
import InputLabel from 'components/forms/InputLabel';
import SubmitButtons from 'components/forms/SubmitButtons';
import Signing from 'components/forms/Signing';
import { tailwind } from 'tailwind';

function BeachClean({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(Location.Guinjata);
  const [items, setItems] = useState({});
  const [signatureVisible, setSignatureVisible] = useState(false);

  const updateItem = (quantity, category) => {
    items[category] = (items[category] || 0) + quantity;
    setItems(items);
  };

  const reset = () => {
    // setDate(new Date());
    // setLocation();
    setItems({});
  };

  const sign = () => {
    setSignatureVisible(true);
  };

  const save = () => {
    console.log(`Saving data: ${JSON.stringify(items)}`);

    for (let [category, quantity] of Object.entries(items)) {
      let item = Trash({
        date: date,
        location: location,
        category: category,
        quantity: quantity,
      });

      console.log(`...${JSON.stringify(item)}`);
      Datastore.save(item);
    }
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
        <InputLabel text='Items' />
        {Object.keys(Category).map(key => {
          const category = Category[key];
          if (category == 'Unknown') return;
          return (
            <InputSpinner
            	max={100}
            	min={0}
            	step={1}
            	value={items[category] || 0}
            	onChange={(value) => { updateItem(value, category); }}
              append={(<Text> {category} </Text>)}
              height={30}
              rounded={false}
              key={category}
              style={tailwind('mb-2 bg-white')}
            />
          );
        })}
      </View>

      <SubmitButtons saveAction={sign} discardAction={discard} />
      <Signing visible={signatureVisible} action={save} />
    </ScrollContainer>
  );
}

export default BeachClean;
