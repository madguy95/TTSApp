/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
// import {FontAwesome} from '@expo/vector-icons';
import * as React from 'react';
import {ColorSchemeName} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppPlay from '@root/views/AppPlay';
import Setting from '@root/views/Setting';
import DataRaw from '@root/views/DataRaw';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonHeader from '@root/components/header/ButtonHeader';

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
  const screenOption = ({route}: {route: any}) => ({
    tabBarIcon: ({
      focused,
      color,
      size,
    }: {
      focused: boolean;
      color: string;
      size: any;
    }) => {
      let iconName = '';

      if (route.name === 'Play') {
        iconName = focused ? 'musical-notes-outline' : 'musical-notes';
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
  });

  return (
    <Tab.Navigator screenOptions={screenOption}>
      <Tab.Screen
        name="Play"
        component={HomeScreen}
        options={{
          headerRight: () => {
            return <ButtonHeader />;
          },
        }}
      />
      <Tab.Screen name="Data" component={DataScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
