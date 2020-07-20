import React from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { startLogout } from '../actions/auth'

export const Header = ({ startLogout, userName, isProjectAdmin,
                          isTeamAdmin, isSuperAdmin }) => {

  const { pathname } = useLocation()

  return (
  <header className="header">
      <div className="content-container">
        <div className="header__content">
          <Link
            className="header__title"
            to="/notes">
              <h1>Snippy Notes</h1><span className="beta-tag">BETA</span>
          </Link>
          <div>
            {
              ((isProjectAdmin || isSuperAdmin) ||
              (isTeamAdmin && isTeamAdmin.length > 0)) &&
              pathname !== `/admin` ? (
                <Link
                  className="btn--admin"
                  to={`/admin`} >
                    <button className="btn btn--secondary btn--shine">
                      Admin &#187;
                    </button>
                </Link>
              ) : (
                <div className="header__username">
                  { userName }
                </div>
              )
            }
            <button
              className="btn btn--primary btn--link"
              onClick={startLogout}>
                Logout
            </button>
        </div>
        </div>
      </div>
  </header>
)
          }

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout()),
})

const mapStateToProps = state => ({
  userName: state.user.name,
  isProjectAdmin: state.admin.role === 'projectAdmin',
  isSuperAdmin: state.admin.role === 'superAdmin',
  isTeamAdmin: state.admin.isTeamAdmin
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
