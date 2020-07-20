import {
    updateNote,
    updateUserAddSnippet,
    updateTeamAddSnippets
 } from '../../actions/temp'
import { userSnippets as snippets } from '../fixtures/snippets'

it('should generate updateNote action object', () => {
    const note = '<div>Note from input</div>'
    const action = updateNote(note)
    expect(action).toEqual({
        type: 'UPDATE_NOTE',
        note
    })
})

it('should generate updateUserAddSnippet action object', () => {
    const action = updateUserAddSnippet(snippets[0])
    expect(action).toEqual({
        type: 'UPDATE_USER_ADD_SNIPPET',
        snippet: snippets[0]
    })
})

it('should generate updateTeamAddSnippet action object', () => {
    const team = 'team'
    const action = updateTeamAddSnippets(team, snippets[0])
    expect(action).toEqual({
        type: 'UPDATE_TEAM_ADD_SNIPPETS',
        team,
        snippet: snippets[0]
    })
})

