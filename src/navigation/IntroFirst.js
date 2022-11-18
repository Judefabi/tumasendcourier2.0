import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import StartScreen from '../AuthenticationScreens/StartScreen';
import LoginScreen from '../AuthenticationScreens/LoginScreen';
import RegistrationScreen from '../AuthenticationScreens/RegistrationScreen';
import OnboardingScreen from '../OnboardingScreens/OnboardingScreen';

const Stack = createStackNavigator();

const IntroFirst = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Intro" component={OnboardingScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
    </Stack.Navigator>
  );
};

export default IntroFirst;

const styles = StyleSheet.create({});
