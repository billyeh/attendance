import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router';

require('./site.css');

import {MeetingForm, MeetingBox} from './containers.js';
import {MeetingTypes, signup, login} from './components.js';

var App = React.createClass({
  render: function() {
    return (
      <div>
        <a href="/">
          <h1>Attendance</h1>
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

