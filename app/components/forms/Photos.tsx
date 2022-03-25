import React, { useState } from 'react';
import { ScrollView, View, Text, Button, TouchableOpacity, Platform } from 'react-native';
import { InputLabel, InputField, InputGroup } from './Input';
import TextField from './TextField';
import Image from '../../model/Image';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'; // https://github.com/react-native-image-picker/react-native-image-picker
import { useTailwind } from 'tailwind-rn';

function Photos({ flashMessage, filenamePrefix, addPhotoToParent, addPhotoNoteToParent }) {
  const tailwind = useTailwind();
  const [photos, setPhotos] = useState([]);
  const [photosNote, setPhotosNote] = useState('');

  const photoList = () => {
    if (photos.length == 0) {
      return (
        <Text style={tailwind('my-2')}>None selected yet.</Text>
      );
    } else {
      return photos.map(photo => (
        <Text style={tailwind('my-2')}> 📷 { photo.filename }</Text> // TODO allow for deletion
      ));
    }
  };

  const flash = () => {
    const message = flashMessage();
    if (message) return (
      <Text style={tailwind('my-2 text-blue')}>{message}</Text>
    );
  };

  const photoOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxWidth: 800,
    maxWidth: 800
  };

  const pickPhoto = async (action, source) => {
    try {
      const result = await action(photoOptions);
      handleImageData(result);
    } catch (error) {
      showMessage({
        message: `Failed to access ${source}.`,
        description: `${error}`,
        type: 'danger',
        icon: 'warning'
      });
    }
  };

  const handleImageData = (data) => {
    let i = 0;
    for (asset of data.assets) {
      i++;
      const image = Image(`${filenamePrefix()}-${i}`, asset.base64);
      setPhotos([...photos, image]);
      addPhotoToParent(image);
    }
  };

  return (
    <View>
      <InputGroup text='Pictures' />
      {flash()}
      {photoList()}
      <InputField
        text='Take photo with camera'
        textColor={'#cccccc'}
        action={() => pickPhoto(launchCamera, 'camera')} />
      <InputField
        text='Pick photo from gallery'
        textColor={'#cccccc'}
        action={() => pickPhoto(launchImageLibrary, 'image gallery')} />
      <TextField
        label='Or describe which picture(s) on whose camera:'
        value={photosNote}
        updateAction={setPhotosNote}
      />
    </View>
  );
}

export default Photos;
