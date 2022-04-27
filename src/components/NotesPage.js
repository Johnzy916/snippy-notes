import React from 'react';
import { connect } from 'react-redux';
import Notes from './Notes';
import { Link } from 'react-router-dom';


const NotesPage = () => (
  <div>
    <div className="page-header">
    <div className="content-container page-header__row">
        <h1 className="page-header__title">
          Notepad
        </h1>
        <div className="page-header__links">
          <Link
            to="/projects/snippynotes/app/snippets">
              <button className="btn btn--tertiary btn--shine">
                Snippets
              </button>
          </Link>
        </div>
      </div>
    </div>
    <div className="content-container">
      <Notes />
    </div>
  </div>
);

export default NotesPage;
