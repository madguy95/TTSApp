/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';

import {NativeBaseProvider} from 'native-base';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import {ReferenceDataContextProvider} from './src/storage/ReferenceDataContext';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import CacheHandler from './src/components/CacheHandler';
import LottieSplashScreen from "react-native-lottie-splash-screen";

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    LottieSplashScreen.hide(); // here
  }, []);

  return (
    <NavigationContainer
      theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <ReferenceDataContextProvider>
        <NativeBaseProvider>
          <CacheHandler />
          <Navigation colorScheme={colorScheme} />
        </NativeBaseProvider>
      </ReferenceDataContextProvider>
    </NavigationContainer>
  );
}
