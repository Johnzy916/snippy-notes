import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AddSnippet from './AddSnippet';
import SnippetList from './SnippetList';

export const TeamSnippetPage = ({ isTeamAdmin, teamSnippets,
                          isSuperAdmin, isProjectAdmin }) => {

  return (
    <div>
      <div className="page-header">
        <div className="content-container page-header__row">
          <h1 className="page-header__title">
            Team Snippets
          </h1>
            <div className="page-header__links">
              <Link
                className="page-header__link"
                to="/projects/snippynotes/app/snippets">
                Your snippets &#187;
              </Link>
              <Link
                to="/projects/snippynotes/app/notes">
                  <button className="btn btn--tertiary btn--shine">
                    Notes
                  </button>
              </Link>
            </div>
        </div>
      </div>
      <div className="content-container">
        {
          teamSnippets &&
          Object.keys(teamSnippets).map(team => {
            return (
              <div className="team-container" key={team}>
                <div className="team-container__header">
                  { team.charAt(0).toUpperCase() + team.slice(1) }
                </div>
                {
                  (isSuperAdmin || isProjectAdmin ||
                  (isTeamAdmin && isTeamAdmin.includes(team))) &&
                  <AddSnippet type="admin" team={team} />
                }
                {
                  teamSnippets[team] &&
                    <SnippetList team={team} isAdmin={isTeamAdmin.includes(team)} />
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )

}

const mapStateToProps = (state) => ({
  isTeamAdmin: state.admin.isTeamAdmin || [],
  teamSnippets: state.teams.snippets || {},
  isSuperAdmin: state.admin.role === 'superAdmin',
  isProjectAdmin: state.admin.role === 'projectAdmin',
})

export default connect(mapStateToProps)(TeamSnippetPage);