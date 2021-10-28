import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import SafeContainer from 'components/SafeContainer';
import InputLabel from 'components/forms/InputLabel';
import Datastore from 'components/data/LocalDatastore';
import { tailwind } from 'tailwind';

function Settings({ navigation }) {
  const [name, setName] = useState('Beach Hero');
  const [token, setToken] = useState('');

  const saveName = () => {
    Datastore.setUserName(name);
  };

  const saveToken = () => {
    // TODO: verify token
    Datastore.setUserToken(token);
  };

  const save = () => {
    saveName();
    saveToken();
    navigation.navigate('Home');
  };

  return (
    <SafeContainer>
      <View>
        <InputLabel text='User name' />
        <TextInput
          value={name}
          onChangeText={(value) => setName(value)}
          onEndEdition={saveName}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
      </View>

      <View>
        <InputLabel text='Token' />
        <TextInput
          value={token}
          onChangeText={(value) => setToken(value)}
          onEndEdition={saveToken}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
        <Text>
        The token is used for signing data entries. It needs to be verified.
        </Text>
      </View>

      <View style={tailwind('flex flex-row items-stretch my-6')}>
        <TouchableOpacity onPress={save} style={tailwind('px-4 py-2 mr-4 rounded-md bg-blue')}>
          <Text style={tailwind('text-sm text-white font-medium')}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeContainer>
  );
}

export default Settings;
