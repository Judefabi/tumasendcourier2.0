import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../AuthenticationScreens/LoginStack/LoginScreen';
import RegistrationScreen from '../AuthenticationScreens/RegistrationScreen';
import OnboardingScreen from '../OnboardingScreens/OnboardingScreen';
import LoginStack from './LoginStack';

const Stack = createStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
  let routename;
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });

    GoogleSignin.configure({
      webClientId:
        '845115562717-oo9b7215dcjjim960r9gl1h29odqguge.apps.googleusercontent.com',
    });
  }, []);

  if (isFirstLaunch === null) {
    return null; //handle error message to show if
  } else if (isFirstLaunch === true) {
    routename = 'Onboarding';
  } else {
    routename = 'Login';
  }

  return (
    <Stack.Navigator
      initialRouteName={routename}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginStack} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
    </Stack.Navigator>
  );
  // }
};

export default AuthStack;

const styles = StyleSheet.create({});
