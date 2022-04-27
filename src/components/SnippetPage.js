import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AddSnippet from './AddSnippet';
import SnippetList from './SnippetList';

export const SnippetPage = ({ userTeams, teamSnippets, isSuperAdmin, isProjectAdmin }) => {

  return (
  <div>
    <div className="page-header">
      <div className="content-container page-header__row">
        <h1 className="page-header__title">
          Your Snippets
        </h1>
        <div className="page-header__links">
          {
            ((userTeams && userTeams.length > 0) ||
            ((isSuperAdmin || isProjectAdmin) && Object.keys(teamSnippets).length > 0)) &&
              <Link
                className="page-header__link"
                to="/projects/snippynotes/app/team">
                Team snippets &#187;
              </Link>
          }
          <Link
            to="/notes">
              <button className="btn btn--tertiary btn--shine">
                Notes
              </button>
          </Link>
        </div>
      </div>
    </div>
    <div className="content-container">
      <AddSnippet />
      <SnippetList />
    </div>
  </div>)
};

const mapStateToProps = (state) => ({
  userTeams: state.user.teams,
  teamSnippets: state.teams.snippets || {},
  isSuperAdmin: state.admin.role === 'superAdmin',
  isProjectAdmin: state.admin.role === 'projectAdmin'
})

export default connect(mapStateToProps)(SnippetPage)
