import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../firebase/AuthProvider';
// import image from '../../assets/profileone.jpg';
import {Colors} from '../../globals/Globals';

const AccountScreen = () => {
  //resolve image source for the dummy image
  const [image, setImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  var name = auth().currentUser.displayName;
  // const {user} = useContext(AuthContext);
  const choosePhotoFromGallery = () => {
    //introduce camera option in future
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        // console.log('image upload successful');
        setImage(image.path);
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff', padding: 15}}>
      {/* top section -user details */}
      <View style={styles.profileView}>
        <View flexDirection="row">
          {image !== null ? (
            <Image style={styles.userImg} source={{uri: image}} />
          ) : (
            <View style={styles.dummyView}>
              <Text style={styles.initials}>
                {name
                  .split(' ')
                  .map(function (word, index) {
                    return word.charAt(0).toUpperCase();
                  })
                  .join('')}
              </Text>
            </View>
          )}

          <TouchableOpacity onPress={choosePhotoFromGallery}>
            <View style={styles.edit}>
              <MaterialIcons name="edit" size={20} color={Colors.background} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{padding: 20}}>
          <Text style={styles.userName}>
            {/* //fetch name and convert to Titlecase */}

            {name
              // 'jude fabiano'
              .split(' ')
              .map(function (word, index) {
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              })
              .join(' ')}
          </Text>
          <Text style={styles.userEmail}>
            {
              // 'judefabiano99@gmail.com'
              auth().currentUser.email
            }
          </Text>
        </View>
      </View>
      {/* subsidiary info */}
      <View
        style={{
          backgroundColor: Colors.line,
          height: 0.2,
          width: '100%',
        }}></View>
      <View style={styles.centerView}>
        <View style={styles.cardView}>
          <Text>Orders</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileView: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  userImg: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: 'center',
    borderColor: Colors.line,
    borderWidth: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 15,
  },
  edit: {
    backgroundColor: Colors.text,
    position: 'absolute',
    height: 30,
    width: 30,
    borderRadius: 100,
    alightItems: 'center',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 35,
    color: Colors.background,
    fontWeight: 'bold',
  },
  dummyView: {
    height: 100,
    width: 100,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor,
  },
});
