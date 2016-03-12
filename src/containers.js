import React from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import {Button, Input} from 'react-bootstrap';

require('react-datepicker/dist/react-datepicker.css');

import {UpsertMeetingMixin} from './util.js';
import {MeetingAdd, MeetingListItem, MeetingList} from './components.js';

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
        date: moment()
      }
    };
  },

  componentDidMount: function() {
    $.get('/api/meetings/' + this.props.params.id, function(data) {
      data.date = moment(data.date);
      this.setState( {meeting: data} );
    }.bind(this));
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var form = document.forms.meetingAdd;
    var meeting = {
      _id: this.props.params.id,
      category: form.category.value,
      date: this.state.meeting.date,
      attendees: []
    };
    this.addMeeting(meeting,
      function(data) {
        this.context.router.push("/");
      }.bind(this)
    );
  },

  handleChange: function(e) {
    var form = document.forms.meetingAdd;
    var meeting = {
      _id: this.props.params.id,
      category: form.category.value,
      date: this.state.meeting.date,
      attendees: []
    };
    this.setState( { meeting: meeting } );
  },

  handleDateChange: function(d) {
    var form = document.forms.meetingAdd;
    var meeting = {
      _id: this.props.params.id,
      category: form.category.value,
      date: d,
      attendees: []
    };
    this.setState({ meeting: meeting });
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    return (
      <div>
        <form name="meetingAdd">
          <Input type="text" name="category" placeholder="Category" block
            value={this.state.meeting.category} onChange={this.handleChange}/>
          <DatePicker 
            readOnly={true}
            className="form-control"
            selected={this.state.meeting.date} 
            onChange={this.handleDateChange} />
          <Button 
            className="btn-primary btn-raised" block
            type="submit" 
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
