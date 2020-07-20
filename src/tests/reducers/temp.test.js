import tempReducer from '../../reducers/temp'

const snippet = {
    shortcut: '.test',
    text: '<div>Some text.</div>'
}

it('should setup defualt temp state', () => {
    const state = tempReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({})
})

it('should update note in temp state', () => {
    const note = 'test note'
    const state = tempReducer({}, {
        type: 'UPDATE_NOTE',
        note
    })
    expect(state.note).toBe(note)
})

it('should update user (snippet) in temp state', () => {
    const state = tempReducer({}, {
        type: 'UPDATE_USER_ADD_SNIPPET',
        snippet
    })
    expect(state.user).toEqual(snippet)
})

it('should update teams (snippets) in temp state', () => {
    const team = 'team'
    const state = tempReducer({}, {
        type: 'UPDATE_TEAM_ADD_SNIPPETS',
        team,
        snippet
    })
    expect(state.teams[team]).toEqual(snippet)
})

