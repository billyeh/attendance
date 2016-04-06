import React from 'react';
import moment from 'moment-timezone';
import ObjectID from 'bson-objectid';
import {Button, Input, DropdownButton, MenuItem} from 'react-bootstrap';

import {
  UpsertMeetingMixin
} from './util.js';
import {
  MeetingAdd, 
  MeetingList, 
  MeetingTypes,
  MeetingName,
  MeetingCategory,
  MeetingLocality,
  MeetingDate,
  AttendeeList,
  AttendanceCount
} from './components.js';

var MeetingImport = React.createClass({
  mixins: [UpsertMeetingMixin],

  getInitialState: function() {
    return {
      meeting: {
        _id: this.props.params.id,
        name: "Untitled Meeting",
        category: "Other",
        locality: "",
        attendees: [],
        instances: []
      },
      contents: ""
    };
  },

  componentDidMount: function() {
    $.get('/api/meetings/' + this.props.params.id, function(data) {
      this.setState({
        meeting: data, 
        contents: "John Doe,New One\nJane,Student\nJoe"
      });
    }.bind(this));
  },

  changeContents: function(e) {
    this.setState({
      meeting: this.state.meeting,
      contents: e.target.value
    });
  },

  importAttendees: function(e) {
    var tmp = this.state.meeting;
    this.state.contents.split("\n").forEach(function(line) {
      var row = line.split(",");
      tmp.attendees.push({
        fullname: row[0],
        id: ObjectID().str,
        category: row[1] || "None"
      });
    });
    console.log(tmp);
    this.addMeeting(tmp, function(data) {
      this.context.router.push('/');
    }.bind(this));
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    return (
      <div>
        <Input type="textarea" 
          value={this.state.contents}
          onChange={this.changeContents}
          label="Paste names of attendees with optional categories separated by
          a comma (CSV format), as in the example. One name per line." />
        <Button bsStyle="primary" block onClick={this.importAttendees}>
          Add Attendees
        </Button>
      </div>
    );
  }
});

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
    var filteredMeetings = this.state.meetings.filter(function(m) {
      return m.category === this.props.params.type;
    }.bind(this));
    if (filteredMeetings.length === 0) {
      return <span>There are no meetings to display</span>;
    }
    return (
      <div>
        <MeetingList data={filteredMeetings}/>
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
        name: "Untitled Meeting",
        category: "Other",
        locality: "",
        attendees: [],
        instances: []
      },
    };
  },

  componentDidMount: function() {
    var socket = io();
    $.get('/api/meetings/' + this.props.params.id, function(data) {
      this.setState( {meeting: data} );
    }.bind(this));
  },

  handleCategory: function(e) {
    var tmp = this.state;
    tmp.meeting.category = $(e.target).val();
    this.setState(tmp);
  },

  handleName: function(e) { 
    var tmp = this.state;
    tmp.meeting.name= e.target.value;
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
      Their attendance record will be removed as well.");
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

  handleCount: function(e) {
    var tmp = this.state;
    var date = this.getDate();
    var instanceIndex = tmp.meeting.instances.findIndex(function(i) {
      return date.isSame(i.date, 'day');
    });
    var instance = {date: date, attendance: []};
    if (instanceIndex >= 0) {
      instance = tmp.meeting.instances[instanceIndex];
    }
    instance.count = e.target.value;
    if (instanceIndex >= 0) {
      tmp.meeting.instances[instanceIndex] = instance;
    } else {
      tmp.meeting.instances.push(instance);
    }
    this.setState(tmp);
  },

  handleCheck: function(e) {
    e.preventDefault();
    var tmp = this.state;
    var date = this.getDate();
    var instanceIndex = tmp.meeting.instances.findIndex(function(i) {
      return date.isSame(i.date, 'day');
    });
    var instance = {date: date, attendance: []};
    if (instanceIndex >= 0) {
      instance = tmp.meeting.instances[instanceIndex];
    }
    var attendeeIndex = instance.attendance.findIndex(function(a) {
      return a === e.target.id;
    });
    if (attendeeIndex >= 0) {
      instance.attendance.splice(attendeeIndex, 1);
    } else {
      instance.attendance.push(e.target.id);
    }
    if (instanceIndex >= 0) {
      tmp.meeting.instances[instanceIndex] = instance;
    } else {
      tmp.meeting.instances.push(instance);
    }
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
  
  getDate: function() {
    var date = this.props.location.query.date;
    date = date ? moment(date) : moment(new Date());
    return date;
  },

  getInstance: function() {
    var date = this.getDate();
    var instance = this.state.meeting.instances.find(function(i) {
      return date.isSame(i.date, 'day');
    });
    instance = instance || {date: date, attendance: []};
    return instance;
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    return (
      <form>
      <div className="row">
        <div className="col-md-6">
          <h4 style={{"marginBottom": "25px"}}>Meeting Information</h4>
          <MeetingName name={this.state.meeting.name}
            handle={this.handleName}/>
          <MeetingCategory category={this.state.meeting.category}
            handle={this.handleCategory} />
          <MeetingLocality locality={this.state.meeting.locality}
            handle={this.handleLocality}/>
        </div>
        <div className="col-md-6">
          <AttendeeList 
            date={this.getDate()}
            attendees={this.state.meeting.attendees} 
            instance={this.getInstance()}
            handle={this.handleAttendee} handleAdd={this.handleAdd}
            handleCat={this.handleAttendeeCat} handleDel={this.handleDel}
            handleCheck={this.handleCheck} handleDate={this.handleDate}
            {...this.props}
          />
          <AttendanceCount 
            count={this.getInstance().count || ""}
            handle={this.handleCount}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Button 
            className="btn-primary btn-raised" block
            type="submit" style={{marginTop: "15px"}}
            onClick={this.handleSubmit}>
            Save Meeting
          </Button>
        </div>
      </div>
      </form>
    );
  }
});

module.exports.MeetingForm = MeetingForm;
module.exports.MeetingBox = MeetingBox;
module.exports.MeetingImport = MeetingImport;
