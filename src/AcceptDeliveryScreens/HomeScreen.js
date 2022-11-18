import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import plus from '../../assets/car.png';

import React, {useEffect, useRef, useState} from 'react';
import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Colors} from '../../globals/Globals';
import pin from '../../assets/pin.png';
import profile from '../../assets/profileone.jpg';
import profileC from '../../assets/profiletwo.jpg';
import {mapStyle} from '../../models/CustomMap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import target from '../../assets/target.png';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import {
  findNearest,
  getDistance,
  getPreciseDistance,
  isPointWithinRadius,
} from 'geolib';
import {userCoords} from '../../models/UsersDummy';
import NewOrder from './NewOrder';
import {maps_api_key} from '../../globals/Apikey';

// import mapStyle from '../../models/MapData';

const HomeScreen = () => {
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Tuma',
          message:
            'To track deliveries,  ' + 'TUMA needs to Access your Location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // ToastAndroid.show(
        //   'Location Permissions Accepted',
        //   ToastAndroid.LONG,
        //   ToastAndroid.TOP,
        // );
      } else {
        ToastAndroid.show('Location Permissions Denied', ToastAndroid.LONG);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
      Geolocation.getCurrentPosition(
        position => {
          setDriverLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } //sort for iOS later
    // const getDriverLocation = async => {};
    // getDriverLocation();
  }, []);

  var userId = auth().currentUser.uid;
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [online, setOnline] = useState(false);
  const [freeRoam, setFreeRoam] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [driverLocation, setDriverLocation] = useState();
  const [deliveryId, setDeliveryId] = useState();
  const [drivers, setDrivers] = useState();
  const [deliveryCoords, setDeliveryCoords] = useState();

  const mylocation = userCoords;

  useEffect(() => {
    const subscriber = firestore()
      .collection('couriers')
      .doc(auth().currentUser.uid)
      .onSnapshot(documentSnapshot => {
        setUser(documentSnapshot.data());
      });
    return () => subscriber();
  }, []);

  useEffect(
    () => {
      try {
        // setMarkers([]);//this might work so that we clear first then update
        const subscriber = firebase
          .firestore()
          .collection('Deliveries')
          .orderBy('date', 'desc') //we want to get the latest order at all times
          .limit(1) //we want to only fetch one document at a time to avoid double allocations
          .onSnapshot(querySnapshot => {
            const markers = [];

            querySnapshot.forEach(doc => {
              markers.push({
                ...doc.data(),
                key: doc.id,
              });

              setDeliveryId(doc.id);
              firebase
                .firestore()
                .collection('couriers')
                .onSnapshot(querySnapshot => {
                  const coordinates = [];

                  querySnapshot.forEach(documentSnapshot => {
                    coordinates.push({
                      ...documentSnapshot.data().coordinate,
                    });
                  });

                  try {
                    var nearestDriver = findNearest(
                      doc.data().origin,
                      coordinates,
                    );
                    var checkRadius = isPointWithinRadius(
                      nearestDriver,
                      doc.data().origin, //check if driver is within 1 km radius
                      1000,
                    );
                  } catch (error) {
                    console.log(error);
                  }

                  // firestore()
                  //   .collection('couriers')
                  //   .where('coordinate', '==', nearestDriver) // the coordinates will match since we just fetched the values from firebase to get the nearest thus when we move down the chain the assumption is this will still be constant as it takes seconds
                  //   .get()
                  //   .then(querySnapshot => { //consider changing this to onsnapshot, might be faster
                  //     querySnapshot.forEach(matchSnapshot => {
                  //       console.log(matchSnapshot.data());

                  //       console.log(checkRadius);
                  //       if (
                  //         matchSnapshot.id === userId &&
                  //         checkRadius === true //here we check if the driverid matches that of the nearest driver based on the coordinates then check if it falls within the 1 km radius
                  //       ) {
                  //         console.log('Coords', nearestDriver);
                  //         // console.log('distance', cloudLocalDiff);
                  //         setMarkers(markers);
                  //         setLoading(false);
                  //       } else {
                  //         console.log('Not eligible');
                  //         // console.log('distance', cloudLocalDiff);
                  //       }
                  //     });
                  //   });
                  setMarkers(markers);
                  console.log(markers);
                  setDrivers(coordinates);
                });
            });
          });

        return () => subscriber();
      } catch (error) {
        console.log(error);
      }
    },
    [
      // markers
    ],
  );

  const toggleOnline = value => {
    setOnline(value);
  };

  const startTrip = () => {
    //send data to firebase to show acceptance
    try {
      firestore()
        .collection('Deliveries')
        .doc(deliveryId)
        .collection('courierAsssigned')
        .doc(userId)
        .set({
          name: auth().currentUser.displayName,
          riderId: userId,
          driverLocation: driverLocation,
        })
        .then(() => {
          updateStatus();
          navigation.navigate('Active', {
            markers,
            driverLocation,
            deliveryId,
          });
        });
      ToastAndroid.show('Order Accepted', ToastAndroid.LONG);
    } catch (error) {
      console.log('Failed to add data', error);
      ToastAndroid.show('Action not Successful', ToastAndroid.LONG);
    }
  };

  const updateStatus = () => {
    firestore()
      .collection('Deliveries')
      .doc(deliveryId)
      .update({
        deliverystatus: 'START',
      })
      .then(() => {
        console.log('Delivery Status updated!');
      });
  };

  const mapRef = React.useRef(null);

  const navigateToCurrentLocation = () => {
    mapRef.current.animateToRegion(
      {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        longitudeDelta: 0.02821,
        latitudeDelta: 0.0121,
      },
      2500,
    );
  };

  const edgePaddingValue = 60;
  const edgePadding = {
    top: 100,
    bottom: 100,
    left: edgePaddingValue,
    right: edgePaddingValue,
  };

  return (
    <SafeAreaView>
      {/* {markers.length == !0 ? ( */}

      {markers.map((marker, index) => {
        return (
          <MapView
            key={index}
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            onLayout={() => {
              mapRef.current?.fitToCoordinates(
                [marker.origin, marker.destination],
                {
                  edgePadding: {
                    top: 60,
                    bottom: Dimensions.get('window').height * 0.4,
                    left: 60,
                    right: 60,
                  },
                  animated: true,
                },
              );
            }}
            style={styles.map}
            customMapStyle={mapStyle}
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
              <View style={styles.pickupLocMarker}>
                <FontAwesome5
                  name="shipping-fast"
                  style={styles.pickupMarker}
                  size={15}
                />
              </View>
            </Marker>
            {online ? null : (
              <Marker
                coordinate={marker.destination} //change value to driver location if online
                onPress>
                <View style={styles.deliveryLocMarker}>
                  <MaterialIcons
                    name="my-location"
                    size={15}
                    style={styles.deliveryMarker}
                  />
                </View>
              </Marker>
            )}
            {online ? null : (
              <MapViewDirections
                apikey={maps_api_key}
                origin={marker.origin}
                destination={marker.destination}
                strokeWidth={2.5}
                onReady={result => {
                  setDistance(result.distance);
                  setTime(result.duration);
                }}
              />
            )}
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
      <TouchableOpacity
        style={styles.currentLocation}
        onPress={navigateToCurrentLocation}>
        <MaterialIcons
          name="my-location"
          size={30}
          style={styles.currentLocationIcon}
        />
      </TouchableOpacity>
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
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.carDetails}>Car: KVW 309Q</Text>
              </View>
              <View style={styles.balanceSection}>
                <Text style={styles.balanceTitle}>Account Balance</Text>
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

      {/* ) : (
        <View>
          <Text>Waiting</Text>
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default HomeScreen;

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
  currentLocation: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 100,
    elevation: 10,
  },
  currentLocationIcon: {
    color: Colors.mainColor,
  },
  pickupMarker: {
    color: Colors.background,
  },
  deliveryMarker: {
    color: Colors.background,
  },
  pickupLocMarker: {
    backgroundColor: Colors.mainColor,
    padding: 7,
    marginVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deliveryLocMarker: {
    backgroundColor: Colors.primary,
    padding: 7,
    marginVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
});
