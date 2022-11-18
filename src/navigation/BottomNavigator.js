import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Animated, TouchableOpacity, Image} from 'react-native';
import React, {useRef} from 'react';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import plus from '../../assets/plus.png';
import {Colors} from '../../globals/Globals';
import HomeScreen from '../HomeScreen';
import MessagesScreen from '../MessagesScreen';
import ProfileScreen from '../ProfileScreen';
import AcceptDeliveryStack from './AcceptDeliveryStack';
import AccountStack from './AccountStack';
import NotificationsStack from './NotificationsStack';
// import NewDeliveryStack from './NewDeliveryStack';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        width: 55,
        height: 55,
        backgroundColor: '#E04D01',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        bottom: '50%',
      }}>
      {children}
    </View>
  </TouchableOpacity>
);
const BottomNavigator = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        // tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          position: 'absolute',
          height: 60,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: {
            width: 10,
            height: 10,
          },
          paddingHorizontal: 20,
        },
        tabBarLabelStyle: {
          color: Colors.text,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={AcceptDeliveryStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                position: 'absolute',
                // top: "50%",
              }}>
              <Icon
                name="home-outline"
                size={24}
                color={focused ? Colors.secondary : Colors.line}></Icon>
            </View>
          ),
        }}
        listeners={({navigation, route}) => ({
          //listener to update the indicator (Currently, this is not working as a result of nesting navigation in react native)
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          },
        })}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                position: 'absolute',
                // top: "50%",
              }}>
              <Icon
                name="mail-outline"
                size={24}
                color={focused ? Colors.secondary : Colors.line}></Icon>
            </View>
          ),
        }}
        listeners={({navigation, route}) => ({
          //listener to update the indicator (Currently, this is not working as a result of nesting navigation in react native)
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          },
        })}
      />

      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{
                position: 'absolute',
                // top: "50%",
              }}>
              <Icon
                name="person-outline"
                size={24}
                color={focused ? Colors.secondary : Colors.line}></Icon>
            </View>
          ),
        }}
        listeners={({navigation, route}) => ({
          //listener to update the indicator (Currently, this is not working as a result of nesting navigation in react native)
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

function getWidth() {
  let width = Dimensions.get('window').width;

  width = width - 70;

  return width / 5;
}

{
  /* <Tab.Screen
        name={'New order'}
        component={NeworderScreen}
        options={{
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: ({focused}) => (
            <Image
              source={plus}
              style={{
                width: 25,
                height: 25,
                tintColor: 'white',
              }}></Image>
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}

        // listeners={({ navigation, route }) => ({
        //   //listener to update the indicator
        //   tabPress: (e) => {
        //     Animated.spring(tabOffsetValue, {
        //       toValue: getWidth() * 2,
        //       useNativeDriver: true,
        //     }).start();
        //   },
        // })}
      ></Tab.Screen> */
}
