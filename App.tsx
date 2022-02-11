import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import MainMenu from './app/components/navigation/MainMenu';
import GlobalContext from './app/components/context/GlobalContext';
import { TailwindProvider } from 'tailwind-rn';
import utilities from './tailwind.json';

export default function App() {
  useEffect(() => {
    GlobalContext.load();
  }, []);

  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <MainMenu />
        <FlashMessage position="top" />
      </NavigationContainer>
    </TailwindProvider>
  );
}
