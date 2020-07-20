const data = {
    project: [ 'email', 'email2' ],
    project2: [ 'email', 'email3'],
    team: [ 'email', 'email4' ],
    team2: [ 'email', 'email5' ]
}

export const role = [ 'superAdmin', 'projectAdmin' ]

export const teamAdmins = { team: data.team, team2: data.team2 }

export const teamMembers = { team: data.team2, team2: data.team }

export const allTeams = [ 'team', 'team2' ]

export const currentTeam = 'team'

export const isTeamAdmin = [ 'team' ]

export const projectAdmins = { project: data.project, project2: data.project2 }

export const allProjects = [ 'project', 'project2' ]

export const currentProject = 'project'

export default {
    role,
    teamAdmins,
    teamMembers,
    allTeams,
    currentTeam,
    isTeamAdmin,
    projectAdmins,
    allProjects,
    currentProject
}