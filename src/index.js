/////////////////////////////////
//
// ethoinfo-project-app/src/index.js
//
// Sets up app-specific configuration
// * Creates data model by defining domains
// * Sets app-specific settings to be used in framework 
//
/////////////////////////////////

require('./update-check');
require('./background-mode');
var app = require('ethoinfo-framework'),
moment = require('moment');


///////////////////////////////
//
// SETTING DB DETAILS
//
///////////////////////////////

app.setting('couch-base-url', 'http://demo.ethoinformatics.org:5984/tonytest2');
app.setting('couch-username', 'supermonkey');


///////////////////////////////
//
// CONFIGURING THE MAP
//
///////////////////////////////

// app.setting('map-center', [-14.2031200, 23.7611400]); // Loloma, Zambia
// app.setting('map-center', [41.3839, -73.9405]); // Garrison NY
app.setting('map-center', [-0.638333, -76.15]); // tiputini
// app.setting('tile-layer-url', 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png');
app.setting('map-tile-layer-url', 'img/tiles/{z}/{x}/{y}.png');
app.setting('map-tile-layer-max-zoom', 19);
app.setting('map-tile-layer-min-zoom', 10);
app.setting('map-tile-layer-id', 'examples.map-i875mjb7');


///////////////////////////////
//
// REGISTERING BASIC SERVICES
//
///////////////////////////////

function registerStartAndEndServices(domain){
	domain.register('get-begin-time', function(d){ return d.beginTime || d.timestamp; });
	domain.register('get-end-time', function(d){ return d.endTime; });
	domain.register('set-begin-time', function(d){ d.beginTime = new Date(); });
	domain.register('set-end-time', function(d){ d.endTime = new Date(); });
}

function dateEqual(d1, d2){
	if (!d1 || !d2) return false;

	return d1.getFullYear() === d2.getFullYear() && 
		d1.getMonth() === d2.getMonth() && 
		d1.getDate() === d2.getDate();
}

// This should probably be moved to framework and just go on the top-level domain
var diaryLocationService = function(diary, locationData, settings){
	console.log('dLS');
	
	if (!dateEqual(new Date(), moment(diary.eventDate).toDate())) return false;
	console.log('inside');
	
	
	if(!window.geo) {
		console.log("geo not found, creating");
		window.geo = {};
	}
	
	var key = moment(diary.eventDate).format('YYYYMMDD');
	if(!window.geo[key]) {
		var fromStorage = window.localStorage.getItem(key);
		if(fromStorage) {
			window.geo[key] = JSON.parse(fromStorage);
		} else {
			window.geo[key] = {};			
		}
	}
	
	var geo = window.geo[key];
	if (!geo.footprint || 
		!geo.timestamps || 
		geo.footprint.coordinates.length != geo.timestamps.length){
		console.log("footprint not found, creating");
		geo.footprint = {
			type: 'LineString',
			coordinates: [ ]
		};
		geo.timestamps = [];
	}
		

	geo.footprint.coordinates.push([
		locationData.coords.longitude,
		locationData.coords.latitude,
		locationData.coords.altitude,
	]);
	geo.timestamps.push(new Date().getTime());
	
	window.localStorage.setItem(key, JSON.stringify(geo));
	
	console.log(window.geo);
	
	console.log("Saved location (" + geo.footprint.coordinates.length + " points)");

	
	
	//if (settings.user !== diary.observerId) return false;
	
	/*
	var storage = window.localStorage;
	
	if(debugCount == 1) { // clears storage on app restart -- this is just for dev/debugging
		storage.clear();
	}
	
	var geodata = storage.getItem('geodata');
	if(!geodata) {
		geodata = "";
	} else {
		geodata += ",";
	}
	
	console.log(geodata);
	
	geodata += latestCoordinates.timestamp.getTime() + "," + latestCoordinates.coords.latitude + "," + latestCoordinates.coords.longitude;
	storage.setItem('geodata', geodata);
	*/
	
	
	
	
	
/*
	if(!diary.geo) {
		console.log("geo not found, creating");
		diary.geo = {};
	}
	if (!diary.geo.footprint || 
		!diary.geo.timestamps || 
		diary.geo.footprint.coordinates.length != diary.geo.timestamps.length){
		console.log("footprint not found, creating");
		diary.geo.footprint = {
			type: 'LineString',
			coordinates: [ ]
		};
		diary.geo.timestamps = [];
	}
		

	diary.geo.footprint.coordinates.push([
		locationData.coords.longitude,
		locationData.coords.latitude,
		locationData.coords.altitude,
	]);
	diary.geo.timestamps.push(new Date().getTime());
	
	console.log(diary.geo);
	
	console.log("Saved location (" + diary.geo.footprint.coordinates.length + " points)");
*/


	return true;
};


var createIdGenerator = function(field){
	return function(entity){
		return entity.domainName +'-'+entity[field];
	};
};

var truncateString = function(str, length) {
	if(str.length > 8) {
		return str.substring(0, length) + '…';
	} else {
		return str;
	}
}


///////////////////////////////
//
// CONFIGURING THE DATA FIELDS
//
///////////////////////////////


// ****************************************************************************
// * DIARY                                                                    *
// ****************************************************************************
var diary = app.createDomain({name: 'diary', label: 'Diary'});
diary.register('color', '#3D9720');
diary.register('form-fields', {
		eventDate: { type: 'date', label: 'Date' }
	});

diary.register('uuid-generator', function(entity){
	var date = moment(entity.eventDate);
	return 'diary-' + date.format('YYYY-MM-DD');
});
diary.register('sort-by', 'eventDate');
diary.register('get-begin-time', function(d){ return moment(d.eventDate).startOf('day').toDate(); });
diary.register('get-end-time', function(d){ return moment(d.eventDate).endOf('day').toDate(); });
diary.register('set-begin-time', function(){ });
diary.register('set-end-time', function(){ });
diary.register('short-description', function(d){
	// return moment(d.eventDate, 'YYYY-MM-DD').format('MM/DD/YY');
		return moment(d.eventDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
});
// diary.register('icon', function() {
// 	return "something.png";
// });
diary.register('long-description', function(d){
	var h1 = 'Diary for ' + d.eventDate;

	return '<h1>'+h1+'</h1>';
});
diary.register('geo-aware', diaryLocationService);


// ****************************************************************************
// * CONTACT                                                                  *
// ****************************************************************************
var contact = app.createDomain({name: 'contact', label: 'Contact'});
contact.register('color', '#EECF20');
contact.register('form-fields', {
	title: { type: "text", required: true },
	taxon: { type: "lookup", domain: "taxon" },
	subjectId: { type: "lookup", domain: "animal-group" },
	samplingProtocol: { type: "lookup", domain: "sampling-protocol"  }
	//, basisOfRecord: { type: "text" } 
});

registerStartAndEndServices(contact);
contact.register('long-description', function(d){
	console.log("contact desc", arguments);
	var h1 = ""
	if(!d.title || d.title.length == 0) {
		h1 = 'Contact with ' + ' ';
	}
	h1 += this.getDescription('subjectId');

	return '<h1>'+h1+'</h1>';
});

contact.register('short-description', function(d){
	if(typeof d.title == 'string' && d.title.length > 0) {
		return truncateString(d.title, 8);			
	} else {
		return 'Contact';	
	}
});



// // ****************************************************************************
// // * MARK PATCH                                                                 *
// // ****************************************************************************
// var mark_patch = app.createDomain({name: 'mark_patch', label: 'mark_patch'});
// mark_patch.register('color', '#EECF20');
// mark_patch.register('form-fields', {
// 	taxon: { type: "lookup", domain: "taxon" },
// 	subjectId: { type: "lookup", domain: "animal-group" },
// 	title: { type: "text", required: true },
// 	samplingProtocol: { type: "text" },
// 	basisOfRecord: { type: "text" }
// });
//
// registerStartAndEndServices(mark_patch);
// mark_patch.register('long-description', function(d){
// 	console.log("mark_patch desc", arguments);
// 	var h1 = ""
// 	if(!d.title || d.title.length == 0) {
// 		h1 = 'mark_patch with ' + ' ';
// 	}
// 	h1 += this.getDescription('subjectId');
//
// 	return '<h1>'+h1+'</h1>';
// });
//
// mark_patch.register('short-description', function(d){
// 	if(typeof d.title == 'string' && d.title.length > 0) {
// 		return truncateString(d.title, 8);
// 	} else {
// 		return 'mark_patch';
// 	}
// });

// ****************************************************************************
// * MARK PATCH						  										  *
// ****************************************************************************
var mark_patch = app.createDomain({name: 'mark_patch', label:'mark_patch'});
mark_patch.register('form-fields', {
	"location": { "type": "text" }
});
registerStartAndEndServices(mark_patch);
mark_patch.register('long-description', function(d){
	var title = d.location;
	if(!title || title.length == 0) {
		title = d.id || d._id;
	}
	var h1 = 'Mark patch from ' + title;
	var h2 = '';
	var div = '';

	return '<h1>'+h1+'</h1>' +
		'<h3>' + h2 + '</h3>' +
		'<div style="font-style:italic;">' + div + '</div>';
});
mark_patch.register('short-description', function(){
	return 'Mark patch';
});

// ****************************************************************************
// * PLANT SAMPLE  										  *
// ****************************************************************************
var plantSample = app.createDomain({name: 'plant sample', label:'plant sample'});
plantSample.register('form-fields', {
	"location": { "type": "text" }
});
registerStartAndEndServices(plantSample);
plantSample.register('long-description', function(d){
	var title = d.location;
	if(!title || title.length == 0) {
		title = d.id || d._id;
	}
	var h1 = 'Plant sample from ' + title;
	var h2 = '';
	var div = '';

	return '<h1>'+h1+'</h1>' +
		'<h3>' + h2 + '</h3>' +
		'<div style="font-style:italic;">' + div + '</div>';
});
plantSample.register('short-description', function(){
	return 'Plant sample';
});

// ****************************************************************************
// * POOP SAMPLE 										  *
// ****************************************************************************
var poopSample = app.createDomain({name: 'fecal-sample', label:'Fecal Sample'});
poopSample.register('form-fields', {
	"location": { "type": "text" }
});
registerStartAndEndServices(poopSample);
poopSample.register('long-description', function(d){
	var title = d.location;
	if(!title || title.length == 0) {
		title = d.id || d._id;
	}
	var h1 = 'Fecal sample from ' + title;
	var h2 = '';
	var div = '';

	return '<h1>'+h1+'</h1>' + 
		'<h3>' + h2 + '</h3>' + 
		'<div style="font-style:italic;">' + div + '</div>';
});
poopSample.register('short-description', function(){
	return 'Fecal sample';
});


// ****************************************************************************
// * SCAN SAMPLE 							  *
// ****************************************************************************
var scanSample = app.createDomain({name: 'scan sample', label:'scan sample'});
scanSample.register('form-fields', {
	"location": { "type": "text" }
});
registerStartAndEndServices(scanSample);
scanSample.register('long-description', function(d){
	var title = d.location;
	if(!title || title.length == 0) {
		title = d.id || d._id;
	}
	var h1 = 'Scan sample from ' + title;
	var h2 = '';
	var div = '';

	return '<h1>'+h1+'</h1>' +
		'<h3>' + h2 + '</h3>' +
		'<div style="font-style:italic;">' + div + '</div>';
});
scanSample.register('short-description', function(){
	return 'Scan sample';
});



// ****************************************************************************
// * OBSERVER ACTIVITY                                                        *
// ****************************************************************************
var observerActivity = app.createDomain({name:'observer-activity', label: 'Observer Activity'});
observerActivity.register('form-fields', {
	title: { label: "Title", type: "text" },
	notes: { label: "Notes", type: "long-text" },
	sampleId: { label: "Sample ID", type: "text" }
});
observerActivity.register('short-description', function(d){
	return 'observer - ' + d.title;
});
registerStartAndEndServices(observerActivity);


// ****************************************************************************
// * FOCAL
// ****************************************************************************
var focalSample = app.createDomain({name: 'focal', label: 'Focal'});
focalSample.register('color', '#FB6725');
focalSample.register('form-fields', {
	"subjectId": { "type": "lookup", "domain": "animal", "features": [ "inline-create" ] },
	"title": { "type": "text" },
	"samplingProtocol": { type: "lookup", domain: "sampling-protocol"  }	
});
registerStartAndEndServices(focalSample);
focalSample.register('concurrent', false);
focalSample.register('long-description', function(d){
	var h1 = "";
	if(!d.title || d.title.length == 0) {
		h1 += "Focal of ";
	}
	h1 += this.getDescription();
	// var h1 = 'Focal (' + this.getDescription('subjectId') + ')';
	//var h2 = this.getDescription('age') + ' ' + this.getDescription('sex');

	return '<h1>'+h1+'</h1>';
		//'<h3>' + h2 + '</h3>';
});

focalSample.register('short-description', function(d){ 
	if(typeof d.title == 'string' && d.title.length > 0) {
		return truncateString(d.title, 8);			
	} else {
		return 'Focal';	
	}
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
// * FOCAL OBSERVATION                                                        *
// ****************************************************************************
var focalBehavior = app.createDomain({name: 'focal-behavior', label:'Behavior'});
focalBehavior.register('form-fields', {
	"type": { "type": "lookup", "domain": "focal-behavior-type" },
	"notes": { "label": "Notes", "type": "textarea" }
});
registerStartAndEndServices(focalBehavior);
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
// var socialFocalBehavior = app.createDomain({name: 'social-focal-behavior', label:'Social behavior'});
// socialFocalBehavior.register('form-fields', {
// 	"type": { "type": "lookup", "domain": "social-focal-behavior-type" },
// 	"age": { "type": "lookup", "domain": "age-class" },
// 	"sex": { "type": "lookup", "domain": "sex" },
// 	"animal": { "type": "lookup", "domain": "animal" }
// });
// registerStartAndEndServices(socialFocalBehavior);
// socialFocalBehavior.register('long-description', function(d){
// 	var h1 = this.getDescription('type') + ' towards ' + this.getDescription('animal');
// 	var h2 = this.getDescription('age') + ' ' + this.getDescription('sex');
// 	var div = d.notes;
//
// 	return '<h1>'+h1+'</h1>' +
// 		'<h3>' + h2 + '</h3>' +
// 		'<div style="font-style:italic;">' + div + '</div>';
// });



// ****************************************************************************
// * TREE MARKINGS SAMPLE                                                              *
// ****************************************************************************
var treeMarking = app.createDomain({name: 'tree-marking', label:'Tree marking'});
treeMarking.register('form-fields', {
	"location": { "type": "text" }
});
registerStartAndEndServices(treeMarking);
treeMarking.register('long-description', function(){
	var h1 = 'Tree marking from ' + this.getDescription('animal');
	var h2 = '';
	var div = '';

	return '<h1>'+h1+'</h1>' +
		'<h3>' + h2 + '</h3>' +
		'<div style="font-style:italic;">' + div + '</div>';
});
treeMarking.register('short-description', function(){
	return 'Tree marking';
});


// ****************************************************************************
// * CODES                                                                    *
// ****************************************************************************
function createSimpleCodeDomain(name, label){
	var domain = app.createDomain({name: name, label: label});
	domain.register('code-domain', true);
	domain.register('form-fields', [ { fields: { name: { type: 'text' } } } ]);
	domain.register('short-description', function(d){ return d.name; });
	domain.register('uuid-generator', createIdGenerator('name'));

	return domain;
}

createSimpleCodeDomain('animal-group', 'Animal Group');
createSimpleCodeDomain('taxon', 'Taxon');
createSimpleCodeDomain('age-class', 'Age Class');
createSimpleCodeDomain('sex', 'Sex');
createSimpleCodeDomain('focal-behavior-type', 'Behavior Type');
// createSimpleCodeDomain('social-focal-behavior-type', 'Social behavior type');
createSimpleCodeDomain('sampling-protocol', 'Sampling Protocol');
						

var user = createSimpleCodeDomain('user', 'User');
user.register('setting-lookup', true);

var animal = app.createDomain({name: 'animal', label: 'Animal'});
animal.register('code-domain', true);
animal.register('form-fields', {
	"name":  { "type": "text" },
	"taxon": { "type": "lookup", "domain": "taxon" },
	"age":   { "type": "lookup", "domain": "age-class" },
	"sex":   { "type": "lookup", "domain": "sex" },
	"group": { "type": "lookup", "domain": "animal-group" }
});
animal.register('short-description', function(d){ return d.name; });

// ,	"sampling":   { "type": "lookup", "domain": "sampling-protocol" }


///////////////////////////////
//
// SET DOMAIN RELATIONSHIPS
//
///////////////////////////////

diary.register('contacts', 		contact);
diary.register('collections', 	poopSample);
diary.register('collections', 	plantSample);
diary.register('mark patches',	mark_patch);

contact.register('focal samples', 	focalSample);
contact.register('scan samples', 	scanSample);
contact.register('collections', 	poopSample);
contact.register('collections', 	plantSample);
contact.register('mark patches', 	mark_patch);
contact.register('collections', 	treeMarking);

// focalSample.register('observations', socialFocalBehavior, {inline: true});
focalSample.register('observations', focalBehavior, {inline: true});
focalSample.register('collections', poopSample);
focalSample.register('collections', treeMarking);


///////////////////////////////
//
// SETUP FAKE DEVICE FOR DESKTOP
//
///////////////////////////////

if(window.device === undefined) {
	console.log("Defining device for in-browser testing");
	device = {
		available: true,
		cordova: null,
		manufacturer: null,
		model: null,
		platform: 'browser',
		uuid: '0000000000000000',
		version: "0.0.0"
	};
}

app.run();