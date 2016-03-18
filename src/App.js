import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router';

require('./site.css');

import {MeetingForm, MeetingBox} from './containers.js';
import {MeetingTypes} from './components.js';

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Link to="/">
          <h1>Attendance</h1>
        </Link>
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
   </Route>
 </Router>,
 document.getElementById('main')
);

