import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import dummy from '../../assets/dummy.png';
const PickImageScreen = () => {
  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <Text style={{marginBottom: 50, fontSize: 26, fontWeight: 'bold'}}>
        Welcome Jane
      </Text>
      <View style={{flexDirection: 'row', marginBottom: 50}}>
        <Image style={styles.dummyImage} source={dummy}></Image>
        <TouchableOpacity>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: 'orange',
              borderRadius: 100,
              position: 'absolute',
              marginBottom: -50,
            }}></View>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Text style={{padding: 5, fontWeight: 'bold', fontSize: 16}}>
          You're All Set
        </Text>
        <Text style={{padding: 5, fontSize: 12}}>
          Take a minute to upload a profile photo
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PickImageScreen;

const styles = StyleSheet.create({
  dummyImage: {
    height: 200,
    width: 200,
    borderRadius: 100,
    // marginBottom: 100,
  },
});
