import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from '../../globals/Globals';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import ResetPassword from '../AuthenticationScreens/LoginStack/ResetPassword';
import LoginScreen from '../AuthenticationScreens/LoginStack/LoginScreen';
// import EditProfileScreen from '../ProfileScreen/EditProfileScreen.js';

const Stack = createStackNavigator();

export default function LoginStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Loginscreen" component={LoginScreen} />
      <Stack.Screen name="Reset Password" component={ResetPassword} />
    </Stack.Navigator>
  );
}
