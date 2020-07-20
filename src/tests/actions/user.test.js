import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { firebase } from '../../firebase/firebase'
import { userSnippets } from '../fixtures/snippets'
import {
    startSetUserData, startAddUserSnippet,
    startEditUserSnippet, startRemoveUserSnippet,
    setUserProject, setUserTeams, setUserSnippets, setUserName,
    setUserEmail, addUserTeam, removeUserTeam, addUserSnippet,
    removeUserSnippet, editUserSnippet
} from '../../actions/user'

const db = firebase.firestore()

// mock store

const createMockStore = configureMockStore([thunk])

// async actions

const email = 'email'
const uid = 'testUID'
const project = 'project'
const user = { email, displayName: 'Test User' }
const userRef = db.doc(`users/${uid}`)
const snippetRef = db.collection('users').doc(`${uid}`)
                    .collection('snippets').doc('id1')

beforeAll(async () => {
    let batch = db.batch()
    batch.set(userRef, {
        email,
        project
    })
    batch.set(snippetRef, userSnippets[0])
    await batch.commit()
})

afterAll(async () => {
    let batch = db.batch()
    batch.delete(userRef)
    const snapshot = await db.collection('users')
            .doc(`${uid}`).collection('snippets').get()
    if (!snapshot.empty) {
        snapshot.forEach(doc => batch.delete(doc.ref))
    }
    batch.commit()
})

describe('startSetUserData', () => {
    let store, actions

    beforeAll(async () => {
        store = createMockStore({ auth: { uid } })
        await store.dispatch(startSetUserData(user))
        actions = store.getActions()
    })

    it('should set user name', () => {
        expect(actions[0]).toEqual({
            type: 'SET_USER_NAME',
            name: user.displayName.split(' ')[0]
        })
    })

    it('should set user email', () => {
        expect(actions[1]).toEqual({
            type: 'SET_USER_EMAIL',
            email
        })
    })

    it('should set user project', () => {
        expect(actions[2]).toEqual({
            type: 'SET_USER_PROJECT',
            project
        })
    })

    it('should set user snippets', () => {
        expect(actions[3]).toEqual({
            type: 'SET_USER_SNIPPETS',
            snippets: [ userSnippets[0] ]
        })
    })
})

describe('startAddUserSnippet', () => {
    let store, actions

    beforeAll(async () => {
        store = createMockStore({ auth: { uid } })
        await store.dispatch(startAddUserSnippet(userSnippets[1]))
        actions = store.getActions()
    })

    it('should add user snippet', () => {
        expect(actions[0]).toEqual({
            type: 'ADD_USER_SNIPPET',
            snippet: userSnippets[1]
        })
    })
})

describe('startEditUserSnippet', () => {
    let store, actions, edits

    beforeAll(async () => {
        store = createMockStore({ auth: { uid } })
        edits = { text: 'Test edits' }
        await store.dispatch(startEditUserSnippet(userSnippets[0].id, edits))
        actions = store.getActions()
    })

    it('should edit user snippet', () => {
        expect(actions[0]).toEqual({
            type: 'EDIT_USER_SNIPPET',
            id: userSnippets[0].id,
            edits
        })
    })
})

describe('startRemoveUserSnippet', () => {
    let store, actions

    beforeAll(async () => {
        store = createMockStore({ auth: { uid } })
        await store.dispatch(startRemoveUserSnippet(userSnippets[1].id))
        actions = store.getActions()
    })

    it('should remove user snippet', () => {
        expect(actions[0]).toEqual({
            type: 'REMOVE_USER_SNIPPET',
            id: userSnippets[1].id,
        })
    })
})

// action generators

it('should generate setUserProject action object', () => {
    const project = 'test'
    const action = setUserProject(project)
    expect(action).toEqual({
        type: 'SET_USER_PROJECT',
        project
    })
})

it('should generate setUserTeams action object', () => {
    const teams = [ 'team1', 'team2' ]
    const action = setUserTeams(teams)
    expect(action).toEqual({
        type: 'SET_USER_TEAMS',
        teams
    })
})

it('should generate setUserSnippets action object', () => {
    const snippets = [{ shortcut: '.test', text: '<div>Some text.</div>' }]
    const action = setUserSnippets(snippets)
    expect(action).toEqual({
        type: 'SET_USER_SNIPPETS',
        snippets
    })
})

it('should generate setUserName action object', () => {
    const name = 'Einstein'
    const action = setUserName(name)
    expect(action).toEqual({
        type: 'SET_USER_NAME',
        name
    })
})

it('should generate setUserEmail action object', () => {
    const email = 'user@email.com'
    const action = setUserEmail(email)
    expect(action).toEqual({
        type: 'SET_USER_EMAIL',
        email
    })
})

it('should generate addUserTeam action object', () => {
    const team = 'team'
    const action = addUserTeam(team)
    expect(action).toEqual({
        type: 'ADD_USER_TEAM',
        team
    })
})

it('should generate removeUserTeam action object', () => {
    const team = 'team'
    const action = removeUserTeam(team)
    expect(action).toEqual({
        type: 'REMOVE_USER_TEAM',
        team
    })
})

it('should generate addUserSnippet action object', () => {
    const snippet = { shortcut: '.test', text: '<div>Some text.</div>' }
    const action = addUserSnippet(snippet)
    expect(action).toEqual({
        type: 'ADD_USER_SNIPPET',
        snippet
    })
})

it('should generate removeUserSnippet action object', () => {
    const id = 'SomeSnippetID'
    const action = removeUserSnippet(id)
    expect(action).toEqual({
        type: 'REMOVE_USER_SNIPPET',
        id
    })
})

it('should generate editUserSnippet action object', () => {
    const id = 'SomeSnippetID'
    const edits = { shortcut: '.test' }
    const action = editUserSnippet(id, edits)
    expect(action).toEqual({
        type: 'EDIT_USER_SNIPPET',
        id,
        edits
    })
})