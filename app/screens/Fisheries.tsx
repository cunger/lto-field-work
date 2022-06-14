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
import SelectField from '../components/forms/SelectField';
import SubmitButtons from '../components/forms/SubmitButtons';
import Signing from '../components/forms/Signing';
import ConfirmPrompt from '../components/ConfirmPrompt';
import { useTailwind } from 'tailwind-rn';

function Fisheries({ navigation }) {
  const tailwind = useTailwind();

  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [item, setItem] = useState(new Catch(date, location));
  const [isNoCatch, setIsNoCatch] = useState(false);
  const [isSchoolOfFish, setIsSchoolOfFish] = useState(false);
  const [photoNames, setPhotoNames] = useState([]);
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
  const [hideWingspan, setHideWingspan] = useState(true);
  const hideAllSpeciesSpecificFields = () => {
    setHideForkLength(true);
    setHideTailLength(true);
    setHideHeadLength(true);
    setHideHeadWidth(true);
    setHidePrecaudalLength(true);
    setHideCarapaceWidth(true);
    setHideCarapaceLength(true);
    setHideWingspan(true);
  };

  const update = (fields) => {
    setItem({ ...item, ...fields });
  };

  const reset = () => {
    // You probably want to log several catches, so we're not resetting
    // the coordinates, base, and method.
    setItem(new Catch(date, location, item.base, item.method, item.other_method));
    setPhotoNames([]);
    hideAllSpeciesSpecificFields();
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

  const discard = () => {
    reset();
    navigation.navigate('Data Entry', { screen: 'Data entry' });
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

  return (
    <ScrollContainer>
      <Coordinates
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
            updateAction={(value) => {
              setHideOtherMethod(value !== Method.Other);
              update({ method: value });
            }}
          />
          <SelectField
            label='From where?'
            value={item.base}
            type={Base}
            updateAction={(value) => update({ base: value })}
          />
        </View>
        <TextField
          label='Please describe method:'
          value={item.other_method}
          updateAction={(value) => update({ other_method: value })}
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
            updateAction={(value) => update({ sex: value })}
          />
          <SelectField
            label='Which species?'
            value={item.species}
            type={Species}
            updateAction={(value) => {
              update({ species: value });
              hideAllSpeciesSpecificFields();
              if (value == 'TeleostFish') {
                setHideHeadLength(false);
                setHideHeadWidth(false);
                setHidePrecaudalLength(false);
              } else
              if (value == 'GameFish') {
                setHideHeadLength(false);
                setHideHeadWidth(false);
                setHideForkLength(false);
                setHidePrecaudalLength(false);
              } else
              if (value == 'Shark') {
                setHideForkLength(false);
                setHidePrecaudalLength(false);
              } else
              if (value == 'Ray') {
                setHidePrecaudalLength(false);
                setHideWingspan(false);
              } else
              if (value == 'Cephalopod') {
                setHideHeadLength(false);
              } else
              if (value == 'Crustacean') {
                setHideCarapaceLength(false);
                setHideCarapaceWidth(false);
                setHideTailLength(false);
              }
            }}
          />
        </View>

        <TextField
          label='Common name'
          value={item.common_name}
          updateAction={(value) => update({ common_name: value })}
        />

        {
          isSchoolOfFish &&
          <Text style={tailwind('my-2 text-blue')}>
            Please specify the total length both for the smallest and the biggest of the caught fish.
          </Text>
        }

        { isSchoolOfFish &&
          <TextField
            label='Maximum total length (cm)'
            value={item.max_length}
            updateAction={(value) => update({ max_length: value })}
          />
        }
        { isSchoolOfFish &&
          <TextField
            label='Minimum total length (cm)'
            value={item.min_length}
            updateAction={(value) => update({ min_length: value })}
          />
        }
        { !isSchoolOfFish &&
          <TextField
            label='Total length (cm)'
            value={item.length}
            updateAction={(value) => update({ length: value })}
          />
        }
        {
          isSchoolOfFish &&
          <Text style={tailwind('my-2 text-blue')}>
            For the rest, simply give a rough average.
          </Text>
        }
        <TextField
          label='Head length (cm)'
          value={item.head_length}
          updateAction={(value) => update({ head_length: value })}
          hide={hideHeadLength}
        />
        <TextField
          label='Head width (cm)'
          value={item.head_width}
          updateAction={(value) => update({ head_width: value })}
          hide={hideHeadWidth}
        />
        <TextField
          label='Fork length (cm)'
          value={item.fork_length}
          updateAction={(value) => update({ fork_length: value })}
          hide={hideForkLength}
        />
        <TextField
          label='Precaudal length (cm)'
          value={item.precaudal_length}
          updateAction={(value) => update({ precaudal_length: value })}
          hide={hidePrecaudalLength}
        />
        <TextField
          label='Carapace length (cm)'
          value={item.carapace_length}
          updateAction={(value) => update({ carapace_length: value })}
          hide={hideCarapaceLength}
        />
        <TextField
          label="Carapace width (cm) if it's a crab"
          value={item.carapace_width}
          updateAction={(value) => update({ carapace_width: value })}
          hide={hideCarapaceWidth}
        />
        <TextField
          label='Tail length (cm)'
          value={item.tail_length}
          updateAction={(value) => update({ tail_length: value })}
          hide={hideTailLength}
        />
        <TextField
          label='Wingspan (cm)'
          value={item.wingspan}
          updateAction={(value) => update({ wingspan: value })}
          hide={hideWingspan}
        />
        <TextField
          label='Weight (g)'
          value={item.weight}
          updateAction={(value) => update({ weight: value })}
        />
      </View>

      <Photos
        flashMessage={photoFlashMessage}
        addPhoto={async (photo) => {
          const uriparts = photo.uri.split('.');
          const filetype = uriparts[uriparts.length - 1];
          const name = photoFileName(filetype).replaceAll(' ', '-');
          const location = await Datastore.savePhoto(photo, name);
          if (location) {
            update({ photos: [...item.photos, new Image(name, location)] });
            setPhotoNames([...photoNames, name]);
          }
        }}
        photoNames={photoNames}
        photosNote={item.photosNote}
        setPhotosNote={(note) => update({ photosNote: note })}
      />

      <View>
        <InputGroup text='Additional notes' />
        <TextField
          numberOfLines={4}
          label='If there is something else that is important, let us know:'
          value={item.additionalNotes}
          updateAction={(value) => update({ additionalNotes: value })}
        />
      </View>

      <SubmitButtons saveAction={openSigning} discardAction={() => setConfirmVisible(true)} />
      <Signing visible={signatureVisible} items={[item]} closeAction={closeSigning} />
      <ConfirmPrompt visible={confirmVisible}
        actionPhrase='discard this data entry'
        actionButtonText='Discard'
        action={discard}
        hide={() => setConfirmVisible(false)} />
    </ScrollContainer>
  );
}

export default Fisheries;
