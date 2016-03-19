import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router';

require('./site.css');

import {MeetingForm, MeetingBox} from './containers.js';

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Link to="/">
          <h1>Attendance</h1>
        </Link>
      {this.props.children}
      </div>
    );
  }
});

var login = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Log In</h1>
        <form action="/login" method="post">
          <div>
            <label>Username:</label>
            <input type="text" name="username"/>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password"/>
          </div>
          <div>
            <input type="submit" value="Log In"/>
          </div>
        </form>
      </div>
    );
  }
}); 

var signup = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Sign Up</h1>
        <form action="/signup" method="post">
          <div>
            <label>Username:</label>
            <input type="text" name="username"/>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password"/>
          </div>
          <div>
            <input type="submit" value="Sign Up"/>
          </div>
        </form>
      </div>
    );
  }
})

ReactDOM.render(
 <Router history={browserHistory}>
   <Route path="/" component={App}>
     <IndexRoute component={MeetingBox} />
     <Route path="meetings/:id" component={MeetingForm} />
   </Route>
   <Route path="/login" component={login}>
   </Route>
   <Route path="/signup" component={signup}>
   </Route>
 </Router>,
 document.getElementById('main')
);

