import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from '../../globals/Globals';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AccountScreen from '../Account/AccountScreen';
import EditProfileScreen from '../Account/EditProfileScreen';
import NotificationsScreen from '../NotificationsScreens/NotificationsScreen';
import ChatScreen from '../NotificationsScreens/ChatScreen';
// import EditProfileScreen from '../ProfileScreen/EditProfileScreen.js';

const Stack = createStackNavigator();

export default function NotificationsStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          elevation: 0,
        },
        headerTintColor: Colors.text,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          alignSelf: 'center',
        },
      }}>
      <Stack.Screen name="Messages" component={NotificationsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
