import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, useParams } from 'react-router-dom'
import Header from '../components/Header'
import DesktopOnly from '../components/DesktopOnly'

export const PrivateRoute = ({
        isAuthenticated,
        component: Component,
        ...rest
}) => {
    return (
        <Route {...rest} component={(props) => (
            isAuthenticated ? (
                <div>
                    <DesktopOnly />
                    <Header />
                    <Component {...props}
                    />
                </div>
            ) : (
                <Redirect to={`/snippy-notes`} />
            )
        )} />
    )
}

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid,
})

export default connect(mapStateToProps)(PrivateRoute)
