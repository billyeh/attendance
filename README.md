# Attendance

Clone and run `npm install`. Then run `node server.js` and navigate to 
[localhost:3000](http://localhost:3000). Before development, start Webpack with `webpack -w` to watch
and build the application. Also ensure that MongoDB is installed and running.

##TODO
###collecting the data
* ~~add meeting category (Lord's Table, Prayer Meeting, Small Group, Other)~~
* ~~delete meeting~~
* ~~authentication to the app, with permissions based on locality?~~
* ~~authentication to database (backend stuff)~~
* ~~enter count of attendance instead of per-person~~
* ~~importing attendees~~
* filter attendees by typing
* exporting attendees
* import attendance
* ~~reuse data from home page to meeting view~~ don't think we want this in
case data is stale
* ~~real-time updates~~
* clone meeting
* use datetime-local input for date
* modularize code, probably switch to Redux :o
* ~~disconnect socket on unmount~~
* use callback to change save button to "saved"

###displaying the collected data
