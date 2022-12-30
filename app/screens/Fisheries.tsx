import React, { useState } from 'react';
import { Text, View } from 'react-native';
import InputSpinner from 'react-native-input-spinner'; // https://github.com/marcocesarato/react-native-input-spinner
import BouncyCheckbox from 'react-native-bouncy-checkbox'; // https://github.com/WrathChaos/react-native-bouncy-checkbox
import Catch from '../model/fisheries/Catch';
import Species from '../model/fisheries/Species';
import Sex from '../model/fisheries/Sex';
import Method from '../model/fisheries/Method';
import Base from '../model/fisheries/Base';
import Image from '../model/Image';
import ScrollContainer from '../components/ScrollContainer';
import Datastore from '../components/data/LocalDatastore';
import Coordinates from '../components/forms/Coordinates';
import Photos from '../components/forms/Photos';
import { InputGroup } from '../components/forms/Input';
import TextField from '../components/forms/TextField';
import MinMaxTextField from '../components/forms/MinMaxTextField';
import SelectField from '../components/forms/SelectField';
import SubmitButtons from '../components/forms/SubmitButtons';
import Signing from '../components/forms/Signing';
import ConfirmPrompt from '../components/ConfirmPrompt';
import { useTailwind } from 'tailwind-rn';
import { useFocusEffect } from '@react-navigation/core';

function Fisheries({ navigation, route }) {
  const tailwind = useTailwind();

  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [item, setItem] = useState(new Catch(date, location));
  const [isNoCatch, setIsNoCatch] = useState(false);
  const [isSchoolOfFish, setIsSchoolOfFish] = useState(false);
  const [isMinMaxSpecies, setIsMinMaxSpecies] = useState(false);
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [hideOtherMethod, setHideOtherMethod] = useState(true);

  // Species-specific fields get visible only once you select that species.
  const [hideForkLength, setHideForkLength] = useState(true);
  const [hideTailLength, setHideTailLength] = useState(true);
  const [hideHeadLength, setHideHeadLength] = useState(true);
  const [hideHeadWidth, setHideHeadWidth] = useState(true);
  const [hidePrecaudalLength, setHidePrecaudalLength] = useState(true);
  const [hideCarapaceLength, setHideCarapaceLength] = useState(true);
  const [hideCarapaceWidth, setHideCarapaceWidth] = useState(true);
  const [hideWingspan, setHideDiskWidth] = useState(true);
  const hideAllSpeciesSpecificFields = () => {
    setHideForkLength(true);
    setHideTailLength(true);
    setHideHeadLength(true);
    setHideHeadWidth(true);
    setHidePrecaudalLength(true);
    setHideCarapaceWidth(true);
    setHideCarapaceLength(true);
    setHideDiskWidth(true);
  };

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

      setDate(new Date(item.date));
      setLocation(item.location);
      setItem({ ...item });
      setIsNoCatch(item.quantity === 0);
      setIsSchoolOfFish(item.quantity > 1);
      setHideOtherMethod(!item.other_method);
      setSpeciesSpecificFields(item.species);
    });
  };
  
  const update = (fields) => {
    setItem({ ...item, ...fields });
  };

  const updateDimension = (dimension: string, key: string, value: string) => {
    item[dimension][key] = value;

    if (key === 'total') {
      item[dimension].min = '';
      item[dimension].max = '';
    }
    if (key === 'min' || key === 'max') {
      item[dimension].total = '';
    }
    
    setItem({ ...item });
  };

  const reset = () => {
    // You probably want to log several catches, so we're not resetting
    // the coordinates, base, and method.
    setItem(new Catch(date, location, item.base, item.method, item.other_method));
    hideAllSpeciesSpecificFields();
    setIsSchoolOfFish(false);
    setIsMinMaxSpecies(false);
  };

  const resetAllFields = () => {
    // This is a hard reset of all fields.
    const now = new Date();
    setDate(now);
    setLocation(null);
    setItem(new Catch(now, null));
    hideAllSpeciesSpecificFields();
    setIsSchoolOfFish(false);
    setIsMinMaxSpecies(false);
  };

  const openSigning = () => {
    item.date = date;
    item.location = location;
    setSignatureVisible(true);
  };

  const closeSigning = () => {
    reset();
    setSignatureVisible(false);
    // You probably want to log several catches,
    // so we don't navigate to another screen.
  };

  const discard = async () => {
    await Datastore.removeItem(item.id);
    reset();
    navigation.navigate('DataEntry', { screen: 'Select' });
  };

  const photoFlashMessage = () => {
    if (item.species == Species.Shark || item.species == Species.Ray) {
      return 'Please make sure to include a picture that can be used for sexing.';
    } else {
      return '';
    }
  }

  const photoFileName = (filetype: string) => {
    const dateString = `${item.date.getFullYear()}-${item.date.getMonth() + 1}-${item.date.getDate()}`;
    return `${dateString}-${item.species || item.common_name || 'Fish'}-${Date.now()}.${filetype}`;
  }

  const setSpeciesSpecificFields = (species: Species) => {
    hideAllSpeciesSpecificFields();
    setIsMinMaxSpecies(false);
    if (species == Species.TeleostFish) {
      setHideHeadLength(false);
      setHideHeadWidth(false);
      setIsMinMaxSpecies(true);
    } else
    if (species == Species.GameFish) {
      setHideForkLength(false);
      setHidePrecaudalLength(false);
    } else
    if (species == Species.Shark) {
      setHideForkLength(false);
      setHidePrecaudalLength(false);
    } else
    if (species == Species.Ray) {
      setHidePrecaudalLength(false);
      setHideDiskWidth(false);
    } else
    if (species == Species.Crayfish) {
      setHideCarapaceLength(false);
      setHideTailLength(false);
      setIsMinMaxSpecies(true);
    } else
    if (species == Species.Crab) {
      setHideCarapaceWidth(false);
    }
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
        <InputGroup text='Fishing method' />
        <View style={tailwind('flex flex-row items-stretch my-2')}>
          <SelectField
            label='Which method?'
            value={item.method}
            type={Method}
            updateAction={(value: string) => {
              setHideOtherMethod(value !== Method.Other);
              update({ method: value });
            }}
          />
          <SelectField
            label='From where?'
            value={item.base}
            type={Base}
            updateAction={(value: string) => update({ base: value })}
          />
        </View>
        <TextField
          label='Please describe method:'
          value={item.other_method}
          updateAction={(value: string) => update({ other_method: value })}
          hide={hideOtherMethod}
        />
      </View>

      <View>
        <InputGroup text='Catch' />

        <View style={tailwind('mb-2 py-2 border-b border-gray-200')}>
          <BouncyCheckbox
            size={25}
            fillColor='#6ec1e4'
            unfillColor='white'
            text='No catch.'
            textStyle={{ textDecorationLine: 'none' }}
            iconStyle={{ borderColor: '#6ec1e4' }}
            isChecked={isNoCatch}
            onPress={(value) => {
              if (value) {
                update({ quantity: 0 });
                setIsNoCatch(true);
                setIsSchoolOfFish(false);
              } else {
                update({ quantity: 1, reason: null });
                setIsNoCatch(false);
                setIsSchoolOfFish(false);
              }
            }}
          />
          <TextField
            label='Reason:'
            value={item.reason}
            updateAction={(value) => update({ reason: value })}
            hide={!isNoCatch}
          />
        </View>

        <View style={tailwind('flex flex-row items-stretch my-2')}>
          <InputSpinner
            min={0}
            step={1}
            value={item.quantity}
            onChange={(value) => {
              update({ quantity: value });
              setIsSchoolOfFish(value > 1);
            }}
            height={26}
            width={80}
            rounded={false}
            disabled={isNoCatch}
            style={tailwind('mr-4')}
          />
          <SelectField
            label='Which sex?'
            value={item.sex}
            type={Sex}
            updateAction={(value: string) => update({ sex: value })}
          />
          <SelectField
            label='Which species?'
            value={item.species}
            type={Species}
            updateAction={(value: string) => {
              update({ species: value });
              setSpeciesSpecificFields(value);
            }}
          />
        </View>

        <TextField
          label='Common name'
          value={item.common_name}
          updateAction={(value: string) => update({ common_name: value })}
        />

        {
          isSchoolOfFish && isMinMaxSpecies &&
          <View>
            <Text style={tailwind('my-2 text-blue')}>
              Please specify all properties both for the smallest and the biggest of the caught fish.
            </Text>
            <MinMaxTextField
              label='Total length (cm)'
              minValue={item.length.min}
              maxValue={item.length.max}
              minUpdateAction={(value: string) => updateDimension('length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('length', 'max', value)}
            />
            <MinMaxTextField
              label='Head length (cm)'
              minValue={item.head_length.min}
              maxValue={item.head_length.max}
              minUpdateAction={(value: string) => updateDimension('head_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('head_length', 'max', value)}
              hide={hideHeadLength}
            />
            <MinMaxTextField
              label='Head width (cm)'
              minValue={item.head_width.min}
              maxValue={item.head_width.max}
              minUpdateAction={(value: string) => updateDimension('head_width', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('head_width', 'max', value)}
              hide={hideHeadWidth}
            />
            <MinMaxTextField
              label='Fork length (cm)'
              minValue={item.fork_length.min}
              maxValue={item.fork_length.max}
              minUpdateAction={(value: string) => updateDimension('fork_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('fork_length', 'max', value)}
              hide={hideForkLength}
            />
            <MinMaxTextField
              label='Precaudal length (cm)'
              minValue={item.precaudal_length.min}
              maxValue={item.precaudal_length.max}
              minUpdateAction={(value: string) => updateDimension('precaudal_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('precaudal_length', 'max', value)}
              hide={hidePrecaudalLength}
            />
            <MinMaxTextField
              label='Carapace length (cm)'
              minValue={item.carapace_length.min}
              maxValue={item.carapace_length.max}
              minUpdateAction={(value: string) => updateDimension('carapace_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('carapace_length', 'max', value)}
              hide={hideCarapaceLength}
            />
            <MinMaxTextField
              label="Carapace width (cm)"
              minValue={item.carapace_width.min}
              maxValue={item.carapace_width.max}
              minUpdateAction={(value: string) => updateDimension('carapace_width', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('carapace_width', 'max', value)}
              hide={hideCarapaceWidth}
            />
            <MinMaxTextField
              label='Tail length (cm)'
              minValue={item.tail_length.min}
              maxValue={item.tail_length.max}
              minUpdateAction={(value: string) => updateDimension('tail_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('tail_length', 'max', value)}
              hide={hideTailLength}
            />
            <MinMaxTextField
              label='Disk width (cm)'
              minValue={item.disk_width.min}
              maxValue={item.disk_width.max}
              minUpdateAction={(value: string) => updateDimension('disk_width', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('disk_width', 'max', value)}
              hide={hideWingspan}
            />
          </View>
        }
        {
          isSchoolOfFish && !isMinMaxSpecies &&
          <View>
            <Text style={tailwind('my-2 text-blue')}>
              If they have different sizes, please log them separately.
            </Text>
          </View>
        }
        { 
          (!isSchoolOfFish || !isMinMaxSpecies) &&
          <View>
            <TextField
              label='Total length (cm)'
              value={item.length.total}
              updateAction={(value: string) => updateDimension('length', 'total', value)}
              keyboardType='numeric'
            />
            <TextField
              label='Head length (cm)'
              value={item.head_length.total}
              updateAction={(value: string) => updateDimension('head_length', 'total', value)}
              keyboardType='numeric'
              hide={hideHeadLength}
            />
            <TextField
              label='Head width (cm)'
              value={item.head_width.total}
              updateAction={(value: string) => updateDimension('head_width', 'total', value)}
              keyboardType='numeric'
              hide={hideHeadWidth}
            />
            <TextField
              label='Fork length (cm)'
              value={item.fork_length.total}
              updateAction={(value: string) => updateDimension('fork_length', 'total', value)}
              keyboardType='numeric'
              hide={hideForkLength}
            />
            <TextField
              label='Precaudal length (cm)'
              value={item.precaudal_length.total}
              updateAction={(value: string) => updateDimension('precaudal_length', 'total', value)}
              keyboardType='numeric'
              hide={hidePrecaudalLength}
            />
            <TextField
              label='Carapace length (cm)'
              value={item.carapace_length.total}
              updateAction={(value: string) => updateDimension('carapace_length', 'total', value)}
              keyboardType='numeric'
              hide={hideCarapaceLength}
            />
            <TextField
              label="Carapace width (cm) if it's a crab"
              value={item.carapace_width.total}
              updateAction={(value: string) => updateDimension('carapace_width', 'total', value)}
              keyboardType='numeric'
              hide={hideCarapaceWidth}
            />
            <TextField
              label='Tail length (cm)'
              value={item.tail_length.total}
              updateAction={(value: string) => updateDimension('tail_length', 'total', value)}
              keyboardType='numeric'
              hide={hideTailLength}
            />
            <TextField
              label='Disk width (cm)'
              value={item.disk_width.total}
              updateAction={(value: string) => updateDimension('disk_width', 'total', value)}
              keyboardType='numeric'
              hide={hideWingspan}
            />
          </View>
        }
      </View>

      <Photos
        flashMessage={photoFlashMessage}
        photos={item.photos}
        addPhoto={(image: Image) => {
          update({ photos: [ ...item.photos, image ] });
        }}
        removePhoto={(image: Image) => {
          const index = item.photos.indexOf(image);
          if (index >= 0) {
            item.photos.splice(index, 1);
            update({ photos: [ ...item.photos ] });
          }
        }}
        photoFileName={photoFileName}
        photosNote={item.photosNote}
        setPhotosNote={(note: string) => update({ photosNote: note })}
      />

      <View>
        <InputGroup text='Additional notes' />
        <TextField
          numberOfLines={4}
          label='If there is something else that is important, let us know:'
          value={item.additionalNotes}
          updateAction={(value: string) => update({ additionalNotes: value })}
        />
      </View>

      <SubmitButtons saveAction={openSigning} discardAction={() => setConfirmVisible(true)} resetAction={() => resetAllFields()} />
      <Signing visible={signatureVisible} setVisible={setSignatureVisible} items={[item]} closeAction={closeSigning} />
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase='discard this data entry (and lose all information logged here)'
        actionButtonText='Discard'
        action={discard}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default Fisheries;
