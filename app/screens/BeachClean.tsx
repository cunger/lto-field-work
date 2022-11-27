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

function BeachClean({ navigation, route }) {
  const tailwind = useTailwind();
  const [date, setDate] = useState(route?.params?.date || new Date());
  const [location, setLocation] = useState(route?.params?.location);
  const [items, setItems] = useState(route?.params?.items || {});
  const [additionalNotes, setAdditionalNotes] = useState(route?.params?.additionalNotes || '');
  const [signingVisible, setSigningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const updateItem = (quantity: number, category: Category) => {
    items[category] = quantity;
    setItems(items);
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
    navigation.navigate('Data Entry', { screen: 'Data entry' });
  };

  const trashItems = () => {
    let trashItems = [];
    for (let [category, quantity] of Object.entries(items)) {
      trashItems.push(new Trash(date, location, category, quantity, additionalNotes));
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

    navigation.navigate('Data Entry', { screen: 'Data entry' });
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
        {Object.keys(Category).map(key => {
          const category = Category[key];
          if (category == 'Unknown') return;
          return (
            <InputSpinner
            	min={0}
            	step={1}
            	value={items[category] || 0}
            	onChange={(value) => { updateItem(value, category); }}
              prepend={(<Text style={tailwind('w-1/2')}> {category} </Text>)}
              height={30}
              rounded={false}
              key={category}
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
