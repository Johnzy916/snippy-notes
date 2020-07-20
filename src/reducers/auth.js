export default (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                uid: action.uid
            }
        case 'LOGOUT':
            return {}
        default:
            return state
    }
}
