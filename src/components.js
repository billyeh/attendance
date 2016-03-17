import React from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import {Button, Input, DropdownButton, MenuItem} from 'react-bootstrap';
import {Link} from 'react-router';

require('react-datepicker/dist/react-datepicker.css');

import {UpsertMeetingMixin} from './util.js';

var AttendeeList = React.createClass({
  render: function() {
    var attendees = this.props.attendees.map(function(attendee, i) {
      return (<Attendee attendee={attendee} key={i} {...this.props} />);
    }.bind(this));
    return (
      <div>
        <h4>Attendees
          <Button onClick={this.props.handleAdd}
            style={{marginLeft: "10px"}}>
            Add
          </Button>
        </h4>
        {attendees}
      </div>
    );
  }
});

var Attendee = React.createClass({
  render: function() {
    return (
      <div key={this.props.key} className="input-group">
        <DelBox {...this.props} />
        <input type="text" name="fullname" placeholder="Full Name"
          id={this.props.attendee.id}
          value={this.props.attendee.fullname} className="form-control"
          style={{marginBottom: "0px"}} onChange={this.props.handle}/>
        <TypeBox {...this.props} />
      </div>
    );
  }
});

var DelBox = React.createClass({
  render: function() {
    return (
      <span className="input-group-btn">
        <Button onClick={this.props.handleDel}
          bsStyle="danger"
          id={this.props.attendee.id}>
          &#10005;
        </Button>
      </span>
    );
  }
});

var TypeBox = React.createClass({
  render: function() {
    var checked = this.props.instance.attendance.find(function(a) {
      return a === this.props.attendee.id;
    }.bind(this));
    var checkStyle = checked ? "success" : "default";
    var items = ['None', 'College', 'New One', 'Full-time', 'Visitor', 
      'Community', 'YP'];
    var menuItems = items.map(function(i, index) {
      return (
        <MenuItem onClick={this.props.handleCat} key={index}
          id={this.props.attendee.id}>
          {i}
        </MenuItem>
      );
    }.bind(this));
    return (
      <span className="input-group-btn">
        <DropdownButton className="btn-large"
          title={this.props.attendee.category}
          id={this.props.attendee.id}>
          {menuItems}
        </DropdownButton>
        <Button onClick={this.props.handleCheck}
          bsStyle={checkStyle}
          id={this.props.attendee.id}>
          &#10003;
        </Button>
      </span>
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

var MeetingLocality = React.createClass({
  render: function() {
    return (
      <Input type="text" name="locality" placeholder="Locality"
        value={this.props.locality} onChange={this.props.handle}/>
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
      {
        category: "Untitled Meeting",
        locality: "",
        attendees: [],
        instances: []
      },
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
module.exports.MeetingLocality = MeetingLocality;
module.exports.MeetingDate = MeetingDate;
module.exports.AttendeeList = AttendeeList;
