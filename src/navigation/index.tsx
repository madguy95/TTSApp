/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
// import {FontAwesome} from '@expo/vector-icons';
import * as React from 'react';
import {Text, View, ColorSchemeName} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import AppPlay from '../views/AppPlay';
import Setting from '../views/Setting';
import DataRaw from '../views/DataRaw';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import { ColorSchemeName, Pressable } from 'react-native';

// import Colors from '../constants/Colors';
// import useColorScheme from '../hooks/useColorScheme';
// import ModalScreen from '../screens/ModalScreen';
// import NotFoundScreen from '../screens/NotFoundScreen';
// import TabOneScreen from '../screens/TabOneScreen';
// import TabTwoScreen from '../screens/TabTwoScreen';
// import TabThreeScreen from '../screens/TabThreeScreen';
// import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
// import LinkingConfiguration from './LinkingConfiguration';

function HomeScreen() {
  return <AppPlay></AppPlay>;
}

function DataScreen() {
  return <DataRaw></DataRaw>;
}

function SettingsScreen() {
  return <Setting></Setting>;
}

const Tab = createBottomTabNavigator();

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {

  const screenOption = ({route}) => ({
    tabBarIcon: ({focused, color, size}) => {
      let iconName;

      if (route.name === 'Play') {
        iconName = focused
          ? 'musical-notes-outline'
          : 'musical-notes';
      } else if (route.name === 'Data') {
        iconName = focused ? 'browsers-outline' : 'browsers';
      } else if (route.name === 'Settings') {
        iconName = focused ? 'settings-outline' : 'settings';
      }

      // You can return any component that you like here!
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  })

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={screenOption}>
        <Tab.Screen name="Play" component={HomeScreen} />
        <Tab.Screen name="Data" component={DataScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
