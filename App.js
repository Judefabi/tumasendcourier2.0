import SplashScreen from 'react-native-splash-screen';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import Providers from './src/navigation/index.js';
import Providers from './src/navigation/index';
import AuthStack from './src/navigation/AuthStack';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Tuma',
          message: 'TUMA needs to Access your Location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.show(
          'TumaSend is accessing Location',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      } else {
        ToastAndroid.show('Location Permissions Denied', ToastAndroid.LONG);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    }
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Providers />
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
