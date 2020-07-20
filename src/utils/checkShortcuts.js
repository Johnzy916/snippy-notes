import store from '../store/configureStore'
import insertHtml from './insertHtml';

// Check to see if text in argument corresponds to any shortcuts
export const checkShortcuts = (shortcut, textInput) => {
    let userSnippets = store.getState().user.snippets || [];
    const teamSnippets = store.getState().teams.snippets || {};

    if (Object.keys(teamSnippets).length > 0) {
        Object.keys(teamSnippets).forEach(team => {
            userSnippets = [
                ...userSnippets,
                ...teamSnippets[team]
            ]
        })
    }

    const snippet = userSnippets.filter(obj => obj.shortcut.toLowerCase() === shortcut.toLowerCase())[0];

    if (snippet) {
        insertHtml(snippet.text, shortcut, textInput)
    }
}