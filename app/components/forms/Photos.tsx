import React from 'react';
import { View, Text, TouchableOpacity, Image as RNImage, Platform } from 'react-native';
import { InputField, InputGroup } from './Input';
import TextField from './TextField';
import Image from '../../model/Image';
import { useTailwind } from 'tailwind-rn';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

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
      const permissionResponse = await MediaLibrary.requestPermissionsAsync();
      if (permissionResponse.granted) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        for (const asset of (result?.assets || [])) {
          if (!asset?.assetId) continue;
          const info = await MediaLibrary.getAssetInfoAsync(asset.assetId);
          if (!info?.localUri) continue;
          await addPhoto(createImage(info.localUri));
        }
      } else {
        // TODO what?
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
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        for (const asset of (result?.assets || [])) {
          try {
            if (!asset?.uri) continue;
            const savedAsset = await MediaLibrary.createAssetAsync(asset.uri);
            await addPhoto(createImage(savedAsset.uri));
          } catch (error) {
            showMessage({
              message: `Failed to save photo to your gallery.`,
              description: `${error}`,
              type: 'danger',
              icon: 'warning',
              duration: 3000
            });
          }
        }
      } else {
        // TODO what?
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

  const createImage = (uri: string) => {
    const uriparts = uri.split('.');
    const filetype = uriparts[uriparts.length - 1];
    const name = photoFileName(filetype).replaceAll(' ', '-');
    return new Image(name, uri);
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
