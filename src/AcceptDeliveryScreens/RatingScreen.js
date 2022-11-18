import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import profile from '../../assets/profileone.jpg';
import {Colors} from '../../globals/Globals';

const RatingScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainTitle}>Order Completed</Text>
      <Text style={styles.description}>Take a second to rate us!</Text>
      <Image style={styles.profileImage} source={profile} />
      <View style={{height: 200}}></View>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          // onPress ={savePayment} here we can get the amount to add and show to the user wallet and easily get the deductions (our earnings from delivery)
        >
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            SEND FEEDBACK
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text style={{paddingHorizontal: 15, fontSize: 14}}>
            Don't want to give feedback?
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                color: Colors.mainColor,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RatingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  profileImage: {
    height: 300,
    width: 300,
    borderRadius: 10,
    margin: 20,
  },
  continueButton: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.text,
    paddingVertical: 15,
  },
  description: {
    paddingVertical: 5,
  },
});
