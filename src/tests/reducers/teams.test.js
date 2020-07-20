import teamsReducer from '../../reducers/teams'
import { teamSnippets as snippets } from '../fixtures/snippets'

it('should set team snippets to state', () => {
    const team = 'team'
    const state = teamsReducer({}, {
        type: 'SET_TEAM_SNIPPETS',
        team,
        snippets
    })
    expect(state.snippets[team]).toEqual({ ...snippets })
})

it('should add team snippet to state when no key exists', () => {
    const team = 'team'
    const state = teamsReducer({}, {
        type: 'ADD_TEAM_SNIPPET',
        team,
        snippet: snippets[0]
    })
    expect(state.snippets[team]).toEqual([ snippets[0] ])
})

it('should add team snippet to state when key already exists', () => {
    const team = 'team'
    const curState = {
        snippets: { [team]: [ snippets[0] ] }
    }
    const state = teamsReducer(curState, {
        type: 'ADD_TEAM_SNIPPET',
        team,
        snippet: snippets[1]
    })
    expect(state.snippets[team]).toEqual([ snippets[0], snippets[1] ])
})

it('should remove team snippet from state', () => {
    const team = 'team'
    const id = snippets[team][0].id
    const curState = {
        snippets: { [team]: [ ...snippets[team] ] }
    }
    const state = teamsReducer(curState, {
        type: 'REMOVE_TEAM_SNIPPET',
        team,
        id
    })
    expect(state.snippets[team]).toEqual([ snippets[team][1] ])
})

it('should remove nothing from team snippets if id does not exist', () => {
    const team = 'team'
    const id = 'fakeId'
    const curState = {
        snippets: { [team]: [ ...snippets[team] ] }
    }
    const state = teamsReducer(curState, {
        type: 'REMOVE_TEAM_SNIPPET',
        team,
        id
    })
    expect(state.snippets[team]).toEqual(curState.snippets[team])
})

it('should set team snippets without removed team', () => {
    const newSnippetState = { team: [{ shortcut: 'a', text: 'b' }] }
    const curState = { team: [{ shortcut: 'c', text: 'd' }] }
    const state = teamsReducer(curState, {
        type: 'REMOVE_TEAM_SNIPPETS',
        newSnippetState
    })
    expect(state.snippets).toEqual(newSnippetState)
});

it('should edit team snippet state', () => {
    const team = 'team'
    const id = snippets[team][0].id
    const edits = { shortcut: '.snipEdit' }
    const curState = {
        snippets: { [team]: [ snippets[team][0] ] }
    }
    const state = teamsReducer(curState, {
        type: 'EDIT_TEAM_SNIPPET',
        team,
        id,
        edits
    })
    expect(state.snippets[team]).toEqual([{
            ...snippets[team][0],
            ...edits
        }])
})

it('should not edit any team snippets if id does not exist', () => {
    const team = 'team'
    const id = 'fakeId'
    const edits = { shortcut: '.snipEdit' }
    const curState = {
        snippets: { [team]: [ snippets[team][0] ] }
    }
    const state = teamsReducer(curState, {
        type: 'EDIT_TEAM_SNIPPET',
        team,
        id,
        edits
    })
    expect(state.snippets[team]).toEqual(curState.snippets[team])
})