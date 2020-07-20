import React from 'react';

const DesktopOnly = () => {
    // overlay for when the screen is less than 550px
    // used for MVP as app is intended for desktop
    // would need to cover tracking keypress for Android and others
    // and tighten up media query design for mobile
    // -- can be found in PrivateRoute and AdminRoute
    return (
        <div className="mobile-not-available">
            This app was built for use on a desktop!
            <div className="desktop-overlay-img"></div>
            If you're on a desktop, please widen the screen.
        </div>
    );
}

export default DesktopOnly;