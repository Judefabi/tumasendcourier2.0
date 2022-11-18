import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import React, {useContext, useState} from 'react';
import google from '../../../assets/google.png';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../firebase/AuthProvider';
import {Colors} from '../../../globals/Globals';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const {login, googleLogin} = useContext(AuthContext);

  return (
    <View style={styles.mainContainer}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>Welcome back</Text>
        <Text style={{fontWeight: 'bold', fontSize: 26, color: '#251D3A'}}>
          TumaSend
          {/* get this name from local/async storage */}
        </Text>
      </View>
      <View style={{paddingVertical: 100, paddingHorizontal: 20}}>
        <View style={styles.coverView}>
          <Ionicons
            name="mail"
            size={25}
            color={Colors.line}
            style={{paddingVertical: 20}}
          />
          <TextInput
            autoComplete="email"
            value={email}
            onChangeText={email => setEmail(email)}
            style={styles.textInput}
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
            value={password}
            onChangeText={password => setPassword(password)}
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry></TextInput>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Reset Password')}>
          <Text style={{alignSelf: 'flex-end'}}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => login(email, password)}>
          <View>
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
          <Text style={{color: 'black'}}>Don't Have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#251D3A', fontWeight: 'bold'}}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

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
  },
});
