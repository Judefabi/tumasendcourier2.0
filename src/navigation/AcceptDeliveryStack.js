import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HomeScreen from '../AcceptDeliveryScreens/HomeScreen';
import PaymentSuccessScreen from '../AcceptDeliveryScreens/PaymentSuccessScreen';
import RatingScreen from '../AcceptDeliveryScreens/RatingScreen';
import ActiveDeliveryScreen from '../AcceptDeliveryScreens/ActiveDeliveryScreen';

const Stack = createStackNavigator();

const AcceptDeliveryStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="Active" component={ActiveDeliveryScreen} />
      <Stack.Screen name="Payment" component={PaymentSuccessScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
    </Stack.Navigator>
  );
};

export default AcceptDeliveryStack;

const styles = StyleSheet.create({});
