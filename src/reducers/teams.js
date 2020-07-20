// const defaultState = {
//     snippets: {},
// }

export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_TEAM_SNIPPETS':
            return {
                ...state,
                snippets: {
                    ...state.snippets,
                    [action.team]: action.snippets
                }
            }
        case 'ADD_TEAM_SNIPPET':
            const teamExists = !!state.snippets && state.snippets[action.team]
            return {
                ...state,
                snippets: {
                    ...state.snippets,
                    [action.team]: teamExists ? [
                        ...state.snippets[action.team],
                        action.snippet
                    ] : [ action.snippet ]
                }
            }
        case 'REMOVE_TEAM_SNIPPET':
            return {
                ...state,
                snippets: {
                    ...state.snippets,
                    [action.team]: state.snippets[action.team].filter(snippet => {
                        return snippet.id !== action.id
                    })
                }
            }
        case 'REMOVE_TEAM_SNIPPETS':
            return {
                ...state,
                snippets: action.newSnippetState
            }
        case 'EDIT_TEAM_SNIPPET':
            return {
                ...state,
                snippets: {
                    ...state.snippets,
                    [action.team]: state.snippets[action.team].map(snippet => {
                        if (snippet.id === action.id) {
                            return {
                                ...snippet,
                                ...action.edits
                            }
                        } else return snippet
                    })
                }
            }
        default:
            return state
    }
}