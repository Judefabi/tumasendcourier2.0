import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Colors} from '../../globals/Globals';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({navigation, route}) => {
  useEffect(() => {
    navigation.setOptions({
      title: route.params.client.name
        .split(' ')
        .map(function (word, index) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' '),
    });
  }, [navigation]);

  const {chatId, senderId, messageId, status} = route.params;
  const userId = auth().currentUser.uid;
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const [keyboardOffset, setKeyboardOffset] = useState(60);
  const [messages, setMessages] = useState();
  const [userMessage, setUserMessage] = useState();
  const [lastId, setLastId] = useState(messageId);

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('time', 'desc')
      .onSnapshot(querySnapshot => {
        const fetchedMessages = [];
        querySnapshot.forEach(documentSnapshot => {
          fetchedMessages.push({
            ...documentSnapshot.data(),
            messageId: documentSnapshot.id,
          });
        });
        setMessages(fetchedMessages);
        updateStatus();
      });

    return () => subscriber();
  }, []);

  const updateStatus = async () => {
    const collection = firebase
      .firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages');

    const newStatus = {
      status: 'seen',
    };

    collection
      .where('status', '!=', 'seen')
      .get()
      .then(querySnapshot => {
        let batch = firebase.firestore().batch();
        querySnapshot.forEach(doc => {
          if (doc.data().senderId !== userId) {
            //check if the current user is the one who sent the message. If not then update the status if true don't update the status. Only recipient can update status
            const docRef = collection.doc(doc.id);
            batch.update(docRef, newStatus);
          }
        });
        batch.commit().catch(e => console.log(e));
      });

    // collection
    //   .where('status', '!=', 'seen')
    //   .get()
    //   .then(response => {
    //     let batch = firebase.firestore().batch();
    //     response.docs.forEach(doc => {
    //       const docRef = collection.doc(doc.id);
    //       batch.update(docRef, newStatus);
    //     });
    //     batch.commit().then(() => {
    //       null;
    //     });
    //   });
  };

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
      setKeyboardOffset(0);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
      setKeyboardOffset(60);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const sendMessage = () => {
    Keyboard.dismiss();

    firestore()
      .collection('chats')
      .doc(chatId)
      .update({
        timeUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            text: userMessage,
            time: firebase.firestore.FieldValue.serverTimestamp(),
            senderId: userId,
            status: 'sent',
          })
          .catch(error => ToastAndroid.show(error, ToastAndroid.SHORT));

        setUserMessage('');
      });
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      <FlatList
        contentContainerStyle={{
          paddingTop: Dimensions.get('window').height * 0.17,
        }}
        style={styles.messagesList}
        inverted
        data={messages}
        renderItem={({item}) => (
          <View
            style={item.senderId === userId ? styles.sender : styles.recipient}>
            <Text
              style={
                item.senderId === userId
                  ? styles.senderText
                  : styles.recipientText
              }>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={[{bottom: keyboardOffset}, styles.chatInputView]}>
        <TouchableOpacity style={styles.inputButtons}>
          <FontAwesome name="camera" size={20} style={styles.inputIcons} />
        </TouchableOpacity>
        <TextInput
          value={userMessage}
          multiline
          style={styles.textInput}
          placeholder="Message"
          onChangeText={userMessage => setUserMessage(userMessage)}
        />
        <TouchableOpacity style={styles.inputButtons} onPress={sendMessage}>
          <FontAwesome name="send-o" size={20} style={styles.inputIcons} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  chatInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: 5,
    backgroundColor: Colors.background,
    width: Dimensions.get('window').width,
    marginHorizontal: 10,
    alignSelf: 'center',
    // paddingVertical: 10,
    elevation: 5,
    flex: 1,
  },
  sender: {
    marginVertical: 10,
    marginHorizontal: 10,
    maxWidth: Dimensions.get('window').width * 0.7,
    alignSelf: 'flex-end',
    backgroundColor: Colors.line,
    padding: 15,
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.line,
    // elevation: 1,
  },
  recipient: {
    marginVertical: 10,
    marginHorizontal: 10,
    maxWidth: Dimensions.get('window').width * 0.7,
    alignSelf: 'flex-start',
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.line,
    // elevation: 1,
  },
  senderText: {
    color: Colors.text,
    fontSize: 14,
  },
  recipientText: {
    color: Colors.text,
    fontSize: 14,
  },
  inputIcons: {
    marginHorizontal: 15,
    color: Colors.text,
  },
  textInput: {
    width: Dimensions.get('window').width * 0.65,
    backgroundColor: Colors.line,
    borderRadius: 5,
    paddingHorizontal: 5,
    maxHeight: 100,
    fontSize: 16,
  },
  inputButtons: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.17,
  },
});

// console.log('Your message last Id', senderId);
// console.log(keyboardOffset);

// var mychats = messages?.filter(chat => chat?.senderId !== userId);
//filter messages to get the client's messages ONLY then get the last message the client sent thereafter get the id for the last message and pass it to the update functionality once the user loads the chat screen to show that the user has read that chat
// console.log('My chats', lastMessageId, 'with message', mychats[0]);

// console.log('This is it', lastMessageId);

// useEffect(() => {
//   const sub = messages?.filter(chat => chat?.senderId !== userId)?.[0]
//     ?.messageId;
//   setLastId(sub);

//   return sub;
// }, [lastId]);

// firestore()
//         .collection('chats')
//         .doc(chatId)
//         .collection('messages')
//         .where('status', '!=', 'seen')
//         .onSnapshot(querySnapshot => {
//           querySnapshot.forEach(docSnapshot => {
//             console.log(docSnapshot.data());
//             firestore()
//               .collection('chats')
//               .doc(chatId)
//               .collection('messages')
//               .doc(docSnapshot.id)
//               .update({
//                 status: 'seen',
//               })
//               .then(() => {
//                 console.log('Status updated!');
//               });
//           });
//         });

//

// const updateAllFromCollection = async (collectionName) => {
//   const firebase = require('firebase-admin')

//   const collection = firebase.firestore().collection(collectionName)

//   const newStatus = {
//       message: 'hello world'
//   }

//   collection.where('message', '==', 'goodbye world').get().then(response => {
//       let batch = firebase.firestore().batch()
//       response.docs.forEach((doc) => {
//           const docRef = firebase.firestore().collection(collectionName).doc(doc.id)
//           batch.update(docRef, newStatus)
//       })
//       batch.commit().then(() => {
//           console.log(`updated all documents inside ${collectionName}`)
//       })
//   })
// }
