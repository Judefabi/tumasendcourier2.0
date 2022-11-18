import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              //add new use to client's collection in firestore
              .then(() => {
                firestore()
                  .collection('couriers')
                  .doc(auth().currentUser.uid)
                  .set({
                    id: auth().currentUser.uid,
                    name: auth().currentUser.displayName,
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  .catch(error => {
                    console.log('Error adding courier to firestore:', error);
                  });
              })
              .catch(error => {
                console.log('Signup error:', error);
              });
          } catch (error) {
            console.log(error);
          }
        },
        register: async (email, password, fname, lname) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              //add the new user to a clients collection in firestore
              .then(() => {
                firestore()
                  .collection('couriers')
                  .doc(auth().currentUser.uid)
                  .set({
                    id: auth().currentUser.uid,
                    name: fname + ' ' + lname,
                    email: email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  .catch(error => {
                    console.log('Error adding courier to firestore:', error);
                  });
              })
              .catch(error => {
                console.log('Signup error:', error);
              });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
