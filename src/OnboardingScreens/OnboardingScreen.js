import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {useNavigation} from '@react-navigation/native';
// import image from '../../assets/plus.png';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const replace = useNavigation();
  return (
    <Onboarding
      onDone={() => navigation.navigate('Login')}
      onSkip={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#fff',
          image: (
            <Image
              style={styles.image}
              source={require('../../assets/plus.png')}
            />
          ),
          title: 'Welcome',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              style={styles.image}
              source={require('../../assets/plus.png')}
            />
          ),
          title: 'Screen  Two',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              style={styles.image}
              source={require('../../assets/plus.png')}
            />
          ),
          title: 'Screen Three',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
      ]}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
