import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/auth'

// firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

// initialize firebase
firebase.initializeApp(firebaseConfig)
process.env.NODE_ENV === 'test' || firebase.analytics() // jest throwing unhandled rejection error

// fix firestore connection issues
firebase.firestore().settings({ experimentalForceLongPolling: true })

// authentication
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export {
    firebase,
    googleAuthProvider
}
