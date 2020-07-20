import { firebase } from '../firebase/firebase'
import { setUserTeams, setUserProject } from './user'
import { setIsTeamAdmin } from './admin'

const db = firebase.firestore()

export const startSetTeamData = (user) => {
    return async (dispatch, getState) => {
        const uid = getState().auth.uid
        let project = getState().user.project
        const isProjectAdmin = getState().admin.role === 'projectAdmin'
        let userTeams = [],
            isTeamAdmin = [],
            querySnapshot,
            projectSnapshot
        // check if user is a member of any teams
        try {
            querySnapshot = await db.collection('teams')
                    .where('members', 'array-contains', user.email)
                    .get()
        } catch (error) {
            return console.log(`Couldn't get team data: `, error.message)
        }
        // if so, add team data to the state
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async doc => {
                const teamName = doc.id.replace('_', ' ')
                userTeams.push(teamName)
                if (doc.data().admins.includes(user.email)) {
                    isTeamAdmin.push(teamName)
                }
                // set user's project if it wasn't already set from user data
                if (!project) {
                    try {
                        await db.doc(`users/${uid}`).set({ project: doc.data().project }, { merge: true })
                        project = doc.data().project
                        dispatch(setUserProject(doc.data().project))
                    } catch (error) {
                        console.log(`Couldn't set user project: `, error.message)
                    }
                }
                // set this teams snippets if not project admin
                if (!isProjectAdmin) {
                    dispatch(startSetTeamSnippets(teamName))
                }
            })
            // set the state if user is admin of any teams
            if (isTeamAdmin.length > 0) {
                dispatch(setIsTeamAdmin(isTeamAdmin))
            }
            // update user's teams on db and state if it doesn't match
            if (userTeams !== getState().user.teams) {
                try {
                    await db.doc(`users/${uid}`).set({ teams: userTeams }, { merge: true })
                } catch (error) {
                    console.log(`Couldn't set user's teams: `, error.message)
                }
                dispatch(setUserTeams(userTeams))
            }
        }
        // if user is project admin, add all team snippets
        if (isProjectAdmin) {
            projectSnapshot = await db.collection('teams')
            .where('project', '==', project)
            .get()
            if (!projectSnapshot.empty) {
                projectSnapshot.forEach(doc => {
                    dispatch(startSetTeamSnippets(doc.id))
                })
            }
        }
    }
}

export const startSetTeamSnippets = (team) => {
    return async (dispatch) => {
        try {
            let snippets = []
            const snapshot = await db.collection(`teams`)
                            .doc(`${team.replace(' ', '_')}`)
                            .collection(`snippets`)
                            .get()
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    snippets.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                dispatch(setTeamSnippets(team, snippets))
                snippets = []
            } else {
                dispatch(setTeamSnippets(team, []))
            }
        } catch (error) {
            console.log(`Couldn't set team snippets: `, error.message)
        }
    }
}

export const startAddTeamSnippet = (team, snippet) => {
    return async (dispatch) => {
        try {
            const docRef = await db.collection(`teams`)
                                .doc(`${team.replace(' ', '_')}`)
                                .collection(`snippets`)
                                .add(snippet)
            dispatch(addTeamSnippet(team, {
                id: docRef.id,
                ...snippet
            }))
        } catch (error) {
            console.log(`Couldn't add team snippet: `, error.message)
        }
    }
}

export const startEditTeamSnippet = (team, id, edits) => {
    return async (dispatch) => {
        try {
            await db.collection(`teams`)
                    .doc(`${team.replace(' ', '_')}`)
                    .collection(`snippets`)
                    .doc(`${id}`)
                    .update(edits)
            dispatch(editTeamSnippet(team, id, edits))
        } catch (error) {
            console.log(`Couldn't edit team snippet: `, error)
        }
    }
}

export const startRemoveTeamSnippet = (team, id) => {
    return async (dispatch) => {
        try {
            await db.collection(`teams`)
                    .doc(`${team.replace(' ', '_')}`)
                    .collection(`snippets`)
                    .doc(`${id}`)
                    .delete()
        dispatch(removeTeamSnippet(team, id))
        } catch (error) {
            console.log(`Couldn't remove team snippet: `, error.message)
        }
    }
}


// action creators

export const setTeamSnippets = (team, snippets) => ({
    type: 'SET_TEAM_SNIPPETS',
    team,
    snippets
})

export const addTeamSnippet = (team, snippet) => ({
    type: 'ADD_TEAM_SNIPPET',
    team,
    snippet
})

export const removeTeamSnippet = (team, id) => ({
    type: 'REMOVE_TEAM_SNIPPET',
    team,
    id
})

export const removeTeamSnippets = (newSnippetState) => ({
    type: 'REMOVE_TEAM_SNIPPETS',
    newSnippetState
})

export const editTeamSnippet = (team, id, edits) => ({
    type: 'EDIT_TEAM_SNIPPET',
    team,
    id,
    edits
})