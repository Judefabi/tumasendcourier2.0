import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from '../firebase/AuthProvider';
import HomeScreen from '../HomeScreen';
import BottomNavigator from './BottomNavigator';

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? <BottomNavigator /> : <AuthStack />}
      {/* //change this to navigate */}
      {/* to login so user can log in first for security if need arises */}
    </NavigationContainer>
  );
};

export default Routes;

const styles = StyleSheet.create({});
