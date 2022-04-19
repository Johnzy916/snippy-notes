import { firebase } from '../firebase/firebase'

const db = firebase.firestore()

// get and set initial user data
export const startSetUserData = (user) => {
    return async (dispatch, getState) => {
        const uid = getState().auth.uid
        let userDoc;
        // set user name and email to state
        if (user?.displayName) {
            dispatch(setUserName(user.displayName.split(' ')[0]));
        }
        if (user?.email) {
            dispatch(setUserEmail(user.email));
        }
        // get user data for setting initial state
        try {
            userDoc = await db.doc(`users/${uid}`).get()
        } catch (error) {
            return console.log(`Couldn't get user data: `, error.message)
        }
        // set user email if doc doesn't exist or email doesn't exist
        // for reference in case needing to add something to user and don't know uid
        try {
            if (!userDoc.exists || !userDoc.data().email) {
                await db.doc(`users/${uid}`).set({ email: user.email }, { merge: true })
                await dispatch(startAddUserSnippet({ // set a default
                    shortcut: '.hint',
                    text: 'Use the following code:<br/>&lt;? cursor ?&gt;<br/>to place the cursor anywhere you want.'
                }))
            }
        } catch (error) {
            console.log(`Couldn't set new user data: `, error.message)
        }
        // set existing data from db to state, if it exists
        try {
            if (userDoc.exists) {
                const data = userDoc.data()
                if (data.project) {
                    dispatch(setUserProject(data.project))
                }
            }
        } catch (error) {
            console.log(`Couldn't set user data: `, error.message)
        }
        // set user snippets
        try {
            if (userDoc.exists) {
                let userSnippets = []
                const querySnapshot = await db.collection(`users`)
                                            .doc(`${uid}`)
                                            .collection(`snippets`).get()
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                        userSnippets.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    })
                    dispatch(setUserSnippets(userSnippets))
                }
            }
        } catch (error) {
            console.log(`Couldn't set user snippets: `, error.message)
        }
    }
}

// add user snippets
export const startAddUserSnippet = (snippet) => {
    return async (dispatch, getState) => {
        const uid = getState().auth.uid
        try {
            const docRef = await db.collection(`users`)
                    .doc(`${uid}`)
                    .collection(`snippets`)
                    .add(snippet)
        dispatch(addUserSnippet({
            id: docRef.id,
            ...snippet
        }))
        } catch (error) {
            console.log(`Couldn't add user snippet: `, error.message)
        }
    }
}

// edit user snippets
export const startEditUserSnippet = (id, edits) => {
    return async (dispatch, getState) => {
        const uid = getState().auth.uid
        try {
            await db.collection(`users`)
                    .doc(`${uid}`)
                    .collection(`snippets`)
                    .doc(`${id}`)
                    .update(edits)
            dispatch(editUserSnippet(id, edits))
        } catch (error) {
            console.log(`Couldn't edit user snippet: `, error.message)
        }
    }
}

// remove user snippets
export const startRemoveUserSnippet = (id) => {
    return async (dispatch, getState) => {
        const uid = getState().auth.uid
        try {
            await db.collection(`users`)
                    .doc(`${uid}`)
                    .collection(`snippets`)
                    .doc(`${id}`)
                    .delete()
        dispatch(removeUserSnippet(id))
        } catch (error) {
            console.log(`Couldn't remove user snippet: `, error.message)
        }
    }
}

export const setUserProject = (project) => ({
    type: 'SET_USER_PROJECT',
    project
})

export const setUserTeams = (teams) => ({
    type: 'SET_USER_TEAMS',
    teams
})

export const setUserSnippets = (snippets) => ({
    type: 'SET_USER_SNIPPETS',
    snippets
})

export const setUserName = (name) => ({
    type: 'SET_USER_NAME',
    name
})

export const setUserEmail = (email) => ({
    type: 'SET_USER_EMAIL',
    email
})

export const addUserTeam = (team) => ({
    type: 'ADD_USER_TEAM',
    team
})

export const removeUserTeam = (team) => ({
    type: 'REMOVE_USER_TEAM',
    team
})

export const addUserSnippet = (snippet) => ({
    type: 'ADD_USER_SNIPPET',
    snippet
})

export const removeUserSnippet = (id) => ({
    type: 'REMOVE_USER_SNIPPET',
    id
})

export const editUserSnippet = (id, edits) => ({
    type: 'EDIT_USER_SNIPPET',
    id,
    edits
})