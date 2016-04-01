var UpsertMeetingMixin = {
  addMeeting: function(meeting, callback) {
   $.ajax({
      type: 'POST', url: '/api/meetings', contentType: 'application/json',
      data: JSON.stringify(meeting),
      success: callback.bind(this),
      error: function(xhr, status, err) {
        console.log("Error adding meeting: ", err);
      }
    });
  }
};

var DeleteMeetingMixin = {
  delMeeting: function(id, callback) {
    $.ajax({
      type: 'DELETE', url: '/api/meetings/' + id,
      success: callback.bind(this),
      error: function(xhr, status, err) {
        console.log("Error deleting meeting: ", err);
      }
    });
  }
};

var MEETING_CATEGORIES = ['Other', 'Prayer Meeting', 'Lord\'s Table Meeting', 
  'Small Group Meeting'];
var ATTENDEE_CATEGORIES = ['None', 'College', 'New One', 'Full-time', 'Visitor', 
  'Community', 'YP'];

module.exports.UpsertMeetingMixin = UpsertMeetingMixin;
module.exports.DeleteMeetingMixin = DeleteMeetingMixin;
module.exports.MEETING_CATEGORIES = MEETING_CATEGORIES;
module.exports.ATTENDEE_CATEGORIES = ATTENDEE_CATEGORIES;
