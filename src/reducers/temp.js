export default (state = {}, action) => {

    switch (action.type) {
      case 'UPDATE_NOTE':
        return {
          ...state,
          note: action.note
        }
      case 'UPDATE_USER_ADD_SNIPPET':
        return {
          ...state,
          user: action.snippet
        }
      case 'UPDATE_TEAM_ADD_SNIPPETS':
        return {
          ...state,
          teams: {
            ...state.teams,
            [action.team]: action.snippet
          }
        }
      default:
        return state;
    }
  }