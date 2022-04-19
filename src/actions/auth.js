import {
    firebase,
    googleAuthProvider,
} from '../firebase/firebase'

export const startLogin = (e, type) => {
    return async () => {
      try {
        if (type == 'google') {
          await firebase.auth().signInWithPopup(googleAuthProvider);
        } else {
          await firebase.auth().signInWithEmailAndPassword(e.target.elements.email.value,e.target.elements.password.value);
        }
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