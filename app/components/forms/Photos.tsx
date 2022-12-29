import React from 'react';
import { View, Text, TouchableOpacity, Image as RNImage, Platform } from 'react-native';
import { InputField, InputGroup } from './Input';
import TextField from './TextField';
import Image from '../../model/Image';
import { useTailwind } from 'tailwind-rn';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { ImagePickerAsset } from 'expo-image-picker';

function Photos({ flashMessage, photos, photosNote, photoFileName, addPhoto, removePhoto, setPhotosNote }) {
  const tailwind = useTailwind();

  const photoList = () => {
    if (photos.length == 0) {
      return (
        <Text style={tailwind('my-2')} key='none'>None yet.</Text>
      );
    } else {
      return (
        <View style={tailwind('flex flex-row flex-wrap my-2')}>
        {photos.map((image: Image) => (
          <View key={image.filename} style={tailwind('mx-2 my-1 flex flex-row items-start justify-start')}>
            <RNImage source={{ uri: image.location }} style={{ width: 60, height: 60, borderRadius: 5 }} /> 
            <TouchableOpacity 
              onPress={() => removePhoto(image)}
              style={tailwind('px-1 py-1 mx-1 border border-gray-300 rounded-md bg-white')}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      );
    }
  };

  const flash = () => {
    const message = flashMessage();
    if (message) return (
      <Text style={tailwind('my-2 text-blue')}>{message}</Text>
    );
  };

  const choosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      for (const asset of (result?.assets || [])) {
        await addPhoto(createImage(asset));
      }
    } catch (error) {
      showMessage({
        message: `Failed to access gallery.`,
        description: `${error}`,
        type: 'danger',
        icon: 'warning',
        duration: 3000
      });
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      for (const asset of (result?.assets || [])) {
        try {
          await MediaLibrary.saveToLibraryAsync(asset.uri);
        } catch (error) {
          showMessage({
            message: `Failed to save photo to your gallery. It will only be stored locally in this app.`,
            description: `${error}`,
            type: 'danger',
            icon: 'warning',
            duration: 4000
          });
        }

        await addPhoto(createImage(asset));
      }
    } catch (error) {
      showMessage({
        message: `Failed to access camera.`,
        description: `${error}`,
        type: 'danger',
        icon: 'warning',
        duration: 3000
      });
    }
  };

  const createImage = (asset: ImagePickerAsset) => {
    const uriparts = asset.uri.split('.');
    const filetype = uriparts[uriparts.length - 1];
    const name = photoFileName(filetype).replaceAll(' ', '-');
    return new Image(name, asset.uri);
  };

  return (
    <View>
      <InputGroup text='Pictures' />
        {flash()}
        {photoList()}
      <InputField
        text='Take photo with camera'
        textColor={'#cccccc'}
        action={() => takePhoto()} />
      <InputField
        text='Pick photo from gallery'
        textColor={'#cccccc'}
        action={() => choosePhoto()} />
      <TextField
        label='Or describe which picture(s) on whose camera:'
        numberOfLines={4}
        value={photosNote}
        updateAction={setPhotosNote}
      />
    </View>
  );
}

export default Photos;
