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
import DateTime from '../model/DateTime';
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
import GlobalContext from '../context/GlobalContext';
import { photoFileName } from '../components/utils/PrettyPrinter';

function Fisheries({ navigation, route }) {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  const [location, setLocation] = useState(null);
  // Note that date is of type DateTime, while item.date is of type number (the epoch).
  const [date, setDate] = useState(new DateTime());
  const [item, setItem] = useState(new Catch(date.toEpoch(), location));
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

      const location = item.location
      const datetime = item.date ? new DateTime(new Date(item.date)) : new DateTime();

      setDate(datetime);
      setLocation(location);
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
      item[dimension].avg = '';
    }
    if (key === 'min' || key === 'max' || key === 'avg') {
      item[dimension].total = '';
    }

    setItem({ ...item });
  };

  const reset = () => {
    // You probably want to log several catches, so we're not resetting
    // the coordinates, base, and method.
    setItem(new Catch(date.toEpoch(), location, item.base, item.method, item.other_method));
    hideAllSpeciesSpecificFields();
    setIsSchoolOfFish(false);
    setIsMinMaxSpecies(false);
  };

  const resetAllFields = () => {
    // This is a hard reset of all fields.
    const now = new DateTime();
    setDate(now);
    setLocation(null);
    setItem(new Catch(now.toEpoch(), null));
    hideAllSpeciesSpecificFields();
    setIsSchoolOfFish(false);
    setIsMinMaxSpecies(false);
  };

  const openSigning = () => {
    item.date = date.toEpoch();
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
      return i18n.t('FISHERIES_INCLUDE_PIC_FOR_SEXING');
    } else if (item.species == Species.Crab || item.species == Species.Crayfish) {
      return i18n.t('FISHERIES_INCLUDE_PIC_WITH_EGGS');
    } else {
      return '';
    }
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
        <InputGroup text={i18n.t('FISHERIES_METHOD')} />
        <View style={tailwind('flex flex-row items-stretch my-2')}>
          <SelectField
            label={i18n.t('FISHERIES_WHICH_METHOD')}
            value={item.method}
            type={Method}
            updateAction={(value: string) => {
              setHideOtherMethod(value !== Method.Other);
              update({ method: value });
            }}
          />
          <SelectField
            label={i18n.t('FISHERIES_BASE')}
            value={item.base}
            type={Base}
            updateAction={(value: string) => update({ base: value })}
          />
        </View>
        <TextField
          label={i18n.t('FISHERIES_OTHER_METHOD')}
          value={item.other_method}
          updateAction={(value: string) => update({ other_method: value })}
          hide={hideOtherMethod}
        />
      </View>

      <View>
        <InputGroup text={i18n.t('FISHERIES_CATCH')} />

        <View style={tailwind('mb-2 py-2 border-b border-gray-200')}>
          <BouncyCheckbox
            size={25}
            fillColor='#6ec1e4'
            unfillColor='white'
            text={i18n.t('FISHERIES_NO_CATCH')}
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
            label={i18n.t('FISHERIES_REASON')}
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
            label={i18n.t('FISHERIES_SEX')}
            value={item.sex}
            type={Sex}
            updateAction={(value: string) => update({ sex: value })}
          />
          <SelectField
            label={i18n.t('FISHERIES_SPECIES')}
            value={item.species}
            type={Species}
            updateAction={(value: string) => {
              update({ species: value });
              setSpeciesSpecificFields(value);
            }}
          />
        </View>

        <TextField
          label={i18n.t('FISHERIES_COMMON_NAME')}
          value={item.common_name}
          updateAction={(value: string) => update({ common_name: value })}
          helpText={i18n.t('FISHERIES_COMMON_NAME_HELP')}
        />

        <TextField
          label={i18n.t('FISHERIES_LATIN_NAME')}
          value={item.latin_name}
          updateAction={(value: string) => update({ latin_name: value })}
          helpText={i18n.t('FISHERIES_LATIN_NAME_HELP')}
        />

        {
          isSchoolOfFish && isMinMaxSpecies &&
          <View>
            <Text style={tailwind('my-2 text-blue')}>
              {i18n.t('FISHERIES_MIN_MAX_NOTE')}
            </Text>
            <MinMaxTextField
              label={i18n.t('FISHERIES_TOTAL_LENGTH')}
              minValue={item.length.min}
              maxValue={item.length.max}
              avgValue={item.length.avg}
              minUpdateAction={(value: string) => updateDimension('length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('length', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('length', 'avg', value)}
              helpText={i18n.t('FISHERIES_TOTAL_LENGTH_HELP')}
              />
            <MinMaxTextField
              label={i18n.t('FISHERIES_HEAD_LENGTH')}
              minValue={item.head_length.min}
              maxValue={item.head_length.max}
              avgValue={item.head_length.avg}
              minUpdateAction={(value: string) => updateDimension('head_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('head_length', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('head_length', 'avg', value)}
              hide={hideHeadLength}
              helpText={i18n.t('FISHERIES_HEAD_LENGTH_HELP')}
            />
            <MinMaxTextField
              label={i18n.t('FISHERIES_HEAD_WIDTH')}
              minValue={item.head_width.min}
              maxValue={item.head_width.max}
              avgValue={item.head_width.avg}
              minUpdateAction={(value: string) => updateDimension('head_width', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('head_width', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('head_width', 'avg', value)}
              hide={hideHeadWidth}
              helpText={i18n.t('FISHERIES_HEAD_WIDTH_HELP')}
            />
            <MinMaxTextField
              label={i18n.t('FISHERIES_FORK_LENGTH')}
              minValue={item.fork_length.min}
              maxValue={item.fork_length.max}
              avgValue={item.fork_length.avg}
              minUpdateAction={(value: string) => updateDimension('fork_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('fork_length', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('fork_length', 'avg', value)}
              hide={hideForkLength}
              helpText={i18n.t('FISHERIES_FORK_LENGTH_HELP')}
            />
            <MinMaxTextField
              label={i18n.t('FISHERIES_PRECAUDAL_LENGTH')}
              minValue={item.precaudal_length.min}
              maxValue={item.precaudal_length.max}
              avgValue={item.precaudal_length.avg}
              minUpdateAction={(value: string) => updateDimension('precaudal_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('precaudal_length', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('precaudal_length', 'avg', value)}
              hide={hidePrecaudalLength}
              helpText={i18n.t('FISHERIES_PRECAUDAL_LENGTH_HELP')}
            />
            <MinMaxTextField
              label={i18n.t('FISHERIES_CARAPACE_LENGTH')}
              minValue={item.carapace_length.min}
              maxValue={item.carapace_length.max}
              avgValue={item.carapace_length.avg}
              minUpdateAction={(value: string) => updateDimension('carapace_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('carapace_length', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('carapace_length', 'avg', value)}
              hide={hideCarapaceLength}
              helpText={i18n.t('FISHERIES_CARAPACE_LENGTH_HELP')}
            />
            <MinMaxTextField
              label={i18n.t('FISHERIES_CARAPACE_WIDTH')}
              minValue={item.carapace_width.min}
              maxValue={item.carapace_width.max}
              avgValue={item.carapace_width.avg}
              minUpdateAction={(value: string) => updateDimension('carapace_width', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('carapace_width', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('carapace_width', 'avg', value)}
              hide={hideCarapaceWidth}
              helpText={i18n.t('FISHERIES_CARAPACE_WIDTH_HELP')}
            />
            <MinMaxTextField
              label={i18n.t('FISHERIES_TAIL_LENGTH')}
              minValue={item.tail_length.min}
              maxValue={item.tail_length.max}
              avgValue={item.tail_length.avg}
              minUpdateAction={(value: string) => updateDimension('tail_length', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('tail_length', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('tail_length', 'avg', value)}
              hide={hideTailLength}
              helpText={i18n.t('FISHERIES_TAIL_LENGTH_HELP')}
            />
            <MinMaxTextField
              label={i18n.t('FISHERIES_DISK_WIDTH')}
              minValue={item.disk_width.min}
              maxValue={item.disk_width.max}
              avgValue={item.disk_width.avg}
              minUpdateAction={(value: string) => updateDimension('disk_width', 'min', value)}
              maxUpdateAction={(value: string) => updateDimension('disk_width', 'max', value)}
              avgUpdateAction={(value: string) => updateDimension('disk_width', 'avg', value)}
              hide={hideWingspan}
              helpText={i18n.t('FISHERIES_DISK_WIDTH_HELP')}
            />
          </View>
        }
        {
          isSchoolOfFish && !isMinMaxSpecies &&
          <View>
            <Text style={tailwind('my-2 text-blue')}>
              {i18n.t('FISHERIES_SCHOOL_OF_FISH_NOTE')}
            </Text>
          </View>
        }
        { 
          (!isSchoolOfFish || !isMinMaxSpecies) &&
          <View>
            <TextField
              label={i18n.t('FISHERIES_TOTAL_LENGTH')}
              value={item.length.total}
              updateAction={(value: string) => updateDimension('length', 'total', value)}
              keyboardType='numeric'
              helpText={i18n.t('FISHERIES_TOTAL_LENGTH_HELP')}
            />
            <TextField
              label={i18n.t('FISHERIES_HEAD_LENGTH')}
              value={item.head_length.total}
              updateAction={(value: string) => updateDimension('head_length', 'total', value)}
              keyboardType='numeric'
              hide={hideHeadLength}
              helpText={i18n.t('FISHERIES_HEAD_LENGTH_HELP')}
            />
            <TextField
              label={i18n.t('FISHERIES_HEAD_WIDTH')}
              value={item.head_width.total}
              updateAction={(value: string) => updateDimension('head_width', 'total', value)}
              keyboardType='numeric'
              hide={hideHeadWidth}
              helpText={i18n.t('FISHERIES_HEAD_WIDTH_HELP')}
            />
            <TextField
              label={i18n.t('FISHERIES_FORK_LENGTH')}
              value={item.fork_length.total}
              updateAction={(value: string) => updateDimension('fork_length', 'total', value)}
              keyboardType='numeric'
              hide={hideForkLength}
              helpText={i18n.t('FISHERIES_FORK_LENGTH_HELP')}
            />
            <TextField
              label={i18n.t('FISHERIES_PRECAUDAL_LENGTH')}
              value={item.precaudal_length.total}
              updateAction={(value: string) => updateDimension('precaudal_length', 'total', value)}
              keyboardType='numeric'
              hide={hidePrecaudalLength}
            />
            <TextField
              label={i18n.t('FISHERIES_CARAPACE_LENGTH')}
              value={item.carapace_length.total}
              updateAction={(value: string) => updateDimension('carapace_length', 'total', value)}
              keyboardType='numeric'
              hide={hideCarapaceLength}
              helpText={i18n.t('FISHERIES_CARAPACE_LENGTH_HELP')}
            />
            <TextField
              label={i18n.t('FISHERIES_CARAPACE_WIDTH')}
              value={item.carapace_width.total}
              updateAction={(value: string) => updateDimension('carapace_width', 'total', value)}
              keyboardType='numeric'
              hide={hideCarapaceWidth}
              helpText={i18n.t('FISHERIES_CARAPACE_WIDTH_HELP')}
            />
            <TextField
              label={i18n.t('FISHERIES_TAIL_LENGTH')}
              value={item.tail_length.total}
              updateAction={(value: string) => updateDimension('tail_length', 'total', value)}
              keyboardType='numeric'
              hide={hideTailLength}
              helpText={i18n.t('FISHERIES_TAIL_LENGTH_HELP')}
            />
            <TextField
              label={i18n.t('FISHERIES_DISK_WIDTH')}
              value={item.disk_width.total}
              updateAction={(value: string) => updateDimension('disk_width', 'total', value)}
              keyboardType='numeric'
              hide={hideWingspan}
              helpText={i18n.t('FISHERIES_DISK_WIDTH_HELP')}
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
        photoFileName={(filetype: string) => photoFileName(filetype, item)}
        photosNote={item.photosNote}
        setPhotosNote={(note: string) => update({ photosNote: note })}
      />

      <View>
        <InputGroup text={i18n.t('ADDITIONAL_NOTES')} />
        <TextField
          numberOfLines={4}
          label={i18n.t('ADDITIONAL_NOTES_LABEL')}
          value={item.additionalNotes}
          updateAction={(value: string) => update({ additionalNotes: value })}
        />
      </View>

      <SubmitButtons saveAction={openSigning} discardAction={() => setConfirmVisible(true)} resetAction={() => resetAllFields()} />
      <Signing visible={signatureVisible} setVisible={setSignatureVisible} items={[item]} closeAction={closeSigning} />
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase={i18n.t('CONFIRM_DISCARD')}
        actionButtonText={i18n.t('BUTTON_DISCARD')}
        action={discard}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default Fisheries;
