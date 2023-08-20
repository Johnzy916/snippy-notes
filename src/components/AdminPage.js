import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import AddTeam from './AddTeam'
import AddMembers from './AddMembers'
import AddAdmins from './AddAdmins'
import AddProject from './AddProject'

export const AdminPage = ({ isProjectAdmin, isTeamAdmin, allTeams, teamMembers,
                      isSuperAdmin, currentProject, allProjects }) => {
  return (
  <div>
    <div className="page-header">
      <div className="content-container page-header__row">
        <h1 className="page-header__title">
          Admin Center
        </h1>
        <div className="page-header__links">
          <Link
            to="/snippy-notes/notes">
              <button className="btn btn--tertiary btn--shine">
                Notes
              </button>
          </Link>
          <Link
            to="/snippy-notes/snippets">
              <button className="btn btn--tertiary btn--shine">
                Snippets
              </button>
          </Link>
        </div>
      </div>
    </div>
    <div className="content-container">
      {
        (isSuperAdmin) && <AddProject />
      }
      {
        ((isSuperAdmin || isProjectAdmin) &&
        (allProjects.length > 0 || currentProject)) && <AddAdmins />
      }
      {
        ((isSuperAdmin || isProjectAdmin) &&
        (allProjects.length > 0 || currentProject)) && <AddTeam />
      }
      {
        ((isSuperAdmin || isProjectAdmin || isTeamAdmin) &&
        (allTeams.length > 0 || Object.keys(teamMembers).length > 0)) && <AddMembers />
      }
    </div>
  </div>)
};

const mapStateToProps = (state) => ({
  isProjectAdmin: state.admin.role === 'projectAdmin',
  isSuperAdmin: state.admin.role === 'superAdmin',
  currentProject: state.admin.currentProject,
  allProjects: state.admin.allProjects || [],
  allTeams: state.admin.allTeams || [],
  teamMembers: state.admin.teamMembers || {},
  isTeamAdmin: state.admin.isTeamAdmin && state.admin.isTeamAdmin.length > 0
})

export default connect(mapStateToProps)(AdminPage);
