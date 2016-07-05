import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import Link from 'react-router/lib/Link';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';
import Button from 'react-bootstrap/lib/Button';

require('./css/site.css');

import {MeetingForm, MeetingBox, MeetingImport, MeetingStats} from './containers.js';
import {MeetingTypes, signup, login} from './components.js';

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    var logout;
    if (['/login', '/signup'].indexOf(this.props.location.pathname) < 0) {
      logout = (
        <a style={{fontSize: "2rem", marginTop: "-4rem"}} 
          className="pull-right" href="/logout">
          Logout
        </a>
      );
    }
    return (
      <div className="container">
        <a href="/">
          <h1>
            Attendance
          </h1>
        </a>
        {logout}
        <hr />
      {this.props.children}
      </div>
    );
  }
});

ReactDOM.render(
 <Router history={browserHistory}>
   <Route path="/" component={App}>
     <IndexRoute component={MeetingTypes} />
     <Route path="meetings/:id" component={MeetingForm} />
     <Route path="meetings/:id/import" component={MeetingImport} />
     <Route path="meetings/:id/stats" component={MeetingStats} />
     <Route path="meeting/:type" component={MeetingBox} />
     <Route path="/login" component={login} />
     <Route path="/signup" component={signup} />
   </Route>
 </Router>,
 document.getElementById('main')
);

