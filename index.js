console.log('wts');
var app = require('ethoinfo-framework');

app.setting('couch-base-url', 'http://104.236.9.143:5984/monkey_data');
app.setting('couch-username', 'monkey_app');

var activityService = {
	getBeginTime: function(d){ return d.beginTime || d.timestamp; },
	getEndTime: function(d){ return d.endTime; },
	start: function(d){ d.beginTime = new Date(); },
	stop: function(d){ d.endTime = new Date(); },
};

var diaryLocationService = {
	update: function(diary, locationData){
		console.log('diary location service');

		if (!diary.footprint){
			diary.footprint = {
				type: 'LineString',
				coordinates: [ ]
			};
		}

		diary.footprint.coordinates.push([
				locationData.coords.longitude,
				locationData.coords.latitude,
				locationData.coords.altitude,
			]);

		console.dir(diary);
	}
};


// ****************************************************************************
// * DIARY                                                                    *
// ****************************************************************************
var diary = app.createDomain({name: 'diary', label: 'Diary'});
diary.register('form-fields', require('./forms/diary.json'));
diary.register('activity', activityService);
diary.register('short-description', function(){ return 'Diary'; });
diary.register('long-description', function(d){
	var h1 = 'Diary for ' + d.eventDate;
	var div = d.eventRemarks;

	return '<h1>'+h1+'</h1>' + 
		'<div style="font-style:italic;">' + div + '</div>';
});
diary.register('location-aware', diaryLocationService);

// ****************************************************************************
// * CONTACT                                                                  *
// ****************************************************************************
var contact = app.createDomain({name: 'contact', label: 'Contact'});
contact.register('form-fields', require('./forms/contact.json'));
contact.register('activity', activityService);
contact.register('long-description', function(d){
	var h1 = 'Contact with ' + this.getDescription('taxon') + ' (' +this.getDescription('group')+ ')';
	var div = d.notes;

	return '<h1>'+h1+'</h1>' + 
		'<div style="font-style:italic;">' + div + '</div>';
});

contact.register('short-description', function(d){
	return 'Contact - ' + (d.title || d.sightingName);
});

// ****************************************************************************
// * OBSERVER ACTIVITY                                                        *
// ****************************************************************************
var observerActivity = app.createDomain({name:'observer-activity', label: 'Observer Activity'});
observerActivity.register('form-fields', require('./forms/observer-activity.json'));
observerActivity.register('activity', activityService);
observerActivity.register('short-description', function(d){
	return 'observer - ' + d.title;
});


// ****************************************************************************
// * OBSERVER ACTIVITY                                                        *
// ****************************************************************************
var focalSample = app.createDomain({name: 'focal', label: 'Focal'});

focalSample.register('form-fields', require('./forms/focal-sample.json'));
focalSample.register('activity', activityService);
focalSample.register('concurrent', false);
focalSample.register('long-description', function(d){
	var h1 = 'Focal of ' + this.getDescription('animal');
	var h2 = this.getDescription('age') + ' ' + this.getDescription('sex');
	var div = d.notes;

	return '<h1>'+h1+'</h1>' + 
		'<h3>' + h2 + '</h3>' + 
		'<div style="font-style:italic;">' + div + '</div>';
});

focalSample.register('short-description', function(d){
	return 'Focal - ' + (d.title || d.notes);
});


// var feedingBout = app.createDomain({name: 'feeding-bout', label: 'Feeding Bout'});
// feedingBout.register('form-fields', require('./forms/placeholder.json'));
// feedingBout.register('activity', activityService);
// feedingBout.register('long-description', function(d){
// 	var h1 = 'Feeding bout';
// 	var h2 = d.placeholder;

// 	return '<h1>'+h1+'</h1>' + 
// 		'<h3>' + h2 + '</h3>';
// });

// feedingBout.register('short-description', function(d){
// 	return 'Focal - ' + (d.title || d.notes);
// });

// ****************************************************************************
// * FOCAL BEHAVIOR                                                           *
// ****************************************************************************
var focalBehavior = app.createDomain({name: 'focal-behavior', label:'Behavior'});
focalBehavior.register('form-fields', require('./forms/focal-behavior.json'));
focalBehavior.register('activity', activityService);
focalBehavior.register('long-description', function(d){
	var h1 = 'Aggression towards ' + this.getDescription('animal');
	var h2 = this.getDescription('age') + ' ' + this.getDescription('sex');
	var div = d.notes;

	return '<h1>'+h1+'</h1>' + 
		'<h3>' + h2 + '</h3>' + 
		'<div style="font-style:italic;">' + div + '</div>';
});

// ****************************************************************************
// * SOCIAL FOCAL BEHAVIOR                                                           *
// ****************************************************************************
var socialFocalBehavior = app.createDomain({name: 'social-focal-behavior', label:'Social behavior'});
socialFocalBehavior.register('form-fields', require('./forms/social-focal-behavior.json'));
socialFocalBehavior.register('activity', activityService);
socialFocalBehavior.register('long-description', function(d){
	var h1 = this.getDescription('type') + ' towards ' + this.getDescription('animal');
	var h2 = this.getDescription('age') + ' ' + this.getDescription('sex');
	var div = d.notes;

	return '<h1>'+h1+'</h1>' + 
		'<h3>' + h2 + '</h3>' + 
		'<div style="font-style:italic;">' + div + '</div>';
});


// ****************************************************************************
// * POOP SAMPLE                                                              *
// ****************************************************************************
var poopSample = app.createDomain({name: 'poop-sample', label:'Poop sample'});
poopSample.register('form-fields', require('./forms/poop-sample.json'));
poopSample.register('activity', activityService);
poopSample.register('long-description', function(){
	var h1 = 'Poop sample from ' + this.getDescription('animal');
	var h2 = '';
	var div = '';

	return '<h1>'+h1+'</h1>' + 
		'<h3>' + h2 + '</h3>' + 
		'<div style="font-style:italic;">' + div + '</div>';
});
poopSample.register('short-description', function(){
	return 'Poop sample';
});


// ****************************************************************************
// * CODES                                                                    *
// ****************************************************************************
function createSimpleCodeDomain(name, label){
	var domain = app.createDomain({name: name, label: label});
	domain.register('code-domain', true);
	domain.register('form-fields', [ { fields: { name: { type: 'text' } } } ]);
	domain.register('short-description', function(d){ return d.name; });

	return domain;
}

createSimpleCodeDomain('animal-group', 'Animal Group');
createSimpleCodeDomain('user', 'User');
createSimpleCodeDomain('taxon', 'Taxon');
createSimpleCodeDomain('age-class', 'Age class');
createSimpleCodeDomain('sex', 'Sex');
createSimpleCodeDomain('focal-behavior-type', 'Behavior type');
createSimpleCodeDomain('social-focal-behavior-type', 'Social behavior type');

var animal = app.createDomain({name: 'animal', label: 'Animal'});
animal.register('code-domain', true);
animal.register('form-fields', require('./forms/animal.json'));
animal.register('short-description', function(d){ return d.name; });



// ****************************************************************************
// * SET DOMAIN RELATIONSHIPS                                                 *
// ****************************************************************************


// contact.register(focalSample, 'groupCompostions');
// contact.register(focalSample, 'rollCallCensuses');
// contact.register(focalSample, 'experiments');
// contact.register(feedingBout, 'feedingBouts');
// contact.register(focalSample, 'groupScans');
// contact.register(focalSample, 'focalSamples');
// contact.register(focal, 'processing');
// contact.register(focal, 'resourcePatches');
// focalSample.register(feedingBout, 'feedingBouts');
// focalSample.register(feedingBout, 'feedingBouts');

contact.register('focalSamples', focalSample);
contact.register('collections', poopSample);

focalSample.register('behaviors', socialFocalBehavior);
focalSample.register('behaviors', focalBehavior);
focalSample.register('collections', poopSample);

app.run();
