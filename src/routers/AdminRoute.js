import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, useParams } from 'react-router-dom'
import Header from '../components/Header'
import AdminPage from '../components/AdminPage'
import DesktopOnly from '../components/DesktopOnly'

export const AdminRoute = ({
        isAuthenticated,
        isSuperAdmin,
        isProjectAdmin,
        isTeamAdmin,
        ...rest
}) => {
    return (
        <Route {...rest} component={() => (
            isAuthenticated && 
            ( isSuperAdmin || isProjectAdmin ) ||
            ( isTeamAdmin && isTeamAdmin.length > 0 ) ? (
                <div>
                    <DesktopOnly />
                    <Header />
                    <AdminPage />
                </div>
            ) : (
                // need a second to grab the state if reloading on page
                setTimeout(() => {
                    <Redirect to={`/projects/snippynotes/app/`} />
                }, 1000)
            )
        )} />
    )
}

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
    isProjectAdmin: state.admin.role === 'projectAdmin',
    isTeamAdmin: state.admin.isTeamAdmin,
    isSuperAdmin: state.admin.role === 'superAdmin'
})

export default connect(mapStateToProps)(AdminRoute)