import React from 'react';
import moment from 'moment-timezone';
import ObjectID from 'bson-objectid';
import {Button, Input, DropdownButton, MenuItem} from 'react-bootstrap';

import {UpsertMeetingMixin} from './util.js';
import {MeetingAdd, 
  MeetingList, 
  MeetingCategory,
  MeetingLocality,
  MeetingDate,
  AttendeeList
} from './components.js';

var MeetingBox = React.createClass({
  getInitialState: function() {
    return {meetings: []};
  },

  componentDidMount: function() {
    $.get('/api/meetings').done(function(data) {
      this.setState({meetings: data});
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <MeetingAdd/>
        <MeetingList data={this.state.meetings}/>
      </div>
    );
  },
});

var MeetingForm = React.createClass({
  mixins: [UpsertMeetingMixin],

  getInitialState: function() {
    return {
      meeting: {
        _id: this.props.params.id,
        category: "",
        locality: "",
        attendees: [],
        instances: []
      },
    };
  },

  componentDidMount: function() {
    $.get('/api/meetings/' + this.props.params.id, function(data) {
      this.setState( {meeting: data} );
    }.bind(this));
  },

  handleCategory: function(e) { 
    var tmp = this.state;
    tmp.meeting.category = e.target.value;
    this.setState(tmp);
  },

  handleLocality: function(e) {
    var tmp = this.state;
    tmp.meeting.locality = e.target.value;
    this.setState(tmp);
  },

  handleAttendee: function(e) {
    var tmp = this.state;
    var index = tmp.meeting.attendees.findIndex(function(a) {
      return a.id === e.target.id
    });
    tmp.meeting.attendees[index].fullname = e.target.value;
    this.setState(tmp);
  },

  handleAttendeeCat: function(e) {
    e.preventDefault();
    var tmp = this.state;
    var index = tmp.meeting.attendees.findIndex(function(a) {
      return a.id === e.target.id
    });
    tmp.meeting.attendees[index].category = e.target.innerHTML;
    this.setState(tmp);
  },

  handleAdd: function(e) {
    e.preventDefault();
    var tmp = this.state;
    var a = {
      fullname: "",
      id: ObjectID().str,
      category: "None"
    };
    tmp.meeting.attendees.push(a);
    this.setState(tmp);
  },

  handleDel: function(e) {
    e.preventDefault();
    var c = confirm("Are you sure you want to delete this attendee? \
      Their attendance record will be lost as well.");
    if (!c) {
      return;
    }
    var tmp = this.state;
    var index = tmp.meeting.attendees.findIndex(function(a) {
      return a.id === e.target.id
    });
    tmp.meeting.attendees.splice(index, 1);
    this.setState(tmp);
  },

  handleDate: function(d) {
    var id = this.props.params.id;
    this.context.router.replace({
      pathname: "/meetings/" + id,
      query: {date: d.format().split(":")[0]}
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.addMeeting(this.state.meeting,
      function(data) {
        this.context.router.push("/");
      }.bind(this)
    );
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    var date = this.props.location.query.date;

    return (
      <div>
        <h4>Meeting Information</h4>
        <form className="form-group" name="meetingAdd">
          <MeetingCategory category={this.state.meeting.category}
            handle={this.handleCategory}/>
          <MeetingLocality locality={this.state.meeting.locality}
            handle={this.handleLocality}/>
          <MeetingDate date={date ? moment(date) : moment(new Date())}
            handle={this.handleDate}/>
          <AttendeeList attendees={this.state.meeting.attendees} 
            handle={this.handleAttendee} handleAdd={this.handleAdd}
            handleCat={this.handleAttendeeCat} handleDel={this.handleDel}/>
          <Button 
            className="btn-primary btn-raised" block
            type="submit" style={{marginTop: "15px"}}
            onClick={this.handleSubmit}>
            Save Meeting
          </Button>
        </form>
      </div>
    );
  }
});

module.exports.MeetingForm = MeetingForm;
module.exports.MeetingBox = MeetingBox;
