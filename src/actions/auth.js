import {
    firebase,
    googleAuthProvider,
} from '../firebase/firebase'

export const startLogin = () => {
    return async () => {
      try {
        await firebase.auth().signInWithPopup(googleAuthProvider);
      }
      catch(error) {
        var errorMessage = error.message;
        console.log('Error logging in: ', errorMessage)
      }
    }
}

export const startLogout = () => {
    return (dispatch) => {
      try {
        firebase.auth().signOut();
        dispatch(logout());
        dispatch({ type: 'RESET_APP' })
      } catch (error) {
        console.log('Error logging out: ', error)
      }
    }
}

export const login = (uid) => ({
  type: 'LOGIN',
  uid
})

export const logout = () => ({
  type: 'LOGOUT'
})