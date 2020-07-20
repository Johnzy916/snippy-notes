import adminReducer from '../../reducers/admin'

it('should setup default state', () => {
    const state = adminReducer(undefined, { type: '@INIT' })
    expect(state).toEqual({})
})

it('should set user role on state', () => {
    const role = 'userRole'
    const state = adminReducer({}, {
        type: 'SET_USER_ROLE',
        role
    })
    expect(state.role).toBe(role)
})

it('should set project admins on state', () => {
    const project = 'project'
    const admins = [ 'admin1', 'admin1' ]
    const state = adminReducer({}, {
        type: 'SET_PROJECT_ADMINS',
        project,
        admins        
    })
    expect(state.admins[project]).toEqual(admins)
})

it('should set allProjects on state', () => {
    const projects = [ 'project1', 'project2' ]
    const state = adminReducer({}, {
        type: 'SET_ALL_PROJECTS',
        projects
    })
    expect(state.allProjects).toEqual(projects)
})

it('should set currentProject on state', () => {
    const project = 'project'
    const state = adminReducer({}, {
        type: 'SET_CURRENT_PROJECT',
        project
    })
    expect(state.currentProject).toBe(project)
})

it('should set isTeamAdmin on state', () => {
    const teams = [ 'team1', 'team2' ]
    const state = adminReducer({}, {
        type: 'SET_IS_TEAM_ADMIN',
        teams
    })
    expect(state.isTeamAdmin).toEqual(teams)
})

it('should set teamAdmins on state', () => {
    const team = 'team'
    const admins = [ 'admin1', 'admin2' ]
    const state = adminReducer({}, {
        type: 'SET_TEAM_ADMINS',
        team,
        admins
    })
    expect(state.teamAdmins[team]).toEqual(admins)
})

it('should set teamMembers on state', () => {
    const team = 'team'
    const members = [ 'member1', 'member2' ]
    const state = adminReducer({}, {
        type: 'SET_TEAM_MEMBERS',
        team,
        members
    })
    expect(state.teamMembers[team]).toEqual(members)
})

it('should set currentTeam on state', () => {
    const team = 'team'
    const state = adminReducer({}, {
        type: 'SET_CURRENT_TEAM',
        team
    })
    expect(state.currentTeam).toBe(team)
})

it('should set allTeams on state', () => {
    const teams = [ 'team1', 'team2' ]
    const state = adminReducer({}, {
        type: 'SET_ALL_TEAMS',
        teams
    })
    expect(state.allTeams).toEqual(teams)
})

it('should add new project to state when no keys exist', () => {
    const project = 'project'
    const state = adminReducer({}, {
        type: 'ADD_PROJECT',
        project
    })
    expect(state).toEqual({ 
        allProjects: [ project ],
        admins: { [project]: [] }
    })
})

it('should add new project to state when keys already exist', () => {
    const project = 'project2'
    const curState = {
        allProjects: [ 'project1' ],
        admins: { 'project1': [ 'admin1' ] }
    }
    const state = adminReducer(curState, {
        type: 'ADD_PROJECT',
        project
    })
    expect(state).toEqual({ 
        allProjects: [ ...curState.allProjects, project ],
        admins: { ...curState.admins, [project]: [] }
    })
})

it('should remove project from state', () => {
    const project = 'project'
    const newAdminState = { fakeProject: [ 'admin2' ] }
    const curState = { 
        allProjects: [ 'test', 'project' ],
        admins: { ...newAdminState, [project]: [ 'admin1' ] }
    }
    const state = adminReducer(curState, {
        type: 'REMOVE_PROJECT',
        project,
        newAdminState
    })
    expect(state).toEqual({ 
        allProjects: [ 'test' ],
        admins: newAdminState
    })
})

it('should remove nothing from state if project does not exist', () => {
    const project = 'fakeProject'
    const project2 = 'project2'
    const newAdminState = { [project2]: [ 'admin1' ] }
    const curState = { 
        allProjects: [ 'test', 'project' ],
        admins: { ...newAdminState }
    }
    const state = adminReducer(curState, {
        type: 'REMOVE_PROJECT',
        project,
        newAdminState
    })
    expect(state).toEqual(curState)
})

it('should add project admin to state', () => {
    const project = 'project'
    const email = 'email2'
    const curState = { admins: { [project]: [] }}
    const state = adminReducer(curState, {
        type: 'ADD_PROJECT_ADMIN',
        project,
        email
    })
    expect(state.admins[project]).toEqual([ email ])
})

it('should remove project admin from state', () => {
    const project = 'project'
    const email = 'admin@email.com'
    const curState = { admins: { [project]: [ 'email1', email ] }}
    const state = adminReducer(curState, {
        type: 'REMOVE_PROJECT_ADMIN',   
        project,
        email
    })
    expect(state.admins[project]).toEqual([ 'email1' ])
})

it('should remove nothing from admins state if admin does not exist', () => {
    const project = 'project'
    const email = 'test@email.com'
    const email2 = 'admin@email.com'
    const curState = { admins: { [project]: [ 'email1', email2 ] }}
    const state = adminReducer(curState, {
        type: 'REMOVE_PROJECT_ADMIN',   
        project,
        email
    })
    expect(state.admins[project]).toEqual(curState.admins[project])
})

it('should add new team to state when no keys exists', () => {
    const team = 'team'
    const state = adminReducer({}, {
        type: 'ADD_TEAM',
        team
    })
    expect(state).toEqual({ 
        allTeams: [ team ],
        teamMembers: { [team]: [] },
        teamAdmins: { [team]: [] }
     })
})

it('should add new team to state when keys already exists', () => {
    const team = 'team2'
    const curState = {
        allTeams: [ 'team1' ],
        teamMembers: { 'team1': [ 'member1' ] },
        teamAdmins: { 'team1': [ 'admin1' ] }
    }
    const state = adminReducer(curState, {
        type: 'ADD_TEAM',
        team
    })
    expect(state).toEqual({ 
        allTeams: [ ...curState.allTeams, team ],
        teamMembers: { ...curState.teamMembers, [team]: [] },
        teamAdmins: { ...curState.teamAdmins,  [team]: [] }
     })
})

it('should remove team from state', () => {
    const team = 'team'
    const newAdminState = { fakeTeam: [ 'admin1' ] }
    const newMemberState = { fakeTeam: [ 'member1' ] }
    const curState = {
        allTeams: [ 'test', team ],
        teamAdmins: { ...newAdminState, [team]: [ 'admin2' ] },
        teamMembers: { ...newMemberState, [team]: [ 'member2' ] }
    }
    const state = adminReducer(curState, {
        type: 'REMOVE_TEAM',
        team,
        newAdminState,
        newMemberState
    })
    expect(state).toEqual({
        allTeams: [ 'test' ],
        teamAdmins: newAdminState,
        teamMembers: newMemberState
    })
})

it('should not change team state if team does not exist', () => {
    const team = 'team'
    const team2 = 'team2'
    const newAdminState = { [team2]: [ 'admin1' ] }
    const newMemberState = { [team2]: [ 'member1' ] }
    const curState = {
        allTeams: [ 'test', team2 ],
        teamAdmins: { ...newAdminState },
        teamMembers: { ...newMemberState }
    }
    const state = adminReducer(curState, {
        type: 'REMOVE_TEAM',
        team,
        newAdminState,
        newMemberState
    })
    expect(state).toEqual(curState)
})

it('should add team admin to state', () => {
    const team = 'team'
    const email = 'admin@email.com'
    const curState = { teamAdmins: { [team]: [] } }
    const state = adminReducer(curState, {
        type: 'ADD_TEAM_ADMIN',
        team,
        email
    })
    expect(state.teamAdmins[team]).toEqual([ email ])
})

it('should remove team admin from state', () => {
    const team = 'team'
    const email = 'admin@email.com'
    const curState = { teamAdmins: { [team]: [ 'email1', email ] } }
    const state = adminReducer(curState, {
        type: 'REMOVE_TEAM_ADMIN',
        team,
        email
    })
    expect(state.teamAdmins[team]).toEqual([ 'email1' ])
})

it('should remove nothing from teamAdmins if admin does not exist', () => {
    const team = 'team'
    const email = 'test@email.com'
    const email2 = 'admin@email.com'
    const curState = { teamAdmins: { [team]: [ 'email1', email2 ] } }
    const state = adminReducer(curState, {
        type: 'REMOVE_TEAM_ADMIN',
        team,
        email
    })
    expect(state.teamAdmins[team]).toEqual(curState.teamAdmins[team])
})

it('should add team to isTeamAdmin state when no key exists', () => {
    const team = 'team'
    const state = adminReducer({}, {
        type: 'ADD_IS_TEAM_ADMIN',
        team
    })
    expect(state.isTeamAdmin).toEqual([ team ])
})

it('should add team to isTeamAdmin state when key exists', () => {
    const team = 'team2'
    const curState = { isTeamAdmin: [ 'team1' ] }
    const state = adminReducer(curState, {
        type: 'ADD_IS_TEAM_ADMIN',
        team
    })
    expect(state.isTeamAdmin).toEqual([ 'team1', team ])
})

it('should remove team from isTeamAdmin state', () => {
    const team = 'team'
    const curState = { isTeamAdmin: [ team ] }
    const state = adminReducer(curState, {
        type: 'REMOVE_IS_TEAM_ADMIN',
        team
    })
    expect(state.isTeamAdmin).toEqual([])
})

it('should remove nothing from isTeamAdmin if team does not exist', () => {
    const team = 'fakeTeam'
    const team2 = 'team'
    const curState = { isTeamAdmin: [ team2 ] }
    const state = adminReducer(curState, {
        type: 'REMOVE_IS_TEAM_ADMIN',
        team
    })
    expect(state.isTeamAdmin).toEqual(curState.isTeamAdmin)
})

it('should add team member to state', () => {
    const team = 'team'
    const email = 'member@email.com'
    const curState = { teamMembers: { [team]: [] } }
    const state = adminReducer(curState, {
        type: 'ADD_TEAM_MEMBER',
        team,
        email
    })
    expect(state.teamMembers[team]).toEqual([ email ])
})

it('should remove team member from state', () => {
    const team = 'team'
    const email = 'member@email.com'
    const curState = { teamMembers: { [team]: [ 'email1', email ] } }
    const state = adminReducer(curState, {
        type: 'REMOVE_TEAM_MEMBER',
        team,
        email
    })
    expect(state.teamMembers[team]).toEqual([ 'email1' ])
})

it('should remove nothing from state if team member does not exist', () => {
    const team = 'team'
    const email = 'test@email.com'
    const email2 = 'member@email.com'
    const curState = { teamMembers: { [team]: [ 'email1', email2 ] } }
    const state = adminReducer(curState, {
        type: 'REMOVE_TEAM_MEMBER',
        team,
        email
    })
    expect(state.teamMembers[team]).toEqual(curState.teamMembers[team])
})