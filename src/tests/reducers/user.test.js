import userReducer from '../../reducers/user'
import { userSnippets as snippets } from '../fixtures/snippets'

it('should set user project to state', () => {
    const project = 'project'
    const state = userReducer({}, {
        type: 'SET_USER_PROJECT',
        project
    })
    expect(state.project).toBe(project)
})

it('should set user teams to state', () => {
    const teams = [ 'team1', 'team2' ]
    const state = userReducer({}, {
        type: 'SET_USER_TEAMS',
        teams
    })
    expect(state.teams).toEqual(teams)
})

it('should set user snippets to state', () => {
    const state = userReducer({}, {
        type: 'SET_USER_SNIPPETS',
        snippets
    })
    expect(state.snippets).toEqual(snippets)
})

it('should set user name to state', () => {
    const name = 'User Name'
    const state = userReducer({}, {
        type: 'SET_USER_NAME',
        name
    })
    expect(state.name).toBe(name)
})

it('should set user email to state', () => {
    const email = 'user@email.com'
    const state = userReducer({}, {
        type: 'SET_USER_EMAIL',
        email
    })
    expect(state.email).toBe(email)
})

it('should add user team to state when no key exists', () => {
    const team = 'team'
    const state = userReducer({}, {
        type: 'ADD_USER_TEAM',
        team
    })
    expect(state.teams).toEqual([ team ])
})

it('should add user team to state when key exists', () => {
    const team = 'team2'
    const curState = { teams: [ 'team1' ] }
    const state = userReducer(curState, {
        type: 'ADD_USER_TEAM',
        team
    })
    expect(state.teams).toEqual([ 'team1', team ])
})

it('should remove user team from state', () => {
    const team = 'team'
    const curState = { teams: [ team ] }
    const state = userReducer(curState, {
        type: 'REMOVE_USER_TEAM',
        team
    })
    expect(state.teams).toEqual([])
})

it('should not remove any user teams when team does not exist', () => {
    const team = 'team'
    const team2 = 'team2'
    const curState = { teams: [ team2 ] }
    const state = userReducer(curState, {
        type: 'REMOVE_USER_TEAM',
        team
    })
    expect(state.teams).toEqual(curState.teams)
})

it('should add user snippet to state when no snippets exist', () => {
    const user = 'user'
    const state = userReducer({}, {
        type: 'ADD_USER_SNIPPET',
        user,
        snippet: snippets[0]
    })
    expect(state.snippets).toEqual([ snippets[0] ])
})

it('should add user snippet to state when snippets already exist', () => {
    const user = 'user'
    const curState =  { snippets: [ snippets[0] ] }
    const state = userReducer(curState, {
        type: 'ADD_USER_SNIPPET',
        user,
        snippet: snippets[1]
    })
    expect(state.snippets).toEqual([ ...snippets ])
})

it('should remove user snippet from state', () => {
    const user = 'user'
    const id = snippets[0].id
    const curState = {
        snippets: [ ...snippets ]
    }
    const state = userReducer(curState, {
        type: 'REMOVE_USER_SNIPPET',
        user,
        id
    })
    expect(state.snippets).toEqual([ snippets[1] ])
})

it('should remove nothing from user snippets if id does not exist', () => {
    const user = 'user'
    const id = 'fakeId'
    const curState = {
        snippets: [ ...snippets ]
    }
    const state = userReducer(curState, {
        type: 'REMOVE_USER_SNIPPET',
        user,
        id
    })
    expect(state.snippets).toEqual(curState.snippets)
})

it('should edit user snippet state', () => {
    const user = 'user'
    const id = snippets[0].id
    const edits = { shortcut: '.snipEdit' }
    const curState = {
        snippets: [ snippets[0] ]
    }
    const state = userReducer(curState, {
        type: 'EDIT_USER_SNIPPET',
        user,
        id,
        edits
    })
    expect(state.snippets).toEqual([{
            ...snippets[0],
            ...edits
        }])
})

it('should not edit any user snippets if id does not exist', () => {
    const user = 'user'
    const id = 'fakeId'
    const edits = { shortcut: '.snipEdit' }
    const curState = {
        snippets: [ snippets[0] ]
    }
    const state = userReducer(curState, {
        type: 'EDIT_USER_SNIPPET',
        user,
        id,
        edits
    })
    expect(state.snippets).toEqual(curState.snippets)
})