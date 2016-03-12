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

ReactDOM.render(
 <Router history={browserHistory}>
   <Route path="/" component={App}>
     <IndexRoute component={MeetingBox} />
     <Route path="meetings/:id" component={MeetingForm} />
   </Route>
 </Router>,
 document.getElementById('main')
);

