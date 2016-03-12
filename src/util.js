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

module.exports.UpsertMeetingMixin = UpsertMeetingMixin;

