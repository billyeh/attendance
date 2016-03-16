import React from 'react';
import moment from 'moment-timezone';
import {Button, Input, DropdownButton, MenuItem} from 'react-bootstrap';

require('react-datepicker/dist/react-datepicker.css');

import {UpsertMeetingMixin} from './util.js';
import {MeetingAdd, 
  MeetingList, 
  MeetingCategory,
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

  handler: function(path, valFunc) {
    var h = function(newVal) {
      var tmp = this.state;
      for (var i = 0; i < path.length - 1; i++) {
        tmp = tmp[path[i]];
      }
      tmp[path[path.length - 1]] = valFunc(newVal);
      this.setState(tmp);
    };
    h.bind(this);
    return h;
  },

  get handleCategory() { 
    return this.handler(['meeting', 'category'], function(e) {
      return e.target.value;
    });
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
        <form className="form-group" name="meetingAdd">
          <MeetingCategory category={this.state.meeting.category}
            handle={this.handleCategory}/>
          <MeetingDate date={date ? moment(date) : moment(new Date())}
            handle={this.handleDate}/>
          <AttendeeList attendees={this.state.meeting.attendees} />
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
