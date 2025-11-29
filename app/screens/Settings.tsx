import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { InputLabel } from '../components/forms/Input';
import Datastore from '../components/data/LocalDatastore';
import GlobalContext from '../context/GlobalContext';
import SelectField from '../components/forms/SelectField';
import { SafeAreaView } from 'react-native-safe-area-context';

function Settings({ navigation }) {
  const i18n = GlobalContext.i18n;

  const [language, setLanguage] = useState('en');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      GlobalContext.load();

      setLanguage(await GlobalContext.language());
      setName(await Datastore.getUserName() || '');
      setToken(await Datastore.getUserToken() || '');
      setEmail(await Datastore.getUserEmail() || '');

      return () => {
        setLanguage(language);
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
    navigation.navigate('Dashboard');
  };

  const switchLanguageTo = (language: string) => {
    GlobalContext.switchTo(language);
    i18n.locale = language; // Just to make sure.
    setLanguage(language);
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-1 mb-2">
        <InputLabel text={i18n.t('SETTINGS_LANGUAGE')} />
        <SelectField
            value={language}
            items={[
              { label: `🇬🇧 ${i18n.t('LANGUAGE_EN')}`, value: 'en', key: 'en' },
              { label: `🇲🇿 ${i18n.t('LANGUAGE_PT')}`, value: 'pt', key: 'pt' },
            ]}
            updateAction={(value: string) => {
              if (value) switchLanguageTo(value);
            }}
          />
      </View>

      <View>
        <InputLabel text={i18n.t('SETTINGS_USER_NAME')} />
        <TextInput
          value={name}
          onChangeText={(value) => { setName(value); }}
          onEndEditing={saveName}
          className="mb-2 p-2 bg-white border-gray rounded-md"
        />
      </View>

      <View>
        <InputLabel text={i18n.t('SETTINGS_EMAIL')} />
        <TextInput
          value={email}
          onChangeText={(value) => { setEmail(value); }}
          onEndEditing={saveEmail}
          className="mb-4 p-2 bg-white border-gray rounded-md"
        />
      </View>

      <View>
        <InputLabel text={i18n.t('SETTINGS_TOKEN')} />
        <TextInput
          value={token}
          onChangeText={(value) => { setToken(value); }}
          onEndEditing={saveToken}
          className="mb-4 p-2 bg-white border-gray rounded-md"
        />
        <Text>{i18n.t('SETTINGS_TOKEN_EXPLANATION')}</Text>
      </View>

      <View className="flex flex-row items-stretch my-6">
        <TouchableOpacity onPress={save} className="px-4 py-2 mr-4 rounded-md bg-blue">
          <Text className="text-sm text-white font-medium">
            {i18n.t('BUTTON_SAVE')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Settings;
