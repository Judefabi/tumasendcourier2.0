import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import plus from '../../assets/car.png';
import React, {useEffect, useRef, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Colors} from '../../globals/Globals';
import pin from '../../assets/pin.png';
import driverpin from '../../assets/bikep.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import target from '../../assets/target.png';
import {maps_api_key} from '../../globals/Apikey';
import {mapStyle} from '../../models/CustomMap';

// import mapStyle from '../../models/MapData';

const ActiveDeliveryScreen = ({route}) => {
  const {markers, driverLocation, deliveryId} = route.params;

  const navigation = useNavigation();
  const [online, setOnline] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [newDriverLocation, setNewDriverLocation] = useState(driverLocation);
  const [deliverystatus, setdeliverystatus] = useState();
  const [deliveryDetails, setDeliveryDetails] = useState();
  const [driverClose, setDriverClose] = useState(true);
  //   const [isDisabled, setIsDisabled] = useState(false);
  //   const [isCompleted, setIsCompleted] = useState(false);
  //   const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Deliveries')
      .doc(deliveryId)
      .onSnapshot(documentSnapshot => {
        setDeliveryDetails(documentSnapshot.data());
      });
    return () => subscriber();
  }, [deliveryId]);

  const mapRef = useRef(null);

  const toggleOnline = value => {
    setOnline(value);
    completeDelivery();
  };

  const updateStatus = status => {
    firestore()
      .collection('Deliveries')
      .doc(deliveryId)
      .update({
        deliverystatus: status,
      })
      .then(() => {
        console.log('Delivery Status updated!');
      });
  };

  const updateDriverLocation = () => {
    //remember to also update the riders location in riders collection
    firestore()
      .collection('Deliveries')
      .doc(deliveryId)
      .collection('courierAsssigned')
      .doc(auth().currentUser.uid)
      .update({
        driverLocation: newDriverLocation,
      })
      .then(() => {
        console.log('Driver Location updated!');
      });
  };

  const fitToCoords = (a, b) => {
    mapRef.current?.fitToCoordinates([a, b], {
      edgePadding: {
        top: 60,
        bottom: 200,
        left: 60,
        right: 60,
      },
      animated: true,
    });
  };

  const onButtonPressed = () => {
    if (deliveryDetails?.deliverystatus === 'START') {
      mapRef.current.animateToRegion({
        latitude: newDriverLocation.latitude,
        longitude: newDriverLocation.longitude,
        longitudeDelta: 0.009,
        latitudeDelta: 0.04,
      });
      fitToCoords(newDriverLocation, deliveryDetails.origin);
      updateStatus('TO_PICKUP');
    }
    if (deliveryDetails?.deliverystatus === 'TO_PICKUP') {
      mapRef.current.animateToRegion({
        latitude: newDriverLocation.latitude,
        longitude: newDriverLocation.longitude,
        longitudeDelta: 0.009,
        latitudeDelta: 0.04,
      });
      fitToCoords(newDriverLocation, deliveryDetails.destination);
      updateStatus('TO_DROP_OFF');
    }
    if (deliveryDetails?.deliverystatus === 'TO_DROP_OFF') {
      mapRef.current.animateToRegion({
        latitude: newDriverLocation.latitude,
        longitude: newDriverLocation.longitude,
        longitudeDelta: 0.009,
        latitudeDelta: 0.04,
      });
      // introduce if statement to check automatically change state once payment is confirmed from database
      updateStatus('AWAITING_PAYMENT');
    }
    if (deliveryDetails?.deliverystatus === 'AWAITING_PAYMENT') {
      updateStatus('COMPLETED');
    }
  };

  const renderButtonTitle = () => {
    if (deliveryDetails?.deliverystatus === 'START') {
      return 'GO TO PICKUP LOCATION';
    }
    if (deliveryDetails?.deliverystatus === 'TO_PICKUP') {
      return 'CONFIRM PICKUP';
    }
    if (deliveryDetails?.deliverystatus === 'TO_DROP_OFF') {
      return 'CONFIRM DELIVERY';
    }
    if (deliveryDetails?.deliverystatus === 'AWAITING_PAYMENT') {
      return 'Waiting for customer to confirm ...'; //automatically change state once payment is confirmed from database
    }
    if (deliveryDetails?.deliverystatus === 'COMPLETED') {
      return 'MARK COMPLETE';
    }
  };

  const renderStatus = () => {
    if (
      deliveryDetails?.deliverystatus === 'START' ||
      deliveryDetails?.deliverystatus === 'TO_PICKUP'
    ) {
      return 'PICKUP LOCATION: ';
    }

    if (deliveryDetails?.deliverystatus === 'TO_DROP_OFF') {
      return 'DROP OFF: ';
    }
    if (deliveryDetails?.deliverystatus === 'AWAITING_PAYMENT') {
      return 'PENDING'; //automatically change state once payment is confirmed from database
    }
    if (deliveryDetails?.deliverystatus === 'COMPLETED') {
      return 'COMPLETED SUCCESSFULLY!!';
    }
  };

  const renderLocation = () => {
    if (
      deliveryDetails?.deliverystatus === 'START' ||
      deliveryDetails?.deliverystatus === 'TO_PICKUP'
    ) {
      return 'PICKUP LOCATION: ';
    }

    if (deliveryDetails?.deliverystatus === 'TO_DROP_OFF') {
      return 'DROP OFF: ';
    }
    if (deliveryDetails?.deliverystatus === 'AWAITING_PAYMENT') {
      return 'PENDING'; //automatically change state once payment is confirmed from database
    }
    if (deliveryDetails?.deliverystatus === 'COMPLETED') {
      return 'COMPLETED SUCCESSFULLY!!';
    }
  };

  const disableButton = () => {
    if (deliveryDetails?.deliverystatus === 'START') {
      //start of the delivery the button is not disabled
      return false;
    }
    if (deliveryDetails?.deliverystatus === 'TO_PICKUP' && driverClose) {
      //if driver is proceeding to pickup and is close to pickup location within 100m radius button is not disabled
      return false;
    }
    if (deliveryDetails?.deliverystatus === 'TO_DROP_OFF' && driverClose) {
      //driver is proceeding to drop and is close to drop location not disabled
      return false;
    }
    if (deliveryDetails?.deliverystatus === 'AWAITING_PAYMENT') {
      //awaiting confirmation of payment by customer thus disable and will be shifted automatically to next state thus next button making it work like a loading screen
      return true;
    }
    if (deliveryDetails?.deliverystatus === 'COMPLETED') {
      //driver is proceeding to drop and is close to drop location not disabled
      return false;
    }
    return true;
  };

  const startDelivery = () => {};

  const confirmPayment = () => {
    //wait for online data showing customer has completed the delivery then call his function
    //navigate to delivery successful screen/you've been paid etc..
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      Geolocation.watchPosition(
        newPosition => {
          setNewDriverLocation({
            latitude: newPosition.coords.latitude,
            longitude: newPosition.coords.longitude,
          });
          // updateDriverLocation();
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 100, // update distance every 100m
        },
      );

      //   Geolocation.clearWatch(WatchID);
    } //sort for iOS later
  }, []);

  return (
    <View style={styles.container}>
      {markers.map((marker, index) => {
        return (
          <MapView
            ref={mapRef}
            // showsUserLocation
            followsUserLocation
            key={index}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={mapStyle}
            region={{
              latitude: newDriverLocation.latitude,
              longitude: newDriverLocation.longitude,
              //   longitudeDelta: 0.009,
              //   latitudeDelta: 0.04,
              longitudeDelta: 0.09,
              latitudeDelta: 0.04,
            }}>
            <Marker
              coordinate={{
                latitude: newDriverLocation.latitude,
                longitude: newDriverLocation.longitude,
              }}
              onPress>
              <Image source={driverpin} style={styles.driverPin} />
            </Marker>
            {deliveryDetails?.deliverystatus === 'TO_PICKUP' ||
            deliveryDetails?.deliverystatus === 'START' ? (
              <Marker coordinate={marker.origin} onPress>
                <Image source={pin} style={styles.locationPin} />
              </Marker>
            ) : (
              <Marker coordinate={marker.destination} onPress>
                <Image source={target} style={styles.locationPin} />
              </Marker>
            )}

            <MapViewDirections
              apikey={maps_api_key}
              strokeWidth={4}
              origin={{
                latitude: newDriverLocation.latitude,
                longitude: newDriverLocation.longitude,
              }}
              destination={
                deliveryDetails?.deliverystatus === 'TO_PICKUP' ||
                deliveryDetails?.deliverystatus === 'START'
                  ? {
                      latitude: marker.origin.latitude,
                      longitude: marker.origin.longitude,
                    }
                  : {
                      latitude: marker.destination.latitude,
                      longitude: marker.destination.longitude,
                    }
              }
              onReady={result => {
                if (result.distance <= 0.15) {
                  setDriverClose(true);
                }
                setDistance(result.distance);
                setTime(result.duration);
                updateDriverLocation();
                // updateDriverLocation(); check to see if update work with this or whenever the distance changes but in the location update section its more accurate and less costly
              }}
            />
          </MapView>
        );
      })}
      {markers.map((marker, index) => {
        return (
          <View key={index} style={styles.topComponent}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="ios-menu" size={30} color={Colors.background} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 10,
                }}>
                <View>
                  <Text style={styles.statusText}>{renderStatus()}</Text>
                  <Text style={styles.dropLocation}>
                    {deliveryDetails?.deliverystatus === 'START' ||
                    deliveryDetails?.deliverystatus === 'START'
                      ? marker.originName
                      : marker.destinationName}
                  </Text>
                </View>
                <View>
                  <Text style={styles.statusText}>
                    Time: {time.toFixed(0)} min
                  </Text>
                  <Text style={styles.dropLocation}>
                    Distance: {distance.toFixed(2)} km
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
      <View style={styles.bottomComponent}>
        {markers.map((marker, index) => {
          return (
            <View key={index}>
              <View style={styles.bottomTopSection}>
                <View style={styles.sideView}>
                  <Text style={styles.titleText}>Trip Amount</Text>
                  <Text style={styles.bigText}>Kshs. {marker.amount}</Text>
                </View>
                <View style={styles.sideView}>
                  <Text style={styles.titleText}>Payment Type</Text>
                  <Text style={styles.bigText}>Debit Card</Text>
                </View>
              </View>

              <Pressable onPress={onButtonPressed}>
                <View
                  style={
                    {
                      width: Dimensions.get('window').width * 0.9,
                      height: 50,
                      backgroundColor: disableButton
                        ? Colors.mainColor
                        : Colors.line,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginVertical: 10,
                    }
                    //   styles.button
                    //   backgroundColor: disableButton ? Colors.line : Colors.mainColor,
                  }>
                  <Text style={styles.completeText}>{renderButtonTitle()}</Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ActiveDeliveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: 50,
    height: 50,
  },
  driverPin: {
    width: 80,
    height: 50,
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
    backgroundColor: Colors.text,
    width: Dimensions.get('window').width * 0.95,
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  statusText: {
    paddingHorizontal: 15,
    color: Colors.background,
  },
  dropLocation: {
    paddingHorizontal: 15,
    color: Colors.line,
    fontSize: 12,
  },
  bottomComponent: {
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
  button: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    // backgroundColor: isDisabled ? Colors.line : Colors.mainColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  completeText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  bottomTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    paddingVertical: 5,
  },
});
