var app = require('ethoinformatics-app');

app.set('couch-base-url', 'http://ec2-54-84-90-63.compute-1.amazonaws.com:5984/');

var activityService = {
	getBeginTime: function(d){ return d.beginTime; },
	getEndTime: function(d){ return d.endTime; },
	start: function(d){ d.beginTime = new Date(); },
	stop: function(d){ d.endTime = new Date(); },
	locationUpdate: function(d, l){ 
		d.locations = d.locations || [];
		d.locations.push(l);
	},
};

var eventService = {
	getTimestamp: function(d) { return d.timestamp; },
	create: function(d){ d.timestamp = new Date(); },
	locationUpdate: function(d, l){ d.location = l; },
};

var observerActivity = app.createDomain('observer-activity');
observerActivity.register('form-fields', require('./forms/observer-activity.json'));
observerActivity.register('activity', activityService);

var environment = app.createDomain('environment');
environment.register('form-fields', require('./forms/environment.json'));
observerActivity.register('activity', activityService);

var follow = app.createDomain('follow');
follow.register('form-fields', require('./forms/follow.json'));
observerActivity.register('activity', activityService);

var sighting = app.createDomain('sighting');
sighting.register('form-fields', require('./forms/sighting.json'));
sighting.register('event', eventService);

app.start();

