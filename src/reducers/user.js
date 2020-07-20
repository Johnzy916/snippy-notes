// const defaultState = {
//     project: '',
//     teams: [],
//     snippets: [],
// }

export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_PROJECT':
            return {
                ...state,
                project: action.project
            }
        case 'SET_USER_TEAMS':
            return {
                ...state,
                teams: action.teams
            }
        case 'SET_USER_NAME':
            return {
                ...state,
                name: action.name
            }
        case 'SET_USER_EMAIL':
            return {
                ...state,
                email: action.email
            }
        case 'SET_USER_SNIPPETS':
            return {
                ...state,
                snippets: action.snippets
            }
        case 'ADD_USER_TEAM':
            const keyExists = !!state.teams
            return {
                ...state,
                teams: keyExists ? [
                    ...state.teams,
                    action.team
                ] : [ action.team ]
            }
        case 'REMOVE_USER_TEAM':
            return {
                ...state,
                teams: state.teams.filter(team => {
                    return team !== action.team
                })
            }
        case 'ADD_USER_SNIPPET':
            const snippetsExist = !!state.snippets
            return {
                ...state,
                snippets: snippetsExist ? [
                    ...state.snippets,
                    action.snippet
                ] : [ action.snippet ]
            }
        case 'REMOVE_USER_SNIPPET':
            return {
                ...state,
                snippets: state.snippets.filter(snippet => {
                    return snippet.id !== action.id
                })
            }
        case 'EDIT_USER_SNIPPET':
            return {
                ...state,
                snippets: state.snippets.map(snippet => {
                    if (snippet.id === action.id) {
                        return {
                            ...snippet,
                            ...action.edits
                        }
                    } else return snippet
                })
            }
        default:
            return state;
    }
}