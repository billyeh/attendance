import React from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import {Button, Input, DropdownButton, MenuItem} from 'react-bootstrap';
import {Link} from 'react-router';

import {UpsertMeetingMixin} from './util.js';

require('react-datepicker/dist/react-datepicker.css');

var AttendeeList = React.createClass({
  render: function() {
    var attendees = this.props.attendees.map(function(attendee, i) {
      return <Attendee attendee={attendee} key={i}/>;
    });
    return (
      <div>
        {attendees}
      </div>
    );
  }
});

var Attendee = React.createClass({
  render: function() {
    var delBox = (
      <span className="input-group-btn">
        <Button>&#10005;</Button>
      </span>
    );
    var typeBox = (
      <span className="input-group-btn">
        <DropdownButton title={this.props.attendee.category}
          id="type-dropdown">
          <MenuItem key="1">K</MenuItem>
          <MenuItem key="2">S</MenuItem>
          <MenuItem key="3">N</MenuItem>
        </DropdownButton>
        <Button>&#10003;</Button>
      </span>
    );
    return (
      <div key={this.props.key} className="input-group">
        {delBox}
        <input type="text" name="fullname" placeholder="Full Name"
          value={this.props.attendee.fullname} className="form-control"
          style={{marginBottom: "0px"}}/>
        {typeBox}
      </div>
    );
  }
});

var MeetingDate = React.createClass({
  render: function() {
    return (
       <DatePicker 
         readOnly={true} className="form-group form-control"
         selected={this.props.date} onChange={this.props.handle} />
    );
  }
});

var MeetingCategory = React.createClass({
  render: function() {
    return (
      <Input type="text" name="category" placeholder="Category"
        value={this.props.category} onChange={this.props.handle}/>
    );
  }
});

var MeetingAdd = React.createClass({
  mixins: [UpsertMeetingMixin],

  handleClick: function(e) {
    e.preventDefault();
    this.addMeeting(
      {category: "Test", attendees: [], instances: []},
      function(data) {
        this.context.router.push("/meetings/" + data._id);
      }.bind(this)
    );
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    return (
      <Button 
        className="btn-primary btn-raised" block 
        onClick={this.handleClick}>
        Add Meeting
      </Button>
    );
  }
});

var MeetingList = React.createClass({
  render: function() {
    var meetingNodes = this.props.data.map(function(meeting) {
      return (
        <MeetingListItem key={meeting._id} data={meeting} />
      );
    });
    return (
      <div>
        {meetingNodes}
      </div>
    );
  }
});

var MeetingListItem = React.createClass({
  render: function() {
    return (
      <Link to={"/meetings/" + this.props.data._id}>
        <div>
          <h4>
            {this.props.data.category}
          </h4>
        </div>
      </Link>
    );
  }
});

module.exports.MeetingAdd = MeetingAdd;
module.exports.MeetingList = MeetingList;

module.exports.MeetingCategory = MeetingCategory;
module.exports.MeetingDate = MeetingDate;
module.exports.AttendeeList = AttendeeList;
