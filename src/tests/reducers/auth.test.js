import authReducer from '../../reducers/auth';

it('should setup default auth state', () => {
    const state = authReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({})
})

it('should set uid on login', () => {
    const uid = 'someUID916';
    const action = {
        type: 'LOGIN',
        uid
    };
    const state = authReducer({}, action);
    expect(state.uid).toBe(action.uid);
});

it('should set state to empty object on logout', () => {
   const uid = 'someUID916';
   const action = {
       type: 'LOGOUT'
   };
   const state = authReducer({ uid }, action);
   expect(state).toEqual({});
});