import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './firebase/AuthProvider';

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  const {logout} = useContext(AuthContext);
  return (
    <View style={styles.mainContainer}>
      <Text>Welcome User HomeScreen {auth().currentUser.email}</Text>
      <TouchableOpacity
        onPress={() => {
          logout();
        }}
        style={{
          padding: 15,
          backgroundColor: 'blue',
          margin: 20,
        }}>
        <Text
          style={{
            color: 'white',
          }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
