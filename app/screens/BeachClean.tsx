import React, { useState } from 'react';
import { View, Text } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import Trash from '../model/beachclean/Trash';
import Category from '../model/beachclean/Category';
import ScrollContainer from '../components/ScrollContainer';
import Coordinates from '../components/forms/Coordinates';
import TextField from '../components/forms/TextField';
import { InputGroup } from '../components/forms/Input';
import SubmitButtons from '../components/forms/SubmitButtons';
import Signing from '../components/forms/Signing';
import ConfirmPrompt from '../components/ConfirmPrompt';
import { showMessage } from 'react-native-flash-message';
import { useTailwind } from 'tailwind-rn';
import { useFocusEffect } from '@react-navigation/core';

function BeachClean({ navigation, route }) {
  const tailwind = useTailwind();
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [items, setItems] = useState({});
  const [lines, setLines] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [signingVisible, setSigningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.date) {
        setDate(new Date(route.params.date));
      }
      if (route?.params?.location) {
        setLocation(route.params.location);
      }
      if (route?.params?.items) {
        setItems({ ...route.params.items });
      } 
      if (route?.params?.additionalNotes) {
        setAdditionalNotes(route?.params?.additionalNotes);
      }

      setLines([ ...Object.keys(Category).map(category => {
        return { category: category, quantity: items[category] || 0 };
      })]);

      return () => {};
    }, [])
  );

  const updateItem = (quantity: number, category: Category) => {
    items[category] = quantity;
    setItems({ ...items });
  };

  const reset = () => {
    // setDate(new Date());
    // setLocation(undefined);
    setItems({});
    setAdditionalNotes('');
  };

  const openSigning = () => {
    setSigningVisible(true);
  };

  const closeSigning = () => {
    reset();
    setSigningVisible(false);
    // You probably finished the beach clean, so go back to menu.
    navigation.navigate('DataEntry', { screen: 'Select' });
  };

  const trashItems = () => {
    let trashItems = [];
    for (let [category, quantity] of Object.entries(items)) {
      if (route?.params?.item && route.params.item.category === category) {
        const item = route.params.item;
        item.date = date;
        item.location = location;
        item.quantity = quantity;
        item.additionalNotes = additionalNotes;
        trashItems.push(item);
      } else {
        trashItems.push(new Trash(date, location, category, quantity, additionalNotes));
      }
    }

    return trashItems;
  };

  const discard = () => {
    reset();
    showMessage({
      message: 'Data was discarded.',
      type: 'warning',
      icon: 'info'
    });

    navigation.navigate('DataEntry', { screen: 'Select' });
  };

  return (
    <ScrollContainer>
      <Coordinates
        inputDate={date}
        inputLocation={location}
        setDateOnParent={setDate}
        setLocationOnParent={setLocation}
      />

      <View>
        <InputGroup text='Items' />
        {lines.map(line => {
          return (
            <InputSpinner
            	min={0}
            	step={1}
            	value={line.quantity}
            	onChange={(value) => { updateItem(value, line.category); }}
              prepend={(<Text style={tailwind('w-1/2')}> {Category[line.category]} </Text>)}
              height={30}
              rounded={false}
              key={line.category}
              style={tailwind('mb-2 bg-white')}
            />
          );
        })}
      </View>

      <View>
        <InputGroup text='Additional notes' />
        <TextField
          numberOfLines={4}
          label='If there is something else that is important, let us know:'
          value={additionalNotes}
          updateAction={setAdditionalNotes}
        />
      </View>

      <SubmitButtons 
        saveAction={openSigning} discardAction={() => setConfirmVisible(true)} resetAction={() => reset()} />
      <Signing visible={signingVisible} items={trashItems()} closeAction={closeSigning} />
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase='discard this data entry'
        actionButtonText='Discard'
        action={discard}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default BeachClean;
