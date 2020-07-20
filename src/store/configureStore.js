import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import authReducer from '../reducers/auth'
import tempReducer from '../reducers/temp'
import userReducer from '../reducers/user'
import teamsReducer from '../reducers/teams'
import adminReducer from '../reducers/admin'

// remove redux when not in development
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// combine reducers
const appReducer = combineReducers({
  auth: authReducer,
  temp: tempReducer,
  user: userReducer,
  teams: teamsReducer,
  admin: adminReducer
});

// for resetting state on logout
const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }

  return appReducer(state, action)
}

// create store
const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );
  return store;
}

// initialize store
const store = configureStore()

export default store
