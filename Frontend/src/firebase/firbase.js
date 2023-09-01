import firebase from 'firebase/compat/app';  //get the functionality of that firebase library
import 'firebase/compat/firestore';          //get the database
import 'firebase/compat/auth'; 

const firebaseConfig = {
    apiKey: "AIzaSyBmXINKYAKSrZIs0Meq9slGmoJPLj0wdoA",
    authDomain: "ecommerce-7d8a8.firebaseapp.com",
    projectId: "ecommerce-7d8a8",
    storageBucket: "ecommerce-7d8a8.appspot.com",
    messagingSenderId: "868143784641",
    appId: "1:868143784641:web:4caf626aa283f4b8c52a40"
  };
  
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
  export const googleAuthProvider  = new firebase.auth.GoogleAuthProvider()
  