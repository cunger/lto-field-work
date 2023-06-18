import React from 'react';
import { View, Text, TouchableOpacity, Image as RNImage } from 'react-native';
import { InputField, InputGroup } from './Input';
import TextField from './TextField';
import Image from '../../model/Image';
import { useTailwind } from 'tailwind-rn';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import GlobalContext from '../../context/GlobalContext';

function Photos({ flashMessage, photos, photosNote, photoFileName, addPhoto, removePhoto, setPhotosNote }) {
  const tailwind = useTailwind();
  const i18n = GlobalContext.i18n;

  const photoList = () => {
    if (photos.length == 0) {
      return (
        <Text style={tailwind('my-2')} key='none'>{ i18n.t('PICTURES_NONE_YET') }</Text>
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

  /**
   * Photos used in the data entries are stored in an app-specific separate folder.
   */
  const PHOTOS_FOLDER = `${FileSystem.documentDirectory || ''}photos`;

  async function initializeFolder() {
    const info = await FileSystem.getInfoAsync(PHOTOS_FOLDER);
    
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(PHOTOS_FOLDER, { intermediates: true });
    }
  }

  /**
   * Picking a photo from the media library.
   */
  const choosePhoto = async () => {
    try {
      const permissionResponse = await MediaLibrary.requestPermissionsAsync();
      if (permissionResponse.granted) {
        await initializeFolder();

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        for (const asset of (result?.assets || [])) {
          const newUri = `${PHOTOS_FOLDER}/${uuid.v4()}.jpg`;

          await FileSystem.copyAsync({ from: asset.uri, to: newUri })
          await addPhoto(createImage(newUri));
        }
      } else {
        throw new Error(i18n.t('ERROR_MISSING_PERMISSION'));
      }
    } catch (error) {
      showMessage({
        message: i18n.t('ERROR_FAILED_TO_ACCESS_GALLERY'),
        description: `${error}`,
        type: 'danger',
        icon: 'warning',
        duration: 3000
      });
    }
  };

  /**
   * Taking a picture with the camera.
   * The resulting asset is saved both in the media library and in an app-specific folder.
   * It is deleted from the latter folder after it hasbeen uploaded.
   */
  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.granted) {
        await initializeFolder();

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true
        });

        for (const asset of (result?.assets || [])) {
          try {
            const savedAsset = await MediaLibrary.createAssetAsync(asset.uri);
            const newUri = `${PHOTOS_FOLDER}/${uuid.v4()}.jpg`;

            await FileSystem.copyAsync({ from: savedAsset.uri, to: newUri })
            await addPhoto(createImage(newUri));
          } catch (error) {
            showMessage({
              message: i18n.t('ERROR_FAILED_TO_SAVE_PHOTO'),
              description: `${error}`,
              type: 'danger',
              icon: 'warning',
              duration: 3000
            });
          }
        }
      } else {
        throw new Error(i18n.t('ERROR_MISSING_PERMISSION'));
      }
    } catch (error) {
      showMessage({
        message: i18n.t('ERROR_FAILED_TO_ACCESS_CAMERA'),
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
      <InputGroup text={i18n.t('PICTURES')} />
        {flash()}
        {photoList()}
      <InputField
        text={i18n.t('PICTURES_TAKE_PHOTO')}
        textColor={'#cccccc'}
        action={() => takePhoto()} />
      <InputField
        text={i18n.t('PICTURES_CHOOSE_PHOTO')}
        textColor={'#cccccc'}
        action={() => choosePhoto()} />
      <TextField
        label={i18n.t('PICTURES_DESCRIBE')}
        numberOfLines={4}
        value={photosNote}
        updateAction={setPhotosNote}
      />
    </View>
  );
}

export default Photos;
