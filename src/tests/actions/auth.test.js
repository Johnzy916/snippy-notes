import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    startLogin, startLogout,
    login, logout
} from '../../actions/auth'

// mock store

const createMockStore = configureMockStore([thunk])

describe('async actions', () => {
    // it('should call firebase auth for login', async () => {
    //     // expect signInWithPopup toHaveBeenCalled
    // })

    it('should logout and reset app', () => {
      const store = createMockStore({})
      store.dispatch(startLogout())
      const actions = store.getActions()
      expect(actions[0]).toEqual({
          type: 'LOGOUT'
      })
      expect(actions[1]).toEqual({
          type: 'RESET_APP'
      })
    })
})


describe('actions generators', () => {
    it('should generate login action object', () => {
        const uid = "SomeUID916"
        const action = login(uid)
        expect(action).toEqual({
            type: 'LOGIN',
            uid
        })
     })
     
     it('should generate logout action object', () => {
         const action = logout()
         expect(action).toEqual({
             type: 'LOGOUT' 
         })
     })
})