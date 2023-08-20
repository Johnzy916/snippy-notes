import React from 'react';
import { Link } from 'react-router-dom';
import image404 from '../images/page404.svg';

const NotFoundPage = () => (
  <div>
    <div className="page-header">
      <div className="content-container">
        <h1 className="page-header__title not-found-header center-all">
          Oops! You found a 404 page.
        </h1>
      </div>
    </div>
    <div className="content-container not-found-container">
        <img
            className="not-found-image"
            src={ image404 } alt="page not found"
        />
    <div className="center-all not-found-link-container">
      <Link className="not-found-link" to="/snippy-notes">Get me out of here</Link>
    </div>
    </div>
  </div>
);

export default NotFoundPage;
