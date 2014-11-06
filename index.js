var app = require('ethoinformatics-app');

var getStartTime = function(d) { return d.beginTime; };
var getEndTime = function(d) { return d.endTime; };
var getTimestamp = function(d) { return d.timestamp; };

var observerActivity = app.createDomain('observer-activity');
observerActivity.register('form-fields', require('./forms/observer-activity.json'));
observerActivity.register('timeline-activity', getStartTime, getEndTime);

var environment = app.createDomain('environment');
environment.register('form-fields', require('./forms/environment.json'));
environment.register('timeline-activity', getStartTime, getEndTime);

var follow = app.createDomain('follow');
follow.register('form-fields', require('./forms/follow.json'));
follow.register('timeline-activity', getStartTime, getEndTime);

var sighting = app.createDomain('sighting');
sighting.register('form-fields', require('./forms/sighting.json'));
sighting.register('timeline-event', getTimestamp);

app.start();

