import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { firebase } from '../../firebase/firebase'
import data from '../fixtures/adminData'
import { userSnippets } from '../fixtures/snippets'
import {
    startSetTeamData, startSetTeamSnippets, startAddTeamSnippet, 
    startEditTeamSnippet, startRemoveTeamSnippet,
    setTeamSnippets, addTeamSnippet,
    removeTeamSnippet, removeTeamSnippets, editTeamSnippet
} from '../../actions/teams'

const db = firebase.firestore()
const FieldValue = firebase.firestore.FieldValue

// mock store

const createMockStore = configureMockStore([thunk])

// async actions

const emails = [ 'email', 'email2' ]
const teams = data.allTeams
const projects = data.allProjects
const uid = 'testUID'
const user = { email: emails[0] }
const userRef = db.doc(`users/${uid}`)
const teamRef = [ db.doc(`teams/${teams[0]}`), db.doc(`teams/${teams[1]}`) ]
const snippetRef = [ 
    teamRef[0].collection('snippets').doc('id1'),
    teamRef[1].collection('snippets').doc('id2')
]


beforeAll(async () => {
    let batch = db.batch()
    batch.set(teamRef[0], {
        project: projects[0],
        admins: FieldValue.arrayUnion(emails[0]),
        members: FieldValue.arrayUnion(emails[0])
    })
    batch.set(teamRef[1], {
        project: projects[0],
        admins: FieldValue.arrayUnion(emails[1]),
        members: FieldValue.arrayUnion(emails[1])
    })
    batch.set(snippetRef[0], userSnippets[0])
    await batch.commit()
})

afterAll(async () => {
    let batch = db.batch()
    batch.delete(teamRef[0])
    batch.delete(teamRef[1])
    batch.delete(userRef)
    const snapshot = await db.collection('teams')
            .doc(`${teams[0]}`).collection('snippets').get()
    if (!snapshot.empty) {
        snapshot.forEach(doc => batch.delete(doc.ref))
    }
    await batch.commit()
})

describe('startSetTeamData', () => {
    let store, actions
    
    describe('set team data', () => {
        beforeAll(async () => {
            store = createMockStore({ 
                user,
                auth: { uid },
                admin: {}
            })
            await store.dispatch(startSetTeamData(user))
            actions = store.getActions()
        })

        it('should set isTeamAdmin', () => {
            expect(actions[0]).toEqual({
                type: 'SET_IS_TEAM_ADMIN',
                teams: [ teams[0] ]
            })
        })

        it('should set user project', () => {
            expect(actions[1]).toEqual({
                type: 'SET_USER_PROJECT',
                project: projects[0]
            })
        })

        // SET TEAM SNIPPET IS CALLED RANDOMLY (?)

        it('should set user teams', () => {
            expect(actions[2]).toEqual({
                type: 'SET_USER_TEAMS',
                teams: [ teams[0] ]
            })
        })
    })
})

describe('startSetTeamSnippets', () => {
    let store, actions

    beforeAll(async () => {
        store = createMockStore({})
        await store.dispatch(startSetTeamSnippets(teams[0]))
        actions = store.getActions()
    })

    it('should set team snippets', () => {
        expect(actions[0]).toEqual({
            type: 'SET_TEAM_SNIPPETS',
            team: teams[0],
            snippets: [ userSnippets[0] ]
        })
    })
})

describe('startAddTeamSnippet', () => {
    let store, actions

    beforeAll(async () => {
        store = createMockStore({})
        await store.dispatch(startAddTeamSnippet(teams[0], userSnippets[0]))
        actions = store.getActions()
    })

    it('should add team snippet', () => {
        expect(actions[0]).toEqual({
            type: 'ADD_TEAM_SNIPPET',
            team: teams[0],
            snippet: userSnippets[0]
        })
    })
})

describe('startEditTeamSnippet', () => {
    let store, actions, edits

    beforeAll(async () => {
        store = createMockStore({})
        edits = { text: 'test edit' }
        await store.dispatch(startEditTeamSnippet(teams[0], userSnippets[0].id, edits))
        actions = store.getActions()
    })

    it('should edit team snippet', () => {
        expect(actions[0]).toEqual({
            type: 'EDIT_TEAM_SNIPPET',
            team: teams[0],
            id: userSnippets[0].id,
            edits
        })
    })
})

describe('startRemoveTeamSnippet', () => {
    let store, actions

    beforeAll(async () => {
        store = createMockStore({})
        await store.dispatch(startRemoveTeamSnippet(teams[0], userSnippets[0].id))
        actions = store.getActions()
    })

    it('should remove team snippet', () => {
        expect(actions[0]).toEqual({
            type: 'REMOVE_TEAM_SNIPPET',
            team: teams[0],
            id: userSnippets[0].id
        })
    })
})

// action generators

it('should generate setTeamSnippets action object', () => {
    const team = 'test'
    const snippets = [{ shortcut: '.test', text: '<div>Some text.</div>'}]
    const action = setTeamSnippets(team, snippets)
    expect(action).toEqual({
        type: 'SET_TEAM_SNIPPETS',
        team,
        snippets
    })
})

it('should generate addTeamSnippet action object', () => {
    const team = 'test'
    const snippet = [{ shortcut: '.test', text: '<div>Some text.</div>'}]
    const action = addTeamSnippet(team, snippet)
    expect(action).toEqual({
        type: 'ADD_TEAM_SNIPPET',
        team,
        snippet
    })
})

it('should generate removeTeamSnippet action object', () => {
    const team = 'test'
    const id = 'SomeTestID'
    const action = removeTeamSnippet(team, id)
    expect(action).toEqual({
        type: 'REMOVE_TEAM_SNIPPET',
        team,
        id
    })
})

it('should generate removeTeamSnippets action object', () => {
    const newSnippetState = { team: [{ shortcut: 'a', text: 'b' }] }
    const action = removeTeamSnippets(newSnippetState)
    expect(action).toEqual({
        type: 'REMOVE_TEAM_SNIPPETS',
        newSnippetState
    })
});

it('should generate editTeamSnippet action object', () => {
    const team = 'test'
    const id = 'SomeTestID'
    const edits = { shortcut: '.test' }
    const action = editTeamSnippet(team, id, edits)
    expect(action).toEqual({
        type: 'EDIT_TEAM_SNIPPET',
        team,
        id,
        edits
    })
})