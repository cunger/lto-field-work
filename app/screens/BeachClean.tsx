import React, { useState } from 'react';
import { View, Text } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import Trash from '../model/beachclean/Trash';
import Category from '../model/beachclean/Category';
import DateTime from '../model/DateTime';
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
import GlobalContext from '../context/GlobalContext';

function BeachClean({ navigation, route }) {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  const [date, setDate] = useState(new DateTime());
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
      } else {
        setLines(buildAllLinesFrom(items));
      }
      return () => {};
    }, [route])
  );

  const load = (itemId: string) => {
    Datastore.item(itemId).then(item => {
      if (!item) return;

      const location = item.location
      const datetime = item.date ? new DateTime(new Date(item.date)) : new DateTime();
      const newItems = { [item.category]: item.quantity };

      reset();
      setLoadedItem(item);
      setDate(datetime);
      setLocation(location);
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
    setDate(new DateTime());
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
        item.date = date.toEpoch();
        item.location = location;
        item.quantity = quantity;
        item.additionalNotes = additionalNotes;
        trashItems.push(item);
      } else {
        trashItems.push(new Trash(date.toEpoch(), location, category, quantity, additionalNotes));
      }
    }

    return trashItems;
  };


  const discard = () => {
    reset();
    showMessage({
      message: i18n.t('DATA_WAS_DISCARDED'),
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
        <InputGroup text={i18n.t('BEACHCLEAN_ITEMS')} />
        {lines.map(line => {
          return (
            <InputSpinner
            	min={0}
            	step={1}
            	value={line.quantity}
            	onChange={(value) => { updateItem(value, line.category); }}
              prepend={(<Text style={tailwind('w-1/2')}> {i18n.t(Category[line.category])} </Text>)}
              height={30}
              rounded={false}
              key={line.key}
              style={tailwind('mb-2 bg-white')}
            />
          );
        })}
      </View>

      <View>
        <InputGroup text={i18n.t('ADDITIONAL_NOTES')} />
        <TextField
          numberOfLines={4}
          label={i18n.t('ADDITIONAL_NOTES_LABEL')}
          value={additionalNotes}
          updateAction={setAdditionalNotes}
        />
      </View>

      <SubmitButtons 
        saveAction={openSigning} discardAction={() => setConfirmVisible(true)} resetAction={() => reset()} />
      <Signing visible={signingVisible} setVisible={setSigningVisible} items={trashItems()} closeAction={closeSigning} />
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase={i18n.t('CONFIRM_DISCARD')}
        actionButtonText={i18n.t('BUTTON_DISCARD')}
        action={discard}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default BeachClean;
