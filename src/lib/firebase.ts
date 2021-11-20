import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    //
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const getMessageDocRef = async () =>
    firebase.firestore().collection('messages').doc();

export const getUserId = async () => {
    const userCredential = await firebase.auth().signInAnonymously();
    return userCredential.user?.uid;
}
