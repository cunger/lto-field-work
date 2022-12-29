import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

  const [showSelectedImageModal, setShowSelectedImageModal] = useState(false);
  const [selectedImageURI, setSelectedImageURI] = useState(undefined);

  const photoList = () => {
    // <TouchableOpacity onPress={() => openPhoto(image.location)} style={tailwind('px-2 border border-gray-300 rounded-md bg-white')}>
    //   <Text style={tailwind('my-2')} key={image.filename}>{image.filename}</Text> 
    // </TouchableOpacity>
    
    if (photos.length == 0) {
      return (
        <Text style={tailwind('my-2')} key='none'>None yet.</Text>
      );
    } else {
      return photos.map((image: Image) => (
        <View key={image.filename} style={tailwind('flex flex-row items-center justify-between my-2')}>
          <Text style={tailwind('my-2')} key={image.filename}>{image.filename}</Text> 
          <TouchableOpacity onPress={() => removePhoto(image)} style={tailwind('w-10 px-2 py-2 border border-gray-300 rounded-md bg-white')}>
            <Text>❌</Text>
          </TouchableOpacity>
        </View>
      ));
    }
  };

  const flash = () => {
    const message = flashMessage();
    if (message) return (
      <Text style={tailwind('my-2 text-blue')}>{message}</Text>
    );
  };

  const openPhoto = (imageUri: string) => {
    setSelectedImageURI(imageUri);
    setShowSelectedImageModal(true);
  };

  const choosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: true,
        quality: 1,
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
        allowsEditing: true,
        quality: 1,
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
