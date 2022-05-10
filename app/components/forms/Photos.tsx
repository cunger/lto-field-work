import React, { useState } from 'react';
import { ScrollView, View, Text, Button, TouchableOpacity, Platform } from 'react-native';
import { InputLabel, InputField, InputGroup } from './Input';
import TextField from './TextField';
import Image from '../../model/Image';
import * as ImagePicker from 'expo-image-picker';
import { useTailwind } from 'tailwind-rn';
import { showMessage } from 'react-native-flash-message';

function Photos({ flashMessage, filenamePrefix, photoNames, photosNote, addPhoto, setPhotosNote }) {
  const tailwind = useTailwind();

  const photoList = () => {
    if (photoNames.length == 0) {
      return (
        <Text style={tailwind('my-2')} key='none'>None selected yet.</Text>
      );
    } else {
      return photoNames.map(name => (
        <Text style={tailwind('my-2')} key={name}> 📷 { name }</Text> // TODO allow for deletion
      ));
    }
  };

  const flash = () => {
    const message = flashMessage();
    if (message) return (
      <Text style={tailwind('my-2 text-blue')}>{message}</Text>
    );
  };

  const pickPhoto = async (action, source) => {
    try {
      const result = await action({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        base64: true,
        quality: 1,
      });

      addPhoto(result);
    } catch (error) {
      showMessage({
        message: `Failed to access ${source}.`,
        description: `${error}`,
        type: 'danger',
        icon: 'warning'
      });
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
        action={() => pickPhoto(ImagePicker.launchCameraAsync, 'camera')} />
      <InputField
        text='Pick photo from gallery'
        textColor={'#cccccc'}
        action={() => pickPhoto(ImagePicker.launchImageLibraryAsync, 'gallery')} />
      <TextField
        label='Or describe which picture(s) on whose camera:'
        value={photosNote}
        updateAction={setPhotosNote}
      />
    </View>
  );
}

export default Photos;
