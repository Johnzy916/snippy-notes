import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { startLogin } from '../actions/auth'
import googleLogo from '../images/brands/google-logo.png'

export const LoginPage = ({ startLogin }) => {
    return (
        <div className="box-layout">
            <div className="box-layout__box">
                <h1 className="box-layout__title">Snippy Notes</h1>
                <p className="box-layout__tagline">Take notes, save, and expand snippets with ease!</p>
                <button
                    className="btn btn--google btn--shine box-layout__button"
                    onClick={(e) => startLogin(e, 'google')}>
                        <img
                            className="box-layout__button-logo google-logo"
                            src={ googleLogo } alt="google logo"
                        />
                        Login with Google
                </button>
                <form 
                    className='box-layout__form'
                    onSubmit={(e) => {
                        e.preventDefault();
                        startLogin(e, 'email');
                    }}
                >
                <input
                    type="text"
                    name="email"
                    defaultValue="admintester@snippynotes.com"
                    readOnly
                />
                <input 
                    type="password"
                    name="password"
                    defaultValue="@TestPassword1"
                    readOnly
                />
                <button
                    className='btn btn--tertiary btn--shine box-layout__button'
                >
                    Log in as Admin
                </button>
                </form>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    startLogin: (e, type) => dispatch(startLogin(e, type))
});

export default connect(undefined, mapDispatchToProps)(LoginPage)
