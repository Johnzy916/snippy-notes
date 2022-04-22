import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDig8DfNeGCgisOf_BX15OvPnk5xGkN-IU",
  authDomain: "snippy-notes.firebaseapp.com",
  databaseURL: "https://snippy-notes.firebaseio.com",
  projectId: "snippy-notes",
  storageBucket: "snippy-notes.appspot.com",
  messagingSenderId: "48224930094",
  appId: "1:48224930094:web:3adfc8bcce5d1376c352bf"
}

// initialize firebase
firebase.initializeApp(firebaseConfig)

// fix firestore connection issues
firebase.firestore().settings({ experimentalForceLongPolling: true })

// authentication
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export {
    firebase,
    googleAuthProvider
}
