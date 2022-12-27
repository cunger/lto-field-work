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
import Datastore from '../components/data/LocalDatastore';

function BeachClean({ navigation, route }) {
  const tailwind = useTailwind();

  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [items, setItems] = useState({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [signingVisible, setSigningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [loadedItem, setLoadedItem] = useState(null);
  const [lines, setLines] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.itemId) {
        load(route.params.itemId);
      }
      return () => {};
    }, [route])
  );

  const load = (itemId: string) => {
    Datastore.item(itemId).then(item => {
      if (!item) return;

      const newItems = { [item.category]: item.quantity };

      reset();
      setLoadedItem(item);
      setDate(new Date(item.date));
      setLocation(item.location);
      setAdditionalNotes(item.additionalNotes || '');
      setItems(newItems);
      setLines(buildAllLinesFrom(newItems));
    });
  } 

  const buildAllLinesFrom = (items) => {
    const allLines = [];
    Object.keys(Category).forEach(category => {
      const quantity = items[category] || 0;
      allLines.push({ 
        category,
        quantity,
        key: `${quantity}-${category}`
      });
    });
    return allLines;
  };

  const updateItem = (quantity: number, category: Category) => {
    if (quantity == 0) {
      delete items[category];
    } else {
      items[category] = quantity;
    }
    setItems({ ...items });
  };

  const reset = () => {
    setDate(new Date());
    setLocation(null);
    resetItems();
  };

  const resetItems = () => {
    setItems({});
    setAdditionalNotes('');
    setLoadedItem(null);
    setLines(buildAllLinesFrom({}));
  };

  const openSigning = () => {
    setSigningVisible(true);
  };

  const closeSigning = () => {
    resetItems();
    setSigningVisible(false);
    // You probably finished the beach clean, so go back to menu.
    navigation.navigate('DataEntry', { screen: 'Select' });
  };

  const trashItems = () => {
    let trashItems = [];
    for (let [category, quantity] of Object.entries(items)) {
    if (loadedItem && loadedItem.category === category) {
        const item = loadedItem;
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
        key={`${date}-${location}`}
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
              key={line.key}
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
