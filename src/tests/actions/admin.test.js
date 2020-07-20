import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { firebase } from '../../firebase/firebase'
import data from '../fixtures/adminData'
import { teamSnippets } from '../fixtures/snippets'
import {
    startSetUserRole, startSetProjectAdmins, startSetAllProjects,
    startSetTeamAdmins, startAddProject, startRemoveProject,
    startAddProjectAdmin, startRemoveProjectAdmin, startAddTeam,
    startRemoveTeam, startAddTeamAdmin, startRemoveTeamAdmin,
    startAddTeamMember, startRemoveTeamMember,
    setUserRole, setProjectAdmins, setAllProjects, setCurrentProject,
    setCurrentTeam, setAllTeams, setIsTeamAdmin, setTeamAdmins,
    setTeamMembers, addProject, removeProject, addProjectAdmin,
    removeProjectAdmin, addTeam, removeTeam, addTeamAdmin,
    removeTeamAdmin, addIsTeamAdmin, removeIsTeamAdmin,
    addTeamMember, removeTeamMember
} from '../../actions/admin'

const db = firebase.firestore()
const FieldValue = firebase.firestore.FieldValue

// mock store

const createMockStore = configureMockStore([thunk])

// async actions
/////////////////////////

const emails = [ 'email', 'email2' ]
const projects = data.allProjects
const teams = data.allTeams
const adminRef = db.doc(`admin/admins`)
const projectRef = [ db.doc(`projects/${projects[0]}`), db.doc(`projects/${projects[1]}`) ]
const teamRef = [ db.doc(`teams/${teams[0]}`), db.doc(`teams/${teams[1]}`) ]


describe('async actions', () => {
    beforeAll(async () => {
        let batch = db.batch()
        batch.set(projectRef[0], { admins: FieldValue.arrayUnion(emails[0]) })
        batch.set(projectRef[1], { admins: FieldValue.arrayUnion(emails[1]) })
        batch.set(db.doc(`teams/${teams[0]}`), { 
            members: FieldValue.arrayUnion(emails[0]),
            admins: FieldValue.arrayUnion(emails[0]),
            project: projects[0]
        })
        batch.set(db.doc(`teams/${teams[1]}`), { 
            members: FieldValue.arrayUnion(emails[1]),
            admins: FieldValue.arrayUnion(emails[1]),
            project: projects[1]
        })
        await batch.commit()
    })
    
    afterAll(async () => {
        let batch = db.batch()
        batch.delete(adminRef)
        batch.delete(projectRef[0])
        batch.delete(projectRef[1])
        batch.delete(teamRef[0])
        batch.delete(teamRef[1])
        await batch.commit()
    })
    
    describe('startSetUserRole', () => {
        it('should set user role as projectAdmin', async () => {
            const store = createMockStore({ user: { project: projects[0] } })
            await projectRef[0].set({ admins: FieldValue.arrayUnion(emails[0]) })
            await store.dispatch(startSetUserRole({ email: emails[0] }))
            const actions = store.getActions()
            expect(actions[0]).toEqual({
                type: 'SET_USER_ROLE',
                role: 'projectAdmin'
            })
        })
    
        it('should set user role as superAdmin', async () => {
            const store = createMockStore({ user: {} })
            await adminRef.set({ superadmin: FieldValue.arrayUnion(emails[0]) })
            await store.dispatch(startSetUserRole({ email: emails[0] }))
            const actions = store.getActions()
            expect(actions[0]).toEqual({
                type: 'SET_USER_ROLE',
                role: 'superAdmin'
            })
        })
    })
    
    describe('startSetProjectAdmins', () => {
        it('should set project admins if project admin', async () => {
            const store = createMockStore({ user: { project: projects[0] } })
            await store.dispatch(startSetProjectAdmins('admin'))
            const actions = store.getActions()
            expect(actions[0]).toEqual({
                type: 'SET_PROJECT_ADMINS',
                project: projects[0],
                admins: [ emails[0] ]
            })
        })
    
        it('should set project admins if superadmin', async () => {
            const store = createMockStore({ user: '' })
            await store.dispatch(startSetProjectAdmins('superadmin'))
            const actions = store.getActions()
            expect(actions[0]).toEqual({
                type: 'SET_PROJECT_ADMINS',
                project: projects[0],
                admins: [ emails[0] ]
            })
        })
    })
    
    describe('startSetAllProjects', () => {
        it('should set all projects and set current project', async () => {
            const store = createMockStore({})
            await store.dispatch(startSetAllProjects())
            const actions = store.getActions()
            expect(actions[0]).toEqual({
                type: 'SET_ALL_PROJECTS',
                projects
            })
            expect(actions[1]).toEqual({
                type: 'SET_CURRENT_PROJECT',
                project: projects[0]
            })
        })
    })
    
    describe('startSetTeamAdmins', () => {
        let store, actions
        
        describe('superadmin', () => {
            beforeAll(async () => {
                store = createMockStore({ user: '', admin: '' })
                await store.dispatch(startSetTeamAdmins('superadmin'))
                actions = store.getActions()
            })
        
            it('should set team admins and members', () => {
                expect(actions[0]).toEqual({
                    type: 'SET_TEAM_ADMINS',
                    team: teams[0],
                    admins: [ emails[0] ]
                })
                expect(actions[1]).toEqual({
                    type: 'SET_TEAM_MEMBERS',
                    team: teams[0],
                    members: [ emails[0] ]
                })
                expect(actions[2]).toEqual({
                    type: 'SET_TEAM_ADMINS',
                    team: teams[1],
                    admins: [ emails[1] ]
                })
                expect(actions[3]).toEqual({
                    type: 'SET_TEAM_MEMBERS',
                    team: teams[1],
                    members: [ emails[1] ]
                })
            })
        
            it('should set all teams', () => {
                expect(actions[4]).toEqual({
                    type: 'SET_ALL_TEAMS',
                    teams
                })
            })
        
            it('should set current team', () => {
                expect(actions[5]).toEqual({
                    type: 'SET_CURRENT_TEAM',
                    team: teams[0]
                })
            })
        })
    
        describe('project admin', () => {
            beforeAll(async () => {
                store = createMockStore({ user: { project: projects[0] }, admin: '' })
                await store.dispatch(startSetTeamAdmins('admin'))
                actions = store.getActions()
            })
    
            it('should set team members and admins', () => {
                expect(actions[0]).toEqual({
                    type: 'SET_TEAM_ADMINS',
                    team: teams[0],
                    admins: [ emails[0] ]
                })
                expect(actions[1]).toEqual({
                    type: 'SET_TEAM_MEMBERS',
                    team: teams[0],
                    members: [ emails[0] ]
                })
            })
    
            it('should set all teams and project for current project', () => {
                expect(actions[2]).toEqual({
                    type: 'SET_ALL_TEAMS',
                    teams: [ teams[0] ]
                })
                expect(actions[3]).toEqual({
                    type: 'SET_CURRENT_PROJECT',
                    project: projects[0]
                })
            })
    
            it('should set current team', () => {
                expect(actions[4]).toEqual({
                    type: 'SET_CURRENT_TEAM',
                    team: teams[0]
                })
            })
        })
    
        describe('team admin', () => {
            beforeAll(async () => {
                store = createMockStore({ user: '', admin: { isTeamAdmin: [ teams[0] ]} })
                await store.dispatch(startSetTeamAdmins('team'))
                actions = store.getActions()
            })
    
            it('should set admins and members for team', () => {
                expect(actions[0]).toEqual({
                    type: 'SET_TEAM_ADMINS',
                    team: teams[0],
                    admins: [ emails[0] ]
                })
                expect(actions[1]).toEqual({
                    type: 'SET_TEAM_MEMBERS',
                    team: teams[0],
                    members: [ emails[0] ]
                })
            })
    
            it('should set current team', () => {
                expect(actions[2]).toEqual({
                    type: 'SET_CURRENT_TEAM',
                    team: teams[0]
                })
            })
        })
    })
    
    describe('startAddProject', () => {
        let store, actions, 
            project = 'new project'
    
        beforeAll(async () => {
            store = createMockStore({})
            await store.dispatch(startAddProject(project, emails[0]))
            actions = store.getActions()
        })
    
            it('should add project', () => {
                expect(actions[0]).toEqual({
                    type: 'ADD_PROJECT',
                    project
                })
            })
    
            it('should add project admin', () => {
                expect(actions[1]).toEqual({
                    type: 'ADD_PROJECT_ADMIN',
                    project,
                    email: emails[0]
                })
            })
    
            it('should set current project', () => {
                expect(actions[2]).toEqual({
                    type: 'SET_CURRENT_PROJECT',
                    project
                })
            })
    
            it('should have added project to db', async () => {
                const snapshot = await db.doc(`projects/${project.replace(' ', '_')}`).get()
                expect(snapshot.exists).toBe(true)
            })
    })
    
    describe('startRemoveProject', () => {
        let store, actions, 
            project = 'new project'
    
        beforeAll(async () => {
            store = createMockStore({ admin: { admins: {
                [project]: [], [projects[0]]: []
            }, currentProject: project }})
            await store.dispatch(startRemoveProject(project))
            actions = store.getActions()
        })
    
        it('should set current project if current project is removed', () => {
            expect(actions[0]).toEqual({
                type: 'SET_CURRENT_PROJECT',
                project: projects[0]
            })
        })
    
        it('should remove project', () => {
            expect(actions[1]).toEqual({
                type: 'REMOVE_PROJECT',
                project,
                newAdminState: { [projects[0]]: [] }
            })
        })
    
        it('should have removed project from the db', async () => {
            const snapshot = await db.doc(`projects/${project.replace(' ', '_')}`).get()
            expect(snapshot.exists).toBe(false)
        })
    })
    
    describe('startAddProjectAdmin', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({})
            await store.dispatch(startAddProjectAdmin(projects[0], emails[1]))
            actions = store.getActions()
        })
    
        it('should add project admin', () => {
            expect(actions[0]).toEqual({
                type: 'ADD_PROJECT_ADMIN',
                project: projects[0],
                email: emails[1]
            })
        })
    
        it('should have added project admin to the db', async () => {
            const snapshot = await db.doc(`projects/${projects[0]}`).get()
            expect(snapshot.data().admins).toContain(emails[1])
        })
    })
    
    describe('startRemoveProjectAdmin', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({})
            await store.dispatch(startRemoveProjectAdmin(projects[0], emails[1]))
            actions = store.getActions()
        })
    
        it('should remove project admin', () => {
            expect(actions[0]).toEqual({
                type: 'REMOVE_PROJECT_ADMIN',
                project: projects[0],
                email: emails[1]
            })
        })
    
        it('should have removed project admin from the db', async () => {
            const snapshot = await db.doc(`projects/${projects[0]}`).get()
            expect(snapshot.data().admins).not.toContain(emails[1])
        })
    })
    
    describe('startAddTeam', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({ admin: {
                teamMembers: { [teams[0]]: [] } }, user: { email: emails[0] }
            })
            await store.dispatch(startAddTeam(projects[0], teams[0], emails[0]))
            actions = store.getActions()
        })
    
        it('should add team and set team snippet key ', () => {
            expect(actions[0]).toEqual({
                type: 'ADD_TEAM',
                team: teams[0]
            })
            expect(actions[1]).toEqual({
                type: 'SET_TEAM_SNIPPETS',
                team: teams[0],
                snippets: []
            })
        })
    
        it('should add team admin', () => {
            expect(actions[2]).toEqual({
                type: 'ADD_TEAM_ADMIN',
                team: teams[0],
                email: emails[0]
            })
        })
    
        it('should add team member if not already a member', () => {
            expect(actions[3]).toEqual({
                type: 'ADD_TEAM_MEMBER',
                team: teams[0],
                email: emails[0]
            })
        })
    
        it('should add team to isTeamAdmin and users teams if email is users', () => {
            expect(actions[4]).toEqual({
                type: 'ADD_USER_TEAM',
                team: teams[0]
            })
            expect(actions[5]).toEqual({
                type: 'ADD_IS_TEAM_ADMIN',
                team: teams[0]
            })
        })
    
        it('should set current team', () => {
            expect(actions[6]).toEqual({
                type: 'SET_CURRENT_TEAM',
                team: teams[0]
            })
        })
    
        it('should have added team to db', async () => {
            const snapshot = await db.doc(`teams/${teams[0]}`).get()
            expect(snapshot.exists).toBe(true)
        })
    })
    
    describe('startRemoveTeam', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({ 
                admin: { isTeamAdmin: [ teams[0] ],
                        teamAdmins: data.teamAdmins,
                        teamMembers: data.teamMembers,
                        currentTeam: teams[0]
                        },
                user: { teams: [ teams[0] ] },
                teams: { snippets: teamSnippets }
            })
            await store.dispatch(startRemoveTeam(projects[0], teams[0]))
            actions = store.getActions()
        })
    
        it('should set the current team to another team', () => {
            expect(actions[0]).toEqual({
                type: 'SET_CURRENT_TEAM',
                team: teams[1]
            })
        })
    
        it('should remove team from allTeams, teamAdmins, teamMembers', () => {
            expect(actions[1]).toEqual({
                type: 'REMOVE_TEAM',
                team: teams[0],
                newAdminState: { [teams[1]]: data.teamAdmins[teams[1]] },
                newMemberState: { [teams[1]]: data.teamMembers[teams[1]] }
            })
        })
    
        it('should remove team from user state if they are a member of removed team', () => {
            expect(actions[2]).toEqual({
                type: 'REMOVE_USER_TEAM',
                team: teams[0]
            })
        })
    
        it('should remove team from isTeamAdmin if user is admin of removed team', () => {
            expect(actions[3]).toEqual({
                type: 'REMOVE_IS_TEAM_ADMIN',
                team: teams[0]
            })
        })
    
        it('should remove team from team snippets object on removal of team', () => {
            expect(actions[4]).toEqual({
                type: 'REMOVE_TEAM_SNIPPETS',
                newSnippetState: { [teams[1]]: teamSnippets[teams[1]] }
            })
        })
    
        it('should have removed team from db', async () => {
            const snapshot = await db.doc(`teams/${teams[0]}`).get()
            expect(snapshot.exists).toBe(false)
        })
    })
    
    describe('startAddTeamAdmin', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({ user: { email: emails[0] } })
            await store.dispatch(startAddTeamAdmin(teams[0], emails[0]))
            actions = store.getActions()
        })
    
        it('should add team admin', () => {
            expect(actions[0]).toEqual({
                type: 'ADD_TEAM_ADMIN',
                team: teams[0],
                email: emails[0]
            })
        })
    
        it('should update user teams and isTeamAdmin if user is being added', () => {
            expect(actions[1]).toEqual({
                type: 'ADD_USER_TEAM',
                team: teams[0],
            })
    
            expect(actions[2]).toEqual({
                type: 'ADD_IS_TEAM_ADMIN',
                team: teams[0]
            })
        })
    
        it('should have added team admin to the db', async () => {
            const snapshot = await db.doc(`teams/${teams[0]}`).get()
            expect(snapshot.data().admins).toContain(emails[0])
        })
    })
    
    describe('startRemoveTeamAdmin', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({
                user: { email: emails[0], teams: teams[0] },
                admin: { isTeamAdmin: [ teams[0] ]}
            })
            await store.dispatch(startRemoveTeamAdmin(teams[0], emails[0]))
            actions = store.getActions()
        })
    
        it('should remove team admin and member', () => {
            expect(actions[0]).toEqual({
                type: 'REMOVE_TEAM_ADMIN',
                team: teams[0],
                email: emails[0]
            })
    
            expect(actions[1]).toEqual({
                type: 'REMOVE_TEAM_MEMBER',
                team: teams[0],
                email: emails[0]
            })
        })
    
        it('should remove team from user teams and isTeamAdmin', () => {
            expect(actions[2]).toEqual({
                type: 'REMOVE_USER_TEAM',
                team: teams[0]
            })
    
            expect(actions[3]).toEqual({
                type: 'REMOVE_IS_TEAM_ADMIN',
                team: teams[0]
            })
        })
    
        it('should have removed team admin from the db', async () => {
            const snapshot = await db.doc(`teams/${teams[0]}`).get()
            expect(snapshot.data().admins).not.toContain(emails[0])
        })
    })
    
    describe('startAddTeamMember', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({ user: { email: emails[0] }})
            await store.dispatch(startAddTeamMember(teams[0], emails[0]))
            actions = store.getActions()
        })
    
        it('should add team member', () => {
            expect(actions[0]).toEqual({
                type: 'ADD_TEAM_MEMBER',
                team: teams[0],
                email: emails[0]
            })
        })
    
        it('should add team to user teams', () => {
            expect(actions[1]).toEqual({
                type: 'ADD_USER_TEAM',
                team: teams[0]
            })
            // add test to make sure startSetTeamSnippets is called (?)
        })
    
        it('should have added team member to the db', async () => {
            const snapshot = await db.doc(`teams/${teams[0]}`).get()
            expect(snapshot.data().members).toContain(emails[0])
        })
    })
    
    describe('startRemoveTeamMember', () => {
        let store, actions
    
        beforeAll(async () => {
            store = createMockStore({ user: { email: emails[0] }})
            await store.dispatch(startRemoveTeamMember(teams[0], emails[0]))
            actions = store.getActions()
        })
    
        it('should remove team member', () => {
            expect(actions[0]).toEqual({
                type: 'REMOVE_TEAM_MEMBER',
                team: teams[0],
                email: emails[0]
            })
        })
    
        it('should remove team to user teams', () => {
            expect(actions[1]).toEqual({
                type: 'REMOVE_USER_TEAM',
                team: teams[0]
            }) 
        })
    
        it('should have removed team member from the db', async () => {
            const snapshot = await db.doc(`teams/${teams[0]}`).get()
            expect(snapshot.data().members).not.toContain(emails[0])
        })
    })
})


// action generators
/////////////////////////

it('should generate setUserRole action object', () => {
    const role = 'projectAdmin'
    const action = setUserRole(role)
    expect(action).toEqual({
        type: 'SET_USER_ROLE',
        role 
    })
})

it('should generate setProjectAdmins action object', () => {
    const project = 'test'
    const admins = 'admin@email.com'
    const action = setProjectAdmins(project, admins)
    expect(action).toEqual({
        type: 'SET_PROJECT_ADMINS',
        project,
        admins
    })
})

it('should generate setAllProjects action object', () => {
    const projects = [ 'test1', 'test2' ]
    const action = setAllProjects(projects)
    expect(action).toEqual({
        type: 'SET_ALL_PROJECTS',
        projects
    })
})

it('should generate setCurrentProject action object', () => {
    const project = 'test'
    const action = setCurrentProject(project)
    expect(action).toEqual({
        type: 'SET_CURRENT_PROJECT',
        project 
    })
})

it('should generate setCurrentTeam action object', () => {
    const team = 'test'
    const action = setCurrentTeam(team)
    expect(action).toEqual({
        type: 'SET_CURRENT_TEAM',
        team
    })
})

it('should generate setAllTeams action object', () => {
    const teams = [ 'team1', 'team2' ]
    const action = setAllTeams(teams)
    expect(action).toEqual({
        type: 'SET_ALL_TEAMS',
        teams
    })
})

it('should generate setIsTeamAdmin action object', () => {
    const teams = [ 'team1', 'team2' ]
    const action = setIsTeamAdmin(teams)
    expect(action).toEqual({
        type: 'SET_IS_TEAM_ADMIN',
        teams
    })
})

it('should generate setTeamAdmins action object', () => {
    const team = 'test'
    const admins = [ 'admin1', 'admin2' ]
    const action = setTeamAdmins(team, admins)
    expect(action).toEqual({
        type: 'SET_TEAM_ADMINS',
        team,
        admins
    })
})

it('should generate setTeamMembers action object', () => {
    const team = 'test'
    const members = [ 'member1', 'member2' ]
    const action = setTeamMembers(team, members)
    expect(action).toEqual({
        type: 'SET_TEAM_MEMBERS',
        team,
        members
    })
})

it('should generate addProject action object', () => {
    const project = 'test'
    const action = addProject(project)
    expect(action).toEqual({
        type: 'ADD_PROJECT',
        project
    })
})

it('should generate removeProject action object', () => {
    const project = 'test'
    const newAdminState = { testProject: [ 'admin' ] }
    const action = removeProject(project, newAdminState)
    expect(action).toEqual({
        type: 'REMOVE_PROJECT',
        project,
        newAdminState
    })
})

it('should generate addProjectAdmin action object', () => {
    const project = 'test'
    const email = 'admin@email.com'
    const action = addProjectAdmin(project, email)
    expect(action).toEqual({
        type: 'ADD_PROJECT_ADMIN',
        project,
        email
    })
})

it('should generate removeProjectAdmin action object', () => {
    const project = 'test'
    const email = 'admin@email.com'
    const action = removeProjectAdmin(project, email)
    expect(action).toEqual({
        type: 'REMOVE_PROJECT_ADMIN',
        project,
        email
    })
})

it('should generate addTeam action object', () => {
    const team = 'test'
    const action = addTeam(team)
    expect(action).toEqual({
        type: 'ADD_TEAM',
        team
    })
})


it('should generate removeTeam action object', () => {
    const team = 'test'
    const newAdminState = { [team]: [ 'admin' ] }
    const newMemberState = { [team]: [ 'member' ] }
    const action = removeTeam(team, newAdminState, newMemberState)
    expect(action).toEqual({
        type: 'REMOVE_TEAM',
        team,
        newAdminState,
        newMemberState
    })
})


it('should generate addTeamAdmin action object', () => {
    const team = 'test'
    const email = 'admin@email.com'
    const action = addTeamAdmin(team, email)
    expect(action).toEqual({
        type: 'ADD_TEAM_ADMIN',
        team,
        email
    })
})

it('should generate removeTeamAdmin action object', () => {
    const team = 'test'
    const email = 'admin@email.com'
    const action = removeTeamAdmin(team, email)
    expect(action).toEqual({
        type: 'REMOVE_TEAM_ADMIN',
        team,
        email
    })
})

it('should generate addIsTeamAdmin action object', () => {
    const team = 'test'
    const action = addIsTeamAdmin(team)
    expect(action).toEqual({
        type: 'ADD_IS_TEAM_ADMIN',
        team
    })
})

it('should generate removeIsTeamAdmin action object', () => {
    const team = 'test'
    const action = removeIsTeamAdmin(team)
    expect(action).toEqual({
        type: 'REMOVE_IS_TEAM_ADMIN',
        team
    })
})

it('should generate addTeamMember action object', () => {
    const team = 'test'
    const email = 'member@email.com'
    const action = addTeamMember(team, email)
    expect(action).toEqual({
        type: 'ADD_TEAM_MEMBER',
        team,
        email
    })
})

it('should generate removeTeamMember action object', () => {
    const team = 'test'
    const email = 'member@email.com'
    const action = removeTeamMember(team, email)
    expect(action).toEqual({
        type: 'REMOVE_TEAM_MEMBER',
        team,
        email
    })
})