import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import React, {useContext, useState} from 'react';
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';
import apple from '../../assets/apple.png';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../firebase/AuthProvider';
import {Colors} from '../../globals/Globals';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {register, googleLogin} = useContext(AuthContext);
  return (
    <View style={styles.mainContainer}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>Welcome</Text>
        <Text style={{fontWeight: 'bold', fontSize: 26, color: '#251D3A'}}>
          TumaSend
        </Text>
      </View>
      <View style={{paddingVertical: 50, paddingHorizontal: 20}}>
        <View style={styles.coverView}>
          <Ionicons
            name="person-outline"
            size={25}
            color={Colors.line}
            style={{paddingVertical: 20}}
          />
          <TextInput
            style={styles.textInput}
            value={fname}
            onChangeText={fname => setFname(fname)}
            placeholder="First Name"></TextInput>
        </View>
        <View style={styles.coverView}>
          <Ionicons
            name="person-outline"
            size={25}
            color={Colors.line}
            style={{paddingVertical: 20}}
          />
          <TextInput
            style={styles.textInput}
            value={lname}
            onChangeText={lname => setLname(lname)}
            placeholder="Second Name"></TextInput>
        </View>
        <View style={styles.coverView}>
          <Ionicons
            name="mail"
            size={25}
            color={Colors.line}
            style={{paddingVertical: 20}}
          />
          <TextInput
            autoComplete="email"
            style={styles.textInput}
            value={email}
            onChangeText={email => setEmail(email)}
            placeholder="example@mail.com"></TextInput>
        </View>
        <View style={styles.coverView}>
          <Fontisto
            name="locked"
            size={25}
            color={Colors.line}
            style={{paddingVertical: 20}}
          />
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={password => setPassword(password)}
            placeholder="at least 8 characters "
            secureTextEntry></TextInput>
        </View>
        <View style={styles.coverView}>
          <Fontisto
            name="locked"
            size={25}
            color={Colors.line}
            style={{paddingVertical: 20}}
          />
          <TextInput
            value={confirmPassword}
            style={styles.textInput}
            placeholder="Confirm Password"
            onChangeText={confirmPassword =>
              setConfirmPassword(confirmPassword)
            }
            secureTextEntry></TextInput>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => register(email, password, fname, lname)}>
          <View>
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 20,
                alignSelf: 'center',
                paddingVertical: 10,
                fontSize: 20,
              }}>
              Sign Up
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={{paddingVertical: 10}}>OR</Text>
        <TouchableOpacity
          onPress={() => googleLogin()}
          style={styles.googleButton}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Image style={{height: 30, width: 30}} source={google}></Image>
            <Text
              style={{
                color: '#251D3A',
                paddingHorizontal: 20,
                fontSize: 16,
                alignSelf: 'center',
              }}>
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', paddingVertical: 10}}>
          <Text style={{color: 'black'}}>Already Have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{color: '#251D3A', fontWeight: 'bold'}}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    paddingVertical: 20,
    backgroundColor: '#FFF',
  },
  textInput: {
    backgroundColor: '#FFF',
    paddingVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    // marginVertical: 10,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    flex: 1,
  },
  googleButton: {
    marginVertical: 10,
    backgroundColor: '#E7F6F2',
    width: '90%',
    borderRadius: 10,
    paddingVertical: 10,
  },
  mainButton: {
    backgroundColor: '#251D3A',
    width: '90%',
    borderRadius: 10,
    marginVertical: 10,
  },
  coverView: {
    flexDirection: 'row',
    width: '100%',
    // paddingVertical: 10
  },
});
