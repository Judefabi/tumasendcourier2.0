import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from '../../globals/Globals';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AccountScreen from '../Account/AccountScreen';
import EditProfileScreen from '../Account/EditProfileScreen';
// import EditProfileScreen from '../ProfileScreen/EditProfileScreen.js';

const Stack = createStackNavigator();

export default function AccountStack() {
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
      <Stack.Screen name="Profile" component={AccountScreen} />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
