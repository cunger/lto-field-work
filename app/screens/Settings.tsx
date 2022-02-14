import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { InputLabel, InputField } from '../components/forms/Input';
import SafeContainer from '../components/SafeContainer';
import Datastore from '../components/data/LocalDatastore';
import Backend from '../components/data/API';
import { useTailwind } from 'tailwind-rn';

function Settings({ navigation }) {
  const tailwind = useTailwind();
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    (async () => {
      setName(await Datastore.getUserName());
      setToken(await Datastore.getUserToken());
      setVerified((await Datastore.getUserVerified()) == 'true');
      setEmail(await Datastore.getUserEmail());
    })();
  }, []);

  const saveName = () => {
    Datastore.setUserName(name);
  };

  const saveToken = () => {
    Datastore.setUserToken(token);
  };

  const saveEmail = () => {
    Datastore.setUserEmail(email);
  };

  const save = () => {
    saveName();
    saveToken();
    saveEmail();
    if (name && token) {
      Backend.verify(name, token).then(status => {
        setVerified(status);
        Datastore.setUserVerified(status);
      });
    }
    // navigation.navigate('Home');
  };

  return (
    <SafeContainer>
      <View>
        <InputLabel text='User name' />
        <TextInput
          value={name}
          onChangeText={(value) => { setName(value); setVerified(false); }}
          onEndEdition={saveName}
          style={tailwind('mb-2 p-2 bg-white border-gray rounded-md')}
        />
      </View>

      <View>
        <InputLabel text='Email (so we can get in touch)' />
        <TextInput
          value={email}
          onChangeText={(value) => { setEmail(value); setVerified(false); }}
          onEndEdition={saveEmail}
          style={tailwind('mb-4 p-2 bg-white border-gray rounded-md')}
        />
      </View>

      <View>
        <InputLabel text='Token' />
        <TextInput
          value={token}
          onChangeText={(value) => { setToken(value); setVerified(false); }}
          onEndEdition={saveToken}
          style={tailwind('mb-4 p-2 bg-white border-gray rounded-md')}
        />
        <Text>The token is used for signing data entries. You can get one from the Love The Oceans staff.</Text>
      </View>

      <View>
        <Text style={tailwind('my-2')}>
          {token == '' ? '' : (verified ? 'Your token is verified. ✅' : 'Your token is not yet verified.')}
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
