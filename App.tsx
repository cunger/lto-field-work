import './global.css';

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import MainMenu from './app/components/navigation/MainMenu';
import GlobalContext from './app/context/GlobalContext';

// Patch for libraries that still use the deprecated removeEventListener.
import { BackHandler } from 'react-native';
if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = () => {};
}

export default function App() {
  useEffect(() => {
    GlobalContext.load();
    
    return () => {
      GlobalContext.unsubscribeAll();
    }
  }, []);

  return (
    <NavigationContainer>
      <MainMenu />
      <FlashMessage position='top' />
    </NavigationContainer>
  );
}
