import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router';
import {Button} from 'react-bootstrap';

require('./css/site.css');

import {MeetingForm, MeetingBox, MeetingImport} from './containers.js';
import {MeetingTypes, signup, login} from './components.js';

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    return (
      <div className="container">
        <a href="/">
          <h1>
            Attendance
          </h1>
        </a>
        <a style={{fontSize: "2rem", marginTop: "-4rem"}} 
          className="pull-right" href="/logout">
          Logout
        </a>
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
     <Route path="meeting/:type" component={MeetingBox} />
     <Route path="/login" component={login} />
     <Route path="/signup" component={signup} />
   </Route>
 </Router>,
 document.getElementById('main')
);

