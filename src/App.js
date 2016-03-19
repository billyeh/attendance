import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router';
import {Button} from 'react-bootstrap';

require('./site.css');

import {MeetingForm, MeetingBox} from './containers.js';
import {MeetingTypes, signup, login} from './components.js';

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    return (
      <div>
        <a href="/">
          <h1>
            Attendance
            <a style={{fontSize: "2rem", marginTop: "1.2rem"}} 
              className="pull-right" href="/logout">
              Logout
            </a>
          </h1>
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
     <Route path="meeting/:type" component={MeetingBox} />
     <Route path="/login" component={login} />
     <Route path="/signup" component={signup} />
   </Route>
 </Router>,
 document.getElementById('main')
);

