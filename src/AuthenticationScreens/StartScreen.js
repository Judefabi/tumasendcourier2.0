import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const StartScreen = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        height: '100%',
        marginTop: 100,
      }}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>Welcome</Text>
        <Text style={{fontWeight: 'bold', fontSize: 26, color: '#251D3A'}}>
          TumaSend
        </Text>
      </View>
      <View style={{height: '70%'}}></View>
      <View
        style={{backgroundColor: '#251D3A', width: '90%', borderRadius: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate('Drawer')}>
          <Text
            style={{
              color: 'white',
              paddingHorizontal: 20,
              alignSelf: 'center',
              paddingVertical: 10,
              fontSize: 20,
            }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', paddingVertical: 10}}>
        <Text style={{color: 'black'}}>Don't Have Account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{color: '#251D3A', fontWeight: 'bold'}}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({});
