import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../globals/Globals';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const ChatList = ({chat, chatId}) => {
  var userId = auth().currentUser.uid;
  //   console.log(chat);
  const navigation = useNavigation();
  const [chatMessages, setChatMessages] = useState();

  //   console.log(
  //     'Fetched chats',
  //     chatMessages?.[0],
  //     'with Id',
  //     chatMessages?.[0].messageId,
  //   );
  var unreadCount = chatMessages?.filter(
    chat => chat?.status !== 'seen' && chat?.senderId !== userId,
  ).length;

  //   var mychats = chatMessages?.filter(chat => chat?.senderId === userId);
  // //   console.log(mychats?.[0]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      //   .orderBy('timeUpdated')
      .doc(chat.chatId)
      .collection('messages')
      .orderBy('time', 'desc')
      .onSnapshot(querySnapshot => {
        const textMessages = [];
        querySnapshot.forEach(documentSnapshot => {
          textMessages.push({
            ...documentSnapshot.data(),
            messageId: documentSnapshot.id,
          });
        });
        setChatMessages(textMessages);
      });

    return () => subscriber();
  }, []);

  const openChat = (chatId, client, messageId, senderId, status) => {
    navigation.navigate('Chat', {
      chatId,
      client,
      messageId,
      senderId,
      status,
    });
  };

  

  return (
    <TouchableOpacity
      key={chatId}
      style={styles.chatCard}
      onPress={() =>
        openChat(
          chat.chatId,
          chat.client,
          chatMessages?.[0]?.messageId,
          chatMessages?.[0]?.senderId,
          chatMessages?.[0]?.status,
        )
      }>
      {chat.client.photoUrl !== null ? (
        <View style={styles.dummyView}>
          <Text style={styles.initials}>
            {chat.client.name
              .split(' ')
              .map(function (word, index) {
                return word.charAt(0).toUpperCase();
              })
              .join('')}
          </Text>
        </View>
      ) : (
        <Image style={styles.avatar} source={{uri: chat.client.photoUrl}} />
      )}
      <View style={styles.midSection}>
        <Text style={styles.name}>
          {chat.client.name
            .split(' ')
            .map(function (word, index) {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ')}
        </Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0].text}
        </Text>
      </View>
      <View style={styles.endSection}>
        <Text>
          {chatMessages?.[0]?.time?.toDate().toLocaleTimeString().slice(0, 5)}
        </Text>
        {chatMessages?.[0].status === 'seen' ? (
          <View
            style={
              chatMessages?.[0].senderId === userId
                ? styles.readView
                : styles.notUser
            }>
            <Ionicons
              style={
                chatMessages?.[0].senderId === userId
                  ? styles.checkIcon
                  : styles.notUserCheck
              }
              name="checkmark-done"
              size={20}
            />
          </View>
        ) : (
          <View style={unreadCount !== 0 ? styles.unreadView : null}>
            <Text style={styles.unreadText}> {unreadCount} </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  chatCard: {
    width: Dimensions.get('window').width * 0.95,
    margin: 10,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.line,
    paddingVertical: 5,
  },
  avatar: {
    height: Dimensions.get('window').width * 0.15,
    width: Dimensions.get('window').width * 0.15,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: Colors.line,
  },
  midSection: {
    width: Dimensions.get('window').width * 0.6,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  initials: {
    fontSize: 25,
    color: Colors.background,
    fontWeight: 'bold',
  },
  dummyView: {
    height: Dimensions.get('window').width * 0.15,
    width: Dimensions.get('window').width * 0.15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderWidth: 0.5,
    borderColor: Colors.line,
  },
  endSection: {
    width: Dimensions.get('window').width * 0.2,
    alignItems: 'flex-end',
  },
  unreadView: {
    height: 20,
    width: 20,
    backgroundColor: Colors.mainColor,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  unreadText: {
    color: Colors.background,
  },
  readView: {
    height: 20,
    width: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  notUser: {
    height: 20,
    width: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  checkIcon: {
    color: Colors.primarytwo,
  },
  notUserCheck: {
    color: Colors.background,
  },
});
