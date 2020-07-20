// const defaultState = {
//   admins: {},
//   allProjects: [],
//   currentProject: '',
//   allTeams: [],
//   currentTeam: '',
//   teamAdmins: {},
//   teamMembers: {},
//   isTeamAdmin: [],
//   role: ''
// }

// keeping default state as empty object
// to only show data entries based on user role in redux tools

export default (state = {}, action) => {

  switch (action.type) {
    case 'SET_USER_ROLE':
      return {
          ...state,
          role: action.role
      }
    case 'SET_PROJECT_ADMINS':
      return {
        ...state,
        admins: {
          ...state.admins,
          [action.project]: action.admins
        }
      }
    case 'SET_ALL_PROJECTS':
      return {
        ...state,
        allProjects: action.projects
      }
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.project
      }
    case 'SET_IS_TEAM_ADMIN':
      return {
          ...state,
          isTeamAdmin: action.teams
      }
    case 'SET_TEAM_ADMINS':
        return {
            ...state,
            teamAdmins: {
                ...state.teamAdmins,
                [action.team]: action.admins
            }
        }
    case 'SET_TEAM_MEMBERS':
        return {
            ...state,
            teamMembers: {
                ...state.teamMembers,
                [action.team]: action.members
            }
        }
    case 'SET_CURRENT_TEAM':
        return {
            ...state,
            currentTeam: action.team
        }
    case 'SET_ALL_TEAMS':
        return {
            ...state,
            allTeams: action.teams
        }
    case 'ADD_PROJECT':
      const allProjectsExists = !!state.allProjects
      const adminsExists = !!state.allProjects
        return {
          ...state,
          allProjects: allProjectsExists ? [
            ...state.allProjects,
            action.project
          ] : [ action.project ],
          admins: adminsExists ? {
            ...state.admins,
            [action.project]: []
          } : { [action.project]: [] }
        }
    case 'REMOVE_PROJECT':
        return {
          ...state,
          allProjects: state.allProjects.filter(project => {
            return project !== action.project
          }),
          admins: action.newAdminState
        }
    case 'ADD_PROJECT_ADMIN':
      return {
        ...state,
        admins: {
          ...state.admins,
          [action.project]: [
            ...state.admins[action.project],
            action.email
          ]
        }
      }
    case 'REMOVE_PROJECT_ADMIN':
      return {
        ...state,
        admins: {
          ...state.admins,
          [action.project]: state.admins[action.project].filter(admin => {
            return admin !== action.email
          })
        }
      }
      case 'ADD_TEAM':
        const allTeamsExists = !!state.allTeams
        const teamMembersExists = !!state.teamMembers
        const teamAdminsExists = !!state.teamAdmins
        return {
          ...state,
          allTeams: allTeamsExists ? [
            ...state.allTeams,
            action.team
          ] : [ action.team ],
          teamMembers: teamMembersExists ? {
            ...state.teamMembers,
            [action.team]: []
          } : { [action.team]: [] },
          teamAdmins: teamAdminsExists ? {
            ...state.teamAdmins,
            [action.team]: []
          } : { [action.team]: [] }
        }
      case 'REMOVE_TEAM':
        return {
          ...state,
          allTeams: state.allTeams.filter(team => {
            return team !== action.team
          }),
          teamAdmins: action.newAdminState,
          teamMembers: action.newMemberState
        }
      case 'ADD_TEAM_ADMIN':
        return {
            ...state,
            teamAdmins: {
                ...state.teamAdmins,
                [action.team]: [
                    ...state.teamAdmins[action.team],
                    action.email
                ]
            }
        }
    case 'REMOVE_TEAM_ADMIN':
        return {
            ...state,
            teamAdmins: {
                ...state.teamAdmins,
                [action.team]: state.teamAdmins[action.team].filter(admin => {
                    return admin !== action.email
                })
            }
        }
    case 'ADD_IS_TEAM_ADMIN':
      const keyExists = !!state.isTeamAdmin
        return {
          ...state,
          isTeamAdmin: keyExists ? [
            ...state.isTeamAdmin,
            action.team
          ] : [ action.team ]
        }
    case 'REMOVE_IS_TEAM_ADMIN':
        return {
          ...state,
          isTeamAdmin: state.isTeamAdmin.filter(team => {
            return team !== action.team
          })
        }
    case 'ADD_TEAM_MEMBER':
        return {
            ...state,
            teamMembers: {
                ...state.teamMembers,
                [action.team]: [
                    ...state.teamMembers[action.team],
                    action.email
                ]
            }
        }
    case 'REMOVE_TEAM_MEMBER':
        return {
            ...state,
            teamMembers: {
                ...state.teamMembers,
                [action.team]: state.teamMembers[action.team].filter(member => {
                    return member !== action.email
                })
            }
        }
    default:
      return state;
  }
}