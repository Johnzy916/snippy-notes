import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import NotesPage from '../components/NotesPage';
import SnippetPage from '../components/SnippetPage';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';
import TeamSnippetPage from '../components/TeamSnippetPage';
import AdminPage from '../components/AdminPage';

// create history manually to access history outside of BrowserRouter / pass into Router
export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>

      <Switch>
        {/* <PublicRoute path="/" component={WelcomePage} exact={true} /> */}
        <PublicRoute path="/projects/snippynotes/app/" component={LoginPage} exact={true} />
        <PrivateRoute path="/projects/snippynotes/app/notes" component={NotesPage} />
        <PrivateRoute path="/projects/snippynotes/app/snippets" component={SnippetPage} />
        <PrivateRoute path="/projects/snippynotes/app/team" component={TeamSnippetPage} />
        <AdminRoute path="/projects/snippynotes/app/admin" component={AdminPage} />
        <Route component={NotFoundPage} />
      </Switch>

    </div>
  </Router>
);

export default AppRouter;
