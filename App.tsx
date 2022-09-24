/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppPlay from './src/views/AppPlay';
import {NativeBaseProvider} from 'native-base';
import {useContext} from 'react';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import {ReferenceDataContextProvider} from './src/storage/ReferenceDataContext';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReferenceDataContextProvider>
        <NativeBaseProvider>
          <Navigation colorScheme={colorScheme} />
        </NativeBaseProvider>
      </ReferenceDataContextProvider>
    </NavigationContainer>
  );
}