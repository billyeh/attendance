import React from 'react';
import moment from 'moment-timezone';
import {Button, Input} from 'react-bootstrap';
import {Link} from 'react-router';

import UpsertMeetingMixin from './util.js';

var MeetingAdd = React.createClass({
  mixins: [UpsertMeetingMixin],

  handleClick: function(e) {
    e.preventDefault();
    this.addMeeting(
      {category: "Test", date: Date(), attendees: []},
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
            {moment(this.props.data.date).format("LL")} {this.props.data.category}
          </h4>
        </div>
      </Link>
    );
  }
});

module.exports.MeetingAdd = MeetingAdd;
module.exports.MeetingListItem = MeetingListItem;
module.exports.MeetingList = MeetingList;
