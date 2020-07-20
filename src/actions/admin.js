import { firebase } from '../firebase/firebase'
import { addUserTeam, removeUserTeam } from './user'
import { startSetTeamSnippets, setTeamSnippets, removeTeamSnippets } from './teams'

const db = firebase.firestore()
const FieldValue = firebase.firestore.FieldValue

// set the user's role
export const startSetUserRole = (user) => {
    return async (dispatch, getState) => {
        const project = getState().user.project ?
                        getState().user.project.replace(' ', '_') // replace spaces in db path
                        : ''
        let adminDoc, projectSnapshot
        // check if the user is a super admin
        try {
            adminDoc = await db.doc(`admin/admins`).get()
            if (adminDoc.exists && adminDoc.data().superadmin.includes(user.email)) {
                 return dispatch(setUserRole('superAdmin'))
            }
        } catch (error) {
            if (error.code !== 'permission-denied') {
                console.log(`Couldn't set user role: `, error.message)
            }
        }
        // if not, and they're part of a project, check if they're project admin
        if (project) {
            try {
                // else, check if they're a project admin
                projectSnapshot = await db.doc(`projects/${project}`).get()
                if (projectSnapshot.exists && projectSnapshot.data().admins.includes(user.email)) {
                    return dispatch(setUserRole('projectAdmin'))
                }
            } catch (error) {
                if (error.code !== 'permission-denied') {
                    console.log(`Couldn't set user role: `, error.message)
                }
            }
        }
    }
}

// set initial project admins (only called if superadmin or project admin)
export const startSetProjectAdmins = (type) => {
    return async (dispatch, getState) => {
        try {
            const querySnapshot = await db.collection(`projects`).get()
            if (!querySnapshot.empty) {
                querySnapshot.forEach(project => {
                    const projectName = project.id.replace('_', ' ')
                    if (type === 'superadmin' || projectName === getState().user.project)
                    dispatch(setProjectAdmins(projectName, project.data().admins))
                })
            }
        } catch (error) {
            if (error.code !== 'permission-denied') {
                console.log(`Couldn't set project admins: `, error.message)
            }
        }
    }
}

// set all projects (only called if superadmin)
export const startSetAllProjects = () => {
    return async (dispatch) => {
        let allProjects = []
        try {
            const projectSnapshot = await db.collection(`projects`).get()
            if (!projectSnapshot.empty) {
                projectSnapshot.forEach(project => {
                    allProjects.push(project.id.replace('_', ' '))
                })
            }
        dispatch(setAllProjects(allProjects))
        dispatch(setCurrentProject(allProjects[0])) // set current project
        } catch (error) {
            if (error.code !== 'permission-denied') {
                console.log(`Couldn't get all projects: `, error.message)
            }
        }
    }
}

export const startSetTeamAdmins = (type) => {
    return async (dispatch, getState) => {
        const project = getState().user.project
        const isTeamAdmin = getState().admin.isTeamAdmin
        const setTeamData = (team, { admins, members }) => {
            dispatch(setTeamAdmins(team, admins))
            dispatch(setTeamMembers(team, members))
        }
        let querySnapshot,
            allTeams = [],
            projectTeams = []
        try {
            querySnapshot = await db.collection(`teams`).get()
        } catch (error) {
            return console.log(`Couldn't get team data: `, error.message)
        }
        // if superadmin, set team admins for all teams and projects
        if (!querySnapshot.empty) {
            if (type === 'superadmin') {
                querySnapshot.forEach(team => {
                    const teamName = team.id.replace('_', ' ')
                    setTeamData(teamName, { admins: team.data().admins, members: team.data().members })
                    allTeams.push(teamName)
                })
                dispatch(setAllTeams(allTeams))
            // if project admin, set team admins only for teams on this project
            // also set current project for adding teams
            } else if (type === 'admin') {
                querySnapshot.forEach(team => {
                    const teamName = team.id.replace('_', ' ')
                    if (team.data().project.replace('_', ' ') === project) {
                        setTeamData(teamName, { admins: team.data().admins, members: team.data().members })
                        projectTeams.push(teamName)
                    }
                })
                dispatch(setAllTeams(projectTeams))
                dispatch(setCurrentProject(project))
            // if team admin, set team admins only for teams user is admin of
            } else if (type === 'team') {
                if (isTeamAdmin.length > 0) {
                    querySnapshot.forEach(team => {
                        const teamName = team.id.replace('_', ' ')
                        if (isTeamAdmin.includes(teamName)) {
                            setTeamData(teamName, { admins: team.data().admins, members: team.data().members })
                        }
                    })
                }
            }
            // set the current team based on the users role
            // user's role will determine whether they have access to all teams, project, or their own teams
            if (type === 'team') dispatch(setCurrentTeam(isTeamAdmin[0]))
            else if (type === 'admin') dispatch(setCurrentTeam(projectTeams[0]))
            else if (type === 'superadmin') dispatch(setCurrentTeam(allTeams[0]))
        }
    }
}

// add project
export const startAddProject = (project, admin) => {
    project = project.toLowerCase()
    admin = admin.toLowerCase()
    return async (dispatch) => {
        try {
            await db.collection(`projects`)
                    .doc(`${project.replace(' ', '_')}`)
                    .set({
                        admins: FieldValue.arrayUnion(admin)
                    }, { merge: true })
            dispatch(addProject(project))
            dispatch(addProjectAdmin(project, admin))
            dispatch(setCurrentProject(project))
        } catch (error) {
            console.log(`Couldn't add project: `, error.message)
        }
    }
}

// remove project
export const startRemoveProject = (project) => {
    project = project.toLowerCase()
    return async (dispatch, getState) => {
        try {
            await db.collection(`projects`)
                    .doc(`${project.replace(' ', '_')}`)
                    .delete()
            // create new 'admins' state object without this project
            const { [project]: projectKey, ...newAdminState } = getState().admin.admins
            // change the current project if it's currently selected in addAdmins (to avoid errors)
            if (project === getState().admin.currentProject) {
                dispatch(setCurrentProject(Object.keys(newAdminState)[0]))
            }
            dispatch(removeProject(project, newAdminState))
        } catch (error) {
            console.log(`Couldn't remove project: `, error.message)
        }
        // remove all of the teams that belong to the project
        try {
            const querySnapshot = await db.collection(`teams`)
                                        .where('project', '==', project.replace(' ', '_'))
                                        .get()
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async doc => {
                    await dispatch(startRemoveTeam(undefined, doc.id))
                })
            }  
        } catch (error) {
            console.log(`Couldn't remove teams: `, error.message)
        }
    }
}

// add project admin
export const startAddProjectAdmin = (project, email) => {
    project = project.toLowerCase()
    email = email.toLowerCase()
    return async (dispatch) => {
        try {
            await db.doc(`projects/${project.replace(' ', '_')}`)
                .set({
                    admins: FieldValue.arrayUnion(email)
                }, { merge: true })
            dispatch(addProjectAdmin(project, email))
        } catch (error) {
            console.log(`Couldn't add project admin: `, error.message)
        }
    }
}

// remove project admin
export const startRemoveProjectAdmin = (project, email) => {
    project = project.toLowerCase()
    email = email.toLowerCase()
    return async (dispatch) => {
        try {
            await db.doc(`projects/${project.replace(' ', '_')}`)
                .update({
                    admins: FieldValue.arrayRemove(email)
                })
            dispatch(removeProjectAdmin(project, email))
        } catch (error) {
            console.log(`Couldn't remove project admin: `, error.message)
        }
    }
}

// add team
export const startAddTeam = (project, team, admin) => {
    project = project.toLowerCase()
    team = team.toLowerCase()
    admin = admin.toLowerCase()
    return async (dispatch, getState) => {
        const allTeams = getState().admin.allTeams || []
        const userEmail = getState().user.email
        const teamMembers = getState().admin.teamMembers
        try {
            const batch = db.batch()
            const teamsRef = db.doc(`teams/${team.replace(' ', '_')}`)
            const projectRef = db.doc(`projects/${project.replace(' ', '_')}`)
            batch.set(teamsRef, {
                admins: FieldValue.arrayUnion(admin),
                members: FieldValue.arrayUnion(admin),
                project
            }, { merge: true })
            batch.set(projectRef, {
                teams: FieldValue.arrayUnion(team)
            }, { merge: true })
            await batch.commit()
        } catch (error) {
            console.log(`Couldn't add team to db: `, error.message)
        }
        try {
            // if team is not already in state,
            // add to the UI and add key to teamSnippets object
            if (allTeams && !allTeams.includes(team)) {
                dispatch(addTeam(team))
                dispatch(setTeamSnippets(team, []))
            }
            // add admin to teamAdmins
            dispatch(addTeamAdmin(team, admin))
            // add to teamMembers, if they're not already a member
            if (!teamMembers[team] || !teamMembers[team].includes(admin)) {
                dispatch(addTeamMember(team, admin))
            }
            // if user is adding themselves, update their teams and snippets
            if (userEmail === admin) {
                dispatch(addUserTeam(team))
                dispatch(addIsTeamAdmin(team))
            }
            // set the current team
            dispatch(setCurrentTeam(team))
        } catch (error) {
            console.log(`Couldn't add team: `, error.message)
        }
    }
}

// remove team
    //// TO DO - INTEGRATE RECURSIVE DELETING OF ALL SUBCOLLECTIONS (SNIPPETS)
    /// will need to use callable cloud functions
export const startRemoveTeam = (project, team) => {
    project = project ? project.toLowerCase() : '' // no project if initiated by startRemoveProject
    team = team.toLowerCase()
    return async (dispatch, getState) => {
        const userTeams = getState().user.teams
        const isTeamAdmin = getState().admin.isTeamAdmin
        const teamSnippets = getState().teams.snippets
        try {
            // remove team and update project
            // else whole project has been removed
            const batch = db.batch()
            const teamsRef = db.doc(`teams/${team.replace(' ', '_')}`)
            batch.delete(teamsRef)
            if (project) {
                const projectRef = db.doc(`projects/${project.replace(' ', '_')}`)
                batch.update(projectRef, {
                    teams: FieldValue.arrayRemove(team)
                })
            }
            await batch.commit()

            // create new teamAdmins and memberAdmins states without the team
            const { [team]: adminKey, ...newAdminState } = getState().admin.teamAdmins
            const { [team]: memberKey, ...newMemberState } = getState().admin.teamMembers
            // have to change current team if it's currently displayed
            // to avoid errors in displaying team members
            if (team === getState().admin.currentTeam) {
                dispatch(setCurrentTeam(Object.keys(newMemberState)[0]))
            }
            // set state for teamAdmins, teamMembers, and allTeams
            dispatch(removeTeam(team, newAdminState, newMemberState))
            // remove this team from user's teams if it exists
            if (userTeams && userTeams.includes(team)) {
                dispatch(removeUserTeam(team))
            } if (isTeamAdmin && isTeamAdmin.includes(team)) {
                dispatch(removeIsTeamAdmin(team))
            }
            // remove this team from team snippets
            if (teamSnippets && Object.keys(teamSnippets).includes(team)) {
                const { [team]: teamKey, ...newSnippetState } = teamSnippets
                dispatch(removeTeamSnippets(newSnippetState))
            }
        } catch (error) {
            console.log(`Couldn't remove team: `, error.message)
        }
    }
}

// add team admin
export const startAddTeamAdmin = (team, email) => {
    team = team.toLowerCase()
    email = email.toLowerCase()
    return async (dispatch, getState) => {
        const userEmail = getState().user.email
        try {
            await db.doc(`teams/${team.replace(' ', '_')}`)
                .set({
                    admins: FieldValue.arrayUnion(email),
                    members: FieldValue.arrayUnion(email)
                }, { merge: true })
            dispatch(addTeamAdmin(team, email))
            // if user is adding themselves, update their teams
            if (userEmail === email) {
                dispatch(addUserTeam(team))
                dispatch(addIsTeamAdmin(team))
            }
        } catch (error) {
            console.log(`Couldn't add team admin: `, error.message)
        }
    }
}

// remove team admin
export const startRemoveTeamAdmin = (team, email) => {
    team = team.toLowerCase()
    email = email.toLowerCase()
    return async (dispatch, getState) => {
        const userEmail = getState().user.email
        const userTeams = getState().user.teams
        const isTeamAdmin = getState().admin.isTeamAdmin
        try {
            await db.doc(`teams/${team.replace(' ', '_')}`)
                .update({
                    admins: FieldValue.arrayRemove(email),
                    members: FieldValue.arrayRemove(email)
                })
            dispatch(removeTeamAdmin(team, email))
            dispatch(removeTeamMember(team, email))
            // if user is removing themselves
            // remove this team from user's teams and isTeamAdmin
            if (userEmail === email) {
                if (userTeams.includes(team) || isTeamAdmin.includes(team))
                dispatch(removeUserTeam(team))
                dispatch(removeIsTeamAdmin(team))
            }
        } catch (error) {
            console.log(`Couldn't remove team admin: `, error.message)
        }
    }
}

// add team member
export const startAddTeamMember = (team, email) => {
    team = team.toLowerCase()
    email = email.toLowerCase()
    return async (dispatch, getState) => {
        const userEmail = getState().user.email
        try {
            await db.doc(`teams/${team.replace(' ', '_')}`)
                    .set({
                        members: FieldValue.arrayUnion(email)
                    }, { merge: true })
            dispatch(addTeamMember(team, email))

        } catch (error) {
            console.log(`Couldn't add team member: `, error.messages)
        }
        // if user is adding themselves, update their teams
        // then set team snippets
        if (userEmail === email) {
        try {
            dispatch(addUserTeam(team))
            dispatch(startSetTeamSnippets(team))            
        } catch (error) {
            console.log(`Couldn't set team snippets: `, error.message)
        }
        }
    }
}

// remove team member
export const startRemoveTeamMember = (team, email) => {
    team = team.toLowerCase()
    email = email.toLowerCase()
    return async (dispatch, getState) => {
        const userEmail = getState().user.email
        try {
            await db.doc(`teams/${team.replace(' ', '_')}`)
                    .update({
                        members: FieldValue.arrayRemove(email)
                    })
            dispatch(removeTeamMember(team, email))
            // if user is removing themselves, update their teams
            if (userEmail === email) {
                dispatch(removeUserTeam(team))
            }
        } catch (error) {
            console.log(`Couldn't remove team member: `, error.message)
        }
    }
}

export const setUserRole = (role) => ({
    type: 'SET_USER_ROLE',
    role
})

export const setProjectAdmins = (project, admins) => ({
    type: 'SET_PROJECT_ADMINS',
    project,
    admins
})

export const setAllProjects = (projects) => ({
    type: 'SET_ALL_PROJECTS',
    projects
})

export const setCurrentProject = (project) => ({
    type: 'SET_CURRENT_PROJECT',
    project
})

export const setCurrentTeam = (team) => ({
    type: 'SET_CURRENT_TEAM',
    team
})

export const setAllTeams = (teams) => ({
    type: 'SET_ALL_TEAMS',
    teams
})

export const setIsTeamAdmin = (teams) => ({
    type: 'SET_IS_TEAM_ADMIN',
    teams
})

export const setTeamAdmins = (team, admins) => ({
    type: 'SET_TEAM_ADMINS',
    team,
    admins
})

export const setTeamMembers = (team, members) => ({
    type: 'SET_TEAM_MEMBERS',
    team,
    members
})

export const addProject = (project) => ({
    type: 'ADD_PROJECT',
    project
})

export const removeProject = (project, newAdminState) => ({
    type: 'REMOVE_PROJECT',
    project,
    newAdminState
})

export const addProjectAdmin = (project, email) => ({
    type: 'ADD_PROJECT_ADMIN',
    project,
    email
})

export const removeProjectAdmin = (project, email) => ({
    type: 'REMOVE_PROJECT_ADMIN',
    project,
    email
})

export const addTeam = (team) => ({
    type: 'ADD_TEAM',
    team
})

export const removeTeam = (team, newAdminState, newMemberState) => ({
    type: 'REMOVE_TEAM',
    team,
    newAdminState,
    newMemberState
})

export const addTeamAdmin = (team, email) => ({
    type: 'ADD_TEAM_ADMIN',
    team,
    email
})

export const removeTeamAdmin = (team, email) => ({
    type: 'REMOVE_TEAM_ADMIN',
    team,
    email
})

export const addIsTeamAdmin = (team) => ({
    type: 'ADD_IS_TEAM_ADMIN',
    team
})

export const removeIsTeamAdmin = (team) => ({
    type: 'REMOVE_IS_TEAM_ADMIN',
    team
})

export const addTeamMember = (team, email) => ({
    type: 'ADD_TEAM_MEMBER',
    team,
    email
})

export const removeTeamMember = (team, email) => ({
    type: 'REMOVE_TEAM_MEMBER',
    team,
    email
})