import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import AppRouter, { history } from './routers/AppRouter';
import { positions, Provider as AlertProvider } from 'react-alert';
import ReactAlertTemplate from './components/ReactAlertTemplate';
import store from './store/configureStore';
import { login, logout } from './actions/auth';
import { dispatchData } from './actions/init';
import LoadingPage from './components/LoadingPage';
import { firebase } from './firebase/firebase';
import './styles/styles.scss'
import 'react-dropdown/style.css'

// React alert box config
const alertBoxConfig = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000
}

// app root
const appJsx = (
  <Provider store={store}>
    <AlertProvider template={ReactAlertTemplate} {...alertBoxConfig}>
      <AppRouter />
    </AlertProvider>
  </Provider>
);
const appRoot = document.getElementById('app');

let hasRendered = false;
// render app if not already rendered
const renderApp = () => {
  if (!hasRendered) {
    render(appJsx, appRoot);
    hasRendered = true;
  }
}

// loading gif
render(<LoadingPage />, document.getElementById('app'));

// change of login state
firebase.auth().onAuthStateChanged(async (user) => {
  const curPath = history.location.pathname;

  // USER IS LOGGED IN
  if (user) {
    store.dispatch(login(user.uid));

    // if on login page, render notes page then fetch data
    // otherwise, fetch data then render current page
    if (curPath.length > 1) {
      dispatchData(user, store)
      renderApp()
    } else {
      renderApp()
      history.push(`/projects/snippynotes/app/notes`)
      dispatchData(user, store)
    }

  // USER IS NOT LOGGED IN
  } else {
    renderApp()
    history.push(`/projects/snippynotes/app`)
    store.dispatch(logout())
  }
})
