import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainMenu from './app/components/navigation/MainMenu';
import GlobalContext from './app/components/context/GlobalContext';

export default function App() {
  useEffect(() => {
    GlobalContext.load();
  }, []);

  return (
    <NavigationContainer>
      <MainMenu />
    </NavigationContainer>
  );
}
