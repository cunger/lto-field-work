import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { InputLabel } from '../components/forms/Input';
import Datastore from '../components/data/LocalDatastore';
import { useTailwind } from 'tailwind-rn';
import SafeContainer from '../components/SafeContainer';

function Settings({ navigation }) {
  const tailwind = useTailwind();

  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      setName(await Datastore.getUserName());
      setToken(await Datastore.getUserToken());
      setEmail(await Datastore.getUserEmail());
      // setVerified((await Datastore.getUserVerified()) == 'true');

      return () => {
        setName(name);
        setToken(token);
        setEmail(email);
      };
    })();
  }, []);

  const saveName = () => {
    Datastore.setUserName((name || '').trim());
  };

  const saveToken = () => {
    Datastore.setUserToken((token || '').trim());
  };

  const saveEmail = () => {
    Datastore.setUserEmail((email || '').trim());
  };

  const save = () => {
    saveName();
    saveToken();
    saveEmail();
    // if (name && token) {
    //   TokenHandler.verify(name, token).then(status => {
    //     setVerified(status);
    //     Datastore.setUserVerified(status);
    //   });
    // }
    navigation.navigate('Dashboard');
  };

  const clearStorage = async () => {
    await Datastore.clearAll();
  };

  return (
    <SafeContainer>
      <View>
        <InputLabel text='User name' />
        <TextInput
          value={name}
          onChangeText={(value) => { setName(value); }}
          onEndEdition={saveName}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
      </View>

      <View>
        <InputLabel text='Email (so we can get in touch)' />
        <TextInput
          value={email}
          onChangeText={(value) => { setEmail(value); }}
          onEndEdition={saveEmail}
          style={tailwind('mb-4 p-2 bg-white border-gray rounded-md')}
        />
      </View>

      <View>
        <InputLabel text='Token' />
        <TextInput
          value={token}
          onChangeText={(value) => { setToken(value); }}
          onEndEdition={saveToken}
          style={tailwind('mb-4 p-2 bg-white border-gray rounded-md')}
        />
        <Text>The token is used for signing data entries. You can get one from the Love The Oceans staff.</Text>
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
