var dispatcher = require('../RouterLessEE.js');

var dogs = [
	'Chloe',
	'Teddy',
	'Walley',
	'Zoe'
];

exports.controller = dispatcher.getController('myController', [
	// Regular page get
	{
		path: '/home.html',
		method: 'GET',
		returnType: 'viewname',
		process: function(req, res){
			return 'home';
		}
	},

	{
		path: '/secondpage.html',
		method: 'GET',
		returnType: 'viewname',
		process: function(req, res){
			return 'test';
		}
	},
	
	// Json services
	
	// Get a dog by id
	{
		path: '/dogs/{id}',
		method: 'GET',
		responseHeader: {
			content: {'content-type': 'application/json'},
			code: 200
		},
		process: function(req, res, pathVars){
			res.write(JSON.stringify(dogs[pathVars.id]));
		}
	},
	
	// Create a dog
	{
		path: '/dogs/{name}',
		method: 'POST',
		responseHeader: {
			content: {'content-type': 'application/json'},
			code: 200
		},
		process: function(req, res, pathVars){
			dogs[dogs.length] = pathVars.name;
			res.write(dogs[dogs.length-1]);
			res.write('response write 2');
			res.write('response write 3');
			res.write('response write 4');
		}
	},
	
	// Does nothing this is a test
	{
		path: '/dogs',
		method: 'POST',
		process: function(req, res, pathVars){
			res.write('here');
			res.write('there');
		}
	},
	
	// Get all dogs
	{
		path: '/dogs',
		method: 'GET',
		cache: false,
		responseHeader: {
			content: {'content-type': 'application/json'},
			code: 200
		},
		process: function(req, res){
			res.write(JSON.stringify(dogs));
		}
	}
]);