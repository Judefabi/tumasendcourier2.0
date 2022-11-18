import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import pin from '../../assets/pin.png';
import profile from '../../assets/profileone.jpg';
import profileC from '../../assets/profiletwo.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import target from '../../assets/target.png';
import {Colors} from '../../globals/Globals';
// import acceptTrip from '../firebase/Trip';

const NewOrder = ({markers, driverLocation, startTrip}) => {
  const navigation = useNavigation();
  var userId = auth().currentUser.uid;
  const _map = React.useRef(null);
  const [online, setOnline] = useState(false);
  const [freeRoam, setFreeRoam] = useState(false);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [deliveryId, setDeliveryId] = useState();
  const [drivers, setDrivers] = useState();
  const [deliveryCoords, setDeliveryCoords] = useState();

  const toggleOnline = value => {
    setOnline(value);
  };

  // const startTrip = acceptTrip(
  //   deliveryId,
  //   userId,
  //   driverLocation,
  //   // updateStatus,
  //   navigation,
  //   markers,
  // );

  return (
    <View style={styles.container}>
      {markers.map((marker, index) => {
        return (
          <MapView
            key={index}
            provider={PROVIDER_GOOGLE}
            ref={_map}
            style={styles.map}
            // customMapStyle={mapStyle}
            showsUserLocation={true}
            region={{
              latitude: online
                ? driverLocation.latitude //change to driver location if online
                : marker.origin.latitude,
              longitude: online
                ? driverLocation.longitude //change to driver location if online
                : marker.origin.longitude,
              longitudeDelta: 0.001,
              latitudeDelta: 0.04,
            }}>
            <Marker
              coordinate={online ? driverLocation : marker.origin} //change value to driver location if online
              onPress>
              <Image source={pin} style={styles.locationPin} />
            </Marker>
            <Marker
              coordinate={online ? marker.destination : marker.destination} //change value to driver location if online
              onPress>
              <Image source={target} style={styles.targetPin} />
            </Marker>
            <MapViewDirections
              apikey="AIzaSyAka7sIWrqMO568WM1X97LMQjHDLOCOo6c"
              origin={marker.origin}
              destination={marker.destination}
              strokeWidth={4}
              onReady={result => {
                setDistance(result.distance);
                setTime(result.duration);
              }}
            />
          </MapView>
        );
      })}

      <View style={styles.topComponent}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="ios-menu" size={30} color={Colors.text} />
        </TouchableOpacity>
        {online ? (
          <Text>{''}</Text>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>Trip Details:{''} </Text>
            <Text>
              {time.toFixed(0)} min, {''}
            </Text>
            <Text>{distance.toFixed(2)} km</Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {online ? (
            <Text style={{paddingHorizontal: 15}}>Online</Text>
          ) : (
            <Text style={{paddingHorizontal: 15}}>Offline</Text>
          )}

          <Switch value={online} onValueChange={toggleOnline} />
        </View>
      </View>
      {online ? (
        //if on freeroam i.e no job, we sho the person's profile. If selected for a job we show the order details instead
        <View style={styles.bottomProfileComponent}>
          <View style={styles.profileSection}>
            <View style={{width: Dimensions.get('window').width * 0.15}}>
              <Image source={profileC} style={styles.profileImage} />
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: Dimensions.get('window').width * 0.75,
              }}>
              <View style={styles.nameSection}>
                <Text style={styles.name}>John Doe</Text>
                <Text style={styles.carDetails}>Car: KVW 309Q</Text>
              </View>
              <View style={styles.balanceSection}>
                <Text style={styles.balanceTitle}>Balance</Text>
                <Text style={styles.balance}>Kshs. 1,750</Text>
              </View>
            </View>
          </View>
          <View style={styles.scoreSection}>
            <View style={styles.scoreRow}>
              <Ionicons
                name="checkmark-circle"
                size={25}
                color={Colors.background}
              />
              <Text style={styles.scoreValue}>97%</Text>
              <Text style={styles.scoreTitle}>Accepted</Text>
            </View>
            <View style={styles.scoreRow}>
              <Ionicons
                name="star-outline"
                size={25}
                color={Colors.background}
              />
              <Text style={styles.scoreValue}>4.8</Text>
              <Text style={styles.scoreTitle}>Rating</Text>
            </View>
            <View style={styles.scoreRow}>
              <Ionicons
                name="checkmark-circle"
                size={25}
                color={Colors.background}
              />
              <Text style={styles.scoreValue}>3%</Text>
              <Text style={styles.scoreTitle}>Cancelled</Text>
            </View>
          </View>
        </View>
      ) : (
        <View>
          {markers.map((marker, index) => {
            return (
              <View key={index} style={styles.bottomOrderComponent}>
                <View style={styles.profileSection}>
                  <View style={{width: Dimensions.get('window').width * 0.15}}>
                    <Image source={profile} style={styles.profileImage} />
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      width: Dimensions.get('window').width * 0.75,
                    }}>
                    <View style={styles.nameSection}>
                      <Text style={styles.name}>Jane Doe</Text>
                      <Text style={styles.carDetails}>Payment: Debit Card</Text>
                    </View>
                    <View style={styles.balanceSection}>
                      <Text style={styles.balanceTitle}>Est. Delivery Fee</Text>
                      <Text style={styles.balance}>Kshs. {marker.amount}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.locationSection}>
                  <View style={styles.locationView}>
                    <View style={styles.asideView}></View>
                    <View styles={styles.locationDetails}>
                      <View styles={styles.singleLocationView}>
                        <Text style={styles.locationTitle}>
                          Pickup Location
                        </Text>
                        <Text style={styles.locationName}>
                          {marker.originName}
                        </Text>
                      </View>
                      <View style={styles.line}></View>
                      <View style={styles.singleLocationView}>
                        <Text style={styles.locationTitle}>
                          Delivery Location
                        </Text>
                        <Text style={styles.locationName}>
                          {marker.destinationName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.buttonSection}>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={toggleOnline}>
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={startTrip}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    tintColor: '#251D3A',
  },
  locationPin: {
    width: 40,
    height: 40,
    // borderRadius: 100,
    // backgroundColor: '#7F8487',
  },
  targetPin: {
    width: 60,
    height: 60,
    // borderRadius: 100,
    // backgroundColor: '#7F8487',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  topComponent: {
    position: 'absolute',
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: Dimensions.get('window').width * 0.95,
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'space-between',
  },
  bottomProfileComponent: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width * 0.95,
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'space-between',
  },
  bottomOrderComponent: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width * 0.95,
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  profileSection: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  carDetails: {
    fontSize: 14,
    fontWeight: '300',
  },
  nameSection: {
    paddingHorizontal: 10,
  },
  balanceTitle: {},
  balanceSection: {},
  balance: {
    fontWeight: '800',
  },
  scoreSection: {
    backgroundColor: Colors.text,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    justifyContent: 'space-evenly',
  },
  scoreRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // width: Dimensions.get('window').width * 0.2,
  },
  scoreTitle: {},
  scoreValue: {
    color: Colors.background,
  },
  scoreTitle: {
    color: '#7D9D9C',
  },
  locationSection: {
    marginVertical: 20,
  },
  locationView: {
    flexDirection: 'row',
  },
  asideView: {
    width: '20%',
    paddingHorizontal: 10,
  },
  locationDetails: {
    marginHorizontal: 10,
    width: '80%',
  },
  singleLocationView: {},
  locationTitle: {
    fontSize: 14,
    fontWeight: '300',
  },
  locationName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '400',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.line,
    marginVertical: 15,
  },
  buttonSection: {
    marginVertical: 5,
    flexDirection: 'row',
    width: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  declineButton: {
    borderWidth: 1,
    borderColor: Colors.mainColor,
    width: Dimensions.get('window').width * 0.4,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
  },
  acceptButton: {
    borderWidth: 1,
    width: Dimensions.get('window').width * 0.4,
    // marginHorizontal: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
  },
  acceptText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  declineText: {
    color: Colors.mainColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
